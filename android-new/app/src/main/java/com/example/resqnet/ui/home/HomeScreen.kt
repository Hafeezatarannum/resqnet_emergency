package com.example.resqnet.ui.home

import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.widget.Toast
import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog
import com.example.resqnet.data.ResQNetRepository
import com.example.resqnet.data.RoleManager
import com.example.resqnet.data.SosEventItem
import com.example.resqnet.data.UserRole
import com.example.resqnet.theme.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.util.Calendar
import kotlin.math.sqrt

@Composable
fun HomeScreen(
    onTriggerSos: () -> Unit,
    onNavigateToVoiceSos: () -> Unit,
    onNavigateToShakeSos: () -> Unit,
    onNavigateToHospitals: () -> Unit,
    onNavigateToContacts: () -> Unit,
    onNavigateToProfile: () -> Unit,
    onNavigateToAlerts: () -> Unit,
    onNavigateToTracking: (String) -> Unit
) {
    val isVolunteer = RoleManager.currentRole == UserRole.VOLUNTEER

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(ResQBackground)
    ) {
        if (isVolunteer) {
            VolunteerHomeContent(onNavigateToTracking = onNavigateToTracking)
        } else {
            UserHomeContent(
                onTriggerSos = onTriggerSos,
                onNavigateToVoiceSos = onNavigateToVoiceSos,
                onNavigateToShakeSos = onNavigateToShakeSos,
                onNavigateToHospitals = onNavigateToHospitals,
                onNavigateToContacts = onNavigateToContacts,
                onNavigateToProfile = onNavigateToProfile,
                onNavigateToAlerts = onNavigateToAlerts
            )
        }
    }
}

