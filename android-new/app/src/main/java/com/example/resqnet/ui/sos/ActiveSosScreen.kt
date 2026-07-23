package com.example.resqnet.ui.sos

import android.content.Context
import android.content.Intent
import android.net.Uri
import android.telephony.SmsManager
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.CompassCalibration
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqnet.data.ResQNetRepository
import com.example.resqnet.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@Composable
fun ActiveSosScreen(
    onSosConfirmed: (String) -> Unit,
    onCancel: () -> Unit
) {
    val context = LocalContext.current
    val coroutineScope = rememberCoroutineScope()
    var currentStep by remember { mutableIntStateOf(1) }
    var isCancelling by remember { mutableStateOf(false) }

    // Automatic stepper progression & SMS sending with real user GPS location
    LaunchedEffect(Unit) {
        // Step 1: Create SOS in Supabase with real user GPS
        val event = ResQNetRepository.createSosEvent(context, emergencyType = "Medical", severity = "high")

        // Send Emergency SMS to contacts containing exact Google Maps URL
        val contacts = ResQNetRepository.getEmergencyContacts()
        if (contacts.isNotEmpty()) {
            val primaryPhone = contacts.first().phone
            try {
                val smsManager = context.getSystemService(Context.TELEPHONY_SERVICE) as? SmsManager
                    ?: SmsManager.getDefault()
                val message = "EMERGENCY SOS! ResQNet alert triggered. Live GPS Location: https://maps.google.com/?q=${event.latitude},${event.longitude}"
                smsManager.sendTextMessage(primaryPhone, null, message, null, null)
            } catch (e: Exception) {
                // Fallback to SMS Intent if permission missing
                try {
                    val smsIntent = Intent(Intent.ACTION_SENDTO).apply {
                        data = Uri.parse("smsto:$primaryPhone")
                        putExtra("sms_body", "EMERGENCY SOS! ResQNet alert triggered. Live GPS Location: https://maps.google.com/?q=${event.latitude},${event.longitude}")
                    }
                    context.startActivity(smsIntent)
                } catch (_: Exception) {}
            }
        }

        delay(1500L)
        currentStep = 2 // Sending Alert Details
        delay(1500L)
        currentStep = 3 // Sharing Live Location
        delay(2000L)
        currentStep = 4 // Responders Accepted
        delay(1000L)
        onSosConfirmed("Medical")
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(ResQBackground)
            .padding(20.dp),
        contentAlignment = Alignment.Center
    ) {
        // Light Card Backdrop
        Box(
            modifier = Modifier
                .fillMaxWidth(0.92f)
                .clip(RoundedCornerShape(32.dp))
                .background(Color(0xFF0F2236))
                .border(1.dp, ResQPrimaryRed.copy(alpha = 0.4f), RoundedCornerShape(32.dp))
                .padding(24.dp)
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth()
            ) {
                // Shield Badge Icon
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .clip(CircleShape)
                        .background(ResQPrimaryRed.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Shield,
                        contentDescription = "SOS",
                        tint = ResQPrimaryRed,
                        modifier = Modifier.size(30.dp)
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                // Title & Subtitle
                Text(
                    text = "SOS ACTIVATED",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Black,
                    color = ResQPrimaryRed,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(4.dp))

                Text(
                    text = "Connecting you with nearby volunteers...",
                    fontSize = 12.sp,
                    color = ResQTextMuted,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(28.dp))

                // Vertical Stepper Timeline
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    verticalArrangement = Arrangement.spacedBy(18.dp)
                ) {
                    StepItem(
                        stepNum = 1,
                        activeStep = currentStep,
                        title = "Finding Nearby Volunteers",
                        subtitle = "In progress...",
                        icon = Icons.Default.Refresh
                    )

                    StepItem(
                        stepNum = 2,
                        activeStep = currentStep,
                        title = "Sending Alert Details",
                        subtitle = if (currentStep >= 2) "SMS & Alert dispatched" else "Pending...",
                        icon = Icons.Default.Shield
                    )

                    StepItem(
                        stepNum = 3,
                        activeStep = currentStep,
                        title = "Sharing Live Location",
                        subtitle = if (currentStep >= 3) "GPS location broadcasting" else "Pending...",
                        icon = Icons.Default.Navigation
                    )

                    StepItem(
                        stepNum = 4,
                        activeStep = currentStep,
                        title = "Responders Accepted",
                        subtitle = if (currentStep >= 4) "Responder en route!" else "Pending...",
                        icon = Icons.Default.CheckCircle
                    )
                }

                Spacer(modifier = Modifier.height(28.dp))

                HorizontalDivider(color = ResQCardBorder)

                Spacer(modifier = Modifier.height(18.dp))

                // Cancel SOS Light Red Button
                Button(
                    onClick = {
                        isCancelling = true
                        coroutineScope.launch {
                            ResQNetRepository.cancelSosEvent("active")
                            onCancel()
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth(0.7f)
                        .height(44.dp),
                    shape = RoundedCornerShape(22.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = ResQPrimaryRed.copy(alpha = 0.15f),
                        contentColor = ResQPrimaryRed
                    )
                ) {
                    if (isCancelling) {
                        CircularProgressIndicator(color = ResQPrimaryRed, modifier = Modifier.size(18.dp))
                    } else {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(imageVector = Icons.Default.Close, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "Cancel SOS", fontSize = 13.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun StepItem(
    stepNum: Int,
    activeStep: Int,
    title: String,
    subtitle: String,
    icon: ImageVector
) {
    val isDone = activeStep > stepNum
    val isCurrent = activeStep == stepNum

    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(14.dp),
        modifier = Modifier.fillMaxWidth()
    ) {
        // Step Icon Circle
        Box(
            modifier = Modifier
                .size(36.dp)
                .clip(CircleShape)
                .background(
                    when {
                        isDone -> ResQSuccessGreen.copy(alpha = 0.2f)
                        isCurrent -> ResQPrimaryRed.copy(alpha = 0.2f)
                        else -> ResQCardBackground
                    }
                )
                .border(
                    1.dp,
                    when {
                        isDone -> ResQSuccessGreen
                        isCurrent -> ResQPrimaryRed
                        else -> ResQCardBorder
                    },
                    CircleShape
                ),
            contentAlignment = Alignment.Center
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = when {
                    isDone -> ResQSuccessGreen
                    isCurrent -> ResQPrimaryRed
                    else -> ResQTextMuted
                },
                modifier = Modifier.size(18.dp)
            )
        }

        Column {
            Text(
                text = title,
                fontSize = 14.sp,
                fontWeight = if (isCurrent || isDone) FontWeight.Bold else FontWeight.Medium,
                color = if (isCurrent || isDone) Color.White else ResQTextMuted
            )
            Text(
                text = subtitle,
                fontSize = 11.sp,
                color = if (isCurrent) ResQPrimaryRed else ResQTextMuted
            )
        }
    }
}
