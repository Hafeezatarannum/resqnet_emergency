package com.example.resqnet.ui.sos

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Message
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqnet.theme.*
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*

@Composable
fun LiveTrackingScreen(
    sosId: String = "sos_demo",
    onResolveEmergency: () -> Unit
) {
    val defaultPos = LatLng(12.9716, 77.5946)
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(defaultPos, 15f)
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(ResQBackground)
    ) {
        // Map Display
        GoogleMap(
            modifier = Modifier.fillMaxSize(),
            cameraPositionState = cameraPositionState
        ) {
            Marker(
                state = MarkerState(position = defaultPos),
                title = "Your Location"
            )
            Marker(
                state = MarkerState(position = LatLng(12.9740, 77.5980)),
                title = "Volunteer En Route"
            )
        }

        // Overlay Card
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.BottomCenter)
                .background(ResQBackground)
                .clip(RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp))
                .border(1.dp, ResQCardBorder, RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp))
                .padding(20.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp)
        ) {
            // Status Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Box(
                        modifier = Modifier
                            .size(10.dp)
                            .clip(CircleShape)
                            .background(ResQSuccessGreen)
                    )
                    Text(text = "VOLUNTEER EN ROUTE", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = ResQSuccessGreen)
                }
                Text(text = "ETA: ~4 MINS", fontSize = 13.sp, fontWeight = FontWeight.Black, color = Color.White)
            }

            HorizontalDivider(color = ResQCardBorder)

            // Volunteer Info Card
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(ResQBrandBlue.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = Icons.Default.Person, contentDescription = "Volunteer", tint = ResQBrandBlue, modifier = Modifier.size(24.dp))
                }
                Spacer(modifier = Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(text = "Dr. Vikram Sethi", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    Text(text = "Certified First Responder • ⭐ 4.9", fontSize = 12.sp, color = ResQTextMuted)
                }

                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    IconButton(
                        onClick = {},
                        modifier = Modifier
                            .clip(CircleShape)
                            .background(ResQBrandBlue.copy(alpha = 0.2f))
                    ) {
                        Icon(imageVector = Icons.Default.Call, contentDescription = "Call", tint = ResQBrandBlue)
                    }

                    IconButton(
                        onClick = {},
                        modifier = Modifier
                            .clip(CircleShape)
                            .background(ResQSuccessGreen.copy(alpha = 0.2f))
                    ) {
                        Icon(imageVector = Icons.Default.Message, contentDescription = "Message", tint = ResQSuccessGreen)
                    }
                }
            }

            // Resolve SOS Button
            Button(
                onClick = onResolveEmergency,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                colors = ButtonDefaults.buttonColors(containerColor = ResQSuccessGreen)
            ) {
                Icon(imageVector = Icons.Default.CheckCircle, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(text = "I AM SAFE • RESOLVE SOS", fontWeight = FontWeight.Bold, fontSize = 13.sp)
            }
        }
    }
}