@Composable
private fun UserHomeContent(
    onTriggerSos: () -> Unit,
    onNavigateToVoiceSos: () -> Unit,
    onNavigateToShakeSos: () -> Unit,
    onNavigateToHospitals: () -> Unit,
    onNavigateToContacts: () -> Unit,
    onNavigateToProfile: () -> Unit,
    onNavigateToAlerts: () -> Unit
) {
    val context = LocalContext.current
    val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
    val greeting = when {
        hour < 12 -> "Good Morning"
        hour < 17 -> "Good Afternoon"
        else -> "Good Evening"
    }

    val userName = ResQNetRepository.activeProfileState.full_name?.takeIf { it.isNotBlank() } ?: "User"
    var showVoiceDialog by remember { mutableStateOf(false) }

    // Accelerometer Sensor Listener for Shake SOS (Safely debounced)
    DisposableEffect(Unit) {
        val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
        val accelerometer = sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER)
        var lastShakeTime = 0L

        val listener = object : SensorEventListener {
            override fun onSensorChanged(event: SensorEvent?) {
                if (event == null) return
                val x = event.values[0]
                val y = event.values[1]
                val z = event.values[2]
                val acceleration = sqrt((x * x + y * y + z * z).toDouble()) - SensorManager.GRAVITY_EARTH
                if (acceleration > 14) { // Vigorous shake / drop threshold
                    val currentTime = System.currentTimeMillis()
                    if (currentTime - lastShakeTime > 4000) { // 4 sec debounce
                        lastShakeTime = currentTime
                        onNavigateToShakeSos()
                    }
                }
            }

            override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) {}
        }

        if (accelerometer != null) {
            sensorManager.registerListener(listener, accelerometer, SensorManager.SENSOR_DELAY_NORMAL)
        }

        onDispose {
            sensorManager.unregisterListener(listener)
        }
    }

    // Voice SOS Custom Listening Modal
    if (showVoiceDialog) {
        VoiceListeningDialog(
            onDismiss = { showVoiceDialog = false },
            onTrigger = {
                showVoiceDialog = false
                onNavigateToVoiceSos()
            }
        )
    }

    // SOS Pulse Animation
    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val pulseScale by infiniteTransition.animateFloat(
        initialValue = 1f,
        targetValue = 1.06f,
        animationSpec = infiniteRepeatable(
            animation = tween(1000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 12.dp, bottom = 24.dp)
    ) {
        // Dynamic Greeting Name
        item {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "$greeting, $userName 👋",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )
                Spacer(modifier = Modifier.height(4.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    Text(text = "Current Status:", fontSize = 13.sp, color = ResQTextMuted)
                    Box(
                        modifier = Modifier
                            .size(8.dp)
                            .clip(CircleShape)
                            .background(ResQSuccessGreen)
                    )
                    Text(text = "Safe", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = ResQSuccessGreen)
                }
            }
        }

        // GIANT PULSING SOS PANIC BUTTON
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 8.dp),
                contentAlignment = Alignment.Center
            ) {
                // Background aura ring
                Box(
                    modifier = Modifier
                        .size(170.dp)
                        .scale(pulseScale)
                        .clip(CircleShape)
                        .background(ResQPrimaryRed.copy(alpha = 0.25f))
                )

                // SOS Trigger Button
                Box(
                    modifier = Modifier
                        .size(140.dp)
                        .clip(CircleShape)
                        .background(
                            Brush.radialGradient(
                                colors = listOf(ResQPrimaryGlow, ResQPrimaryRed)
                            )
                        )
                        .clickable { onTriggerSos() },
                    contentAlignment = Alignment.Center
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.Warning,
                            contentDescription = "SOS Alert",
                            tint = Color.White,
                            modifier = Modifier.size(36.dp)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "TRIGGER SOS",
                            color = Color.White,
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Black
                        )
                    }
                }
            }
        }

        // Voice SOS & Shake SOS Quick Cards
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Voice SOS Card
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(20.dp))
                        .background(ResQCardBackground)
                        .border(1.dp, ResQCardBorder, RoundedCornerShape(20.dp))
                        .clickable { showVoiceDialog = true }
                        .padding(14.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(ResQBrandBlue.copy(alpha = 0.2f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Mic,
                                contentDescription = "Voice SOS",
                                tint = ResQBrandBlue,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(text = "Voice SOS", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            Text(text = "Say \"Help\"", fontSize = 11.sp, color = ResQTextMuted)
                        }
                    }
                }

                // Shake SOS Card
                Box(
                    modifier = Modifier
                        .weight(1f)
                        .clip(RoundedCornerShape(20.dp))
                        .background(ResQCardBackground)
                        .border(1.dp, ResQCardBorder, RoundedCornerShape(20.dp))
                        .clickable { onNavigateToShakeSos() }
                        .padding(14.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(ResQWarningOrange.copy(alpha = 0.2f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.Vibration,
                                contentDescription = "Shake SOS",
                                tint = ResQWarningOrange,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(10.dp))
                        Column {
                            Text(text = "Shake SOS", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            Text(text = "Drop phone", fontSize = 11.sp, color = ResQTextMuted)
                        }
                    }
                }
            }
        }

        // 4 Quick Grid Tiles
        item {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    QuickTile(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.Group,
                        iconBg = ResQBrandBlue.copy(alpha = 0.2f),
                        iconTint = ResQBrandBlue,
                        title = "Find\nVolunteers",
                        onClick = onNavigateToAlerts
                    )

                    QuickTile(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.LocalHospital,
                        iconBg = ResQSuccessGreen.copy(alpha = 0.2f),
                        iconTint = ResQSuccessGreen,
                        title = "Nearby\nHospitals",
                        onClick = onNavigateToHospitals
                    )
                }

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    QuickTile(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.ContactPhone,
                        iconBg = ResQWarningOrange.copy(alpha = 0.2f),
                        iconTint = ResQWarningOrange,
                        title = "Emergency\nContacts",
                        onClick = onNavigateToContacts
                    )

                    QuickTile(
                        modifier = Modifier.weight(1f),
                        icon = Icons.Default.Favorite,
                        iconBg = ResQPrimaryRed.copy(alpha = 0.2f),
                        iconTint = ResQPrimaryRed,
                        title = "Medical\nProfile",
                        onClick = onNavigateToProfile
                    )
                }
            }
        }

        // System Activity Check Log
        item {
            Column {
                Text(
                    text = "System Status",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = ResQTextMuted,
                    modifier = Modifier.padding(start = 4.dp, bottom = 8.dp)
                )
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(18.dp))
                        .background(ResQCardBackground)
                        .border(1.dp, ResQCardBorder, RoundedCornerShape(18.dp))
                        .padding(14.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(ResQSuccessGreen.copy(alpha = 0.2f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.CheckCircle,
                                contentDescription = "Operational",
                                tint = ResQSuccessGreen,
                                modifier = Modifier.size(18.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(12.dp))
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = "All Systems Operational", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            Text(text = "GPS & Supabase Live Network Connected", fontSize = 11.sp, color = ResQTextMuted)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun VoiceListeningDialog(
    onDismiss: () -> Unit,
    onTrigger: () -> Unit
) {
    var countdown by remember { mutableStateOf(3) }

    LaunchedEffect(Unit) {
        while (countdown > 0) {
            delay(1000)
            countdown--
        }
        onTrigger()
    }

    Dialog(onDismissRequest = onDismiss) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(28.dp))
                .background(Color(0xFF0F2236))
                .border(1.dp, ResQPrimaryRed.copy(alpha = 0.4f), RoundedCornerShape(28.dp))
                .padding(24.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(72.dp)
                        .clip(CircleShape)
                        .background(ResQPrimaryRed.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = Icons.Default.Mic, contentDescription = "Mic", tint = ResQPrimaryRed, modifier = Modifier.size(36.dp))
                }

                Text(
                    text = "Listening for Voice SOS...",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )

                Text(
                    text = "Say \"Help\" or \"SOS\" — Auto-activating in $countdown second${if (countdown == 1) "" else "s"}...",
                    fontSize = 12.sp,
                    color = ResQTextMuted,
                    textAlign = TextAlign.Center
                )

                Button(
                    onClick = onTrigger,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(48.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = ResQPrimaryRed)
                ) {
                    Text(text = "TRIGGER EMERGENCY DISPATCH NOW", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}

@Composable
private fun QuickTile(
    modifier: Modifier = Modifier,
    icon: ImageVector,
    iconBg: Color,
    iconTint: Color,
    title: String,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .background(ResQCardBackground)
            .border(1.dp, ResQCardBorder, RoundedCornerShape(20.dp))
            .clickable { onClick() }
            .padding(16.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(iconBg),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = icon,
                    contentDescription = title,
                    tint = iconTint,
                    modifier = Modifier.size(22.dp)
                )
            }
            Spacer(modifier = Modifier.height(10.dp))
            Text(
                text = title,
                fontSize = 12.sp,
                fontWeight = FontWeight.SemiBold,
                color = Color.White,
                textAlign = TextAlign.Center,
                lineHeight = 16.sp
            )
        }
    }
}

@Composable
private fun VolunteerHomeContent(
    onNavigateToTracking: (String) -> Unit
) {
    var isOnline by remember { mutableStateOf(true) }
    var sosAlerts by remember { mutableStateOf<List<SosEventItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(isOnline) {
        if (isOnline) {
            isLoading = true
            sosAlerts = ResQNetRepository.getLiveSosEvents()
            isLoading = false
        } else {
            sosAlerts = emptyList()
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 12.dp, bottom = 24.dp)
    ) {
        // Availability Switch Card
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(ResQCardBackground)
                    .border(1.dp, ResQCardBorder, RoundedCornerShape(20.dp))
                    .padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text(
                            text = if (isOnline) "Responder Status: ONLINE" else "Responder Status: OFFLINE",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (isOnline) ResQSuccessGreen else ResQTextMuted
                        )
                        Text(
                            text = if (isOnline) "Listening for nearby SOS calls via Supabase" else "Switch online to receive alerts",
                            fontSize = 11.sp,
                            color = ResQTextMuted
                        )
                    }

                    Switch(
                        checked = isOnline,
                        onCheckedChange = { isOnline = it },
                        colors = SwitchDefaults.colors(
                            checkedThumbColor = Color.White,
                            checkedTrackColor = ResQSuccessGreen
                        )
                    )
                }
            }
        }

        // Live Alerts Feed Section
        item {
            Text(
                text = "Live Broadcast Alerts (${sosAlerts.size})",
                fontSize = 15.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )
        }

        if (isLoading) {
            item {
                Box(modifier = Modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = ResQPrimaryRed)
                }
            }
        } else if (isOnline && sosAlerts.isNotEmpty()) {
            items(sosAlerts) { alert ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .background(ResQCardBackground)
                        .border(1.dp, ResQPrimaryRed.copy(alpha = 0.5f), RoundedCornerShape(20.dp))
                        .padding(16.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = (alert.emergency_type ?: "Emergency").uppercase(),
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                color = ResQPrimaryRed
                            )
                            Text(
                                text = "Severity: ${alert.severity ?: "High"}",
                                fontSize = 11.sp,
                                color = ResQTextMuted
                            )
                        }

                        Text(
                            text = "Victim ID: ${alert.user_id} (0.5 km away)",
                            fontSize = 13.sp,
                            color = Color.White
                        )

                        Spacer(modifier = Modifier.height(4.dp))

                        Button(
                            onClick = {
                                coroutineScope.launch {
                                    ResQNetRepository.acceptSosRequest(alert.id)
                                    onNavigateToTracking(alert.id)
                                }
                            },
                            modifier = Modifier.fillMaxWidth(),
                            colors = ButtonDefaults.buttonColors(containerColor = ResQSuccessGreen)
                        ) {
                            Icon(imageVector = Icons.Default.Navigation, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "ACCEPT REQUEST & NAVIGATE", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }
                    }
                }
            }
        } else {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(32.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Text(text = if (isOnline) "No active emergency alerts at the moment." else "You are currently offline.", color = ResQTextMuted, fontSize = 13.sp)
                }
            }
        }
    }
}
