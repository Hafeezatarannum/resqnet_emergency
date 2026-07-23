package com.example.resqnet.ui.sos

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqnet.theme.*

@Composable
fun FindVolunteersRadarScreen(
    onCancel: () -> Unit = {},
    onVolunteerMatched: (String) -> Unit = {}
) {
    val infiniteTransition = rememberInfiniteTransition(label = "radar")

    val pulse1 by infiniteTransition.animateFloat(
        initialValue = 0.6f,
        targetValue = 1.6f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "pulse1"
    )

    val pulse2 by infiniteTransition.animateFloat(
        initialValue = 0.6f,
        targetValue = 1.6f,
        animationSpec = infiniteRepeatable(
            animation = tween(2000, delayMillis = 600, easing = LinearEasing),
            repeatMode = RepeatMode.Restart
        ),
        label = "pulse2"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(ResQBackground)
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Spacer(modifier = Modifier.height(20.dp))

        // Radar Scanning Animation Center (Matching Pic 2)
        Box(
            modifier = Modifier
                .size(260.dp),
            contentAlignment = Alignment.Center
        ) {
            // Outer Wave 1
            Box(
                modifier = Modifier
                    .size(220.dp)
                    .scale(pulse1)
                    .clip(CircleShape)
                    .border(1.dp, ResQBrandBlue.copy(alpha = 0.3f), CircleShape)
            )

            // Outer Wave 2
            Box(
                modifier = Modifier
                    .size(220.dp)
                    .scale(pulse2)
                    .clip(CircleShape)
                    .border(1.dp, ResQPrimaryRed.copy(alpha = 0.4f), CircleShape)
            )

            // Inner Radar Circle
            Box(
                modifier = Modifier
                    .size(140.dp)
                    .clip(CircleShape)
                    .background(ResQBrandBlue.copy(alpha = 0.15f))
                    .border(1.dp, ResQBrandBlue.copy(alpha = 0.5f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Box(
                    modifier = Modifier
                        .size(54.dp)
                        .clip(CircleShape)
                        .background(ResQPrimaryRed),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.LocationOn,
                        contentDescription = "Radar Pin",
                        tint = Color.White,
                        modifier = Modifier.size(28.dp)
                    )
                }
            }
        }

        // Center Titles & Badge (Matching Pic 2)
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.padding(horizontal = 16.dp)
        ) {
            Text(
                text = "Searching nearby volunteers...",
                fontSize = 24.sp,
                fontWeight = FontWeight.Black,
                color = Color.White,
                textAlign = TextAlign.Center
            )

            Text(
                text = "Broadcasting your SOS within 2 km radius",
                fontSize = 13.sp,
                color = ResQTextMuted,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(6.dp))

            // Waiting Badge (Matching Pic 2)
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(16.dp))
                    .background(ResQSuccessGreen.copy(alpha = 0.15f))
                    .border(1.dp, ResQSuccessGreen.copy(alpha = 0.4f), RoundedCornerShape(16.dp))
                    .padding(horizontal = 16.dp, vertical = 6.dp)
            ) {
                Text(
                    text = "● Waiting for volunteer to accept...",
                    color = ResQSuccessGreen,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        // Cancel SOS & Dev Link (Matching Pic 2)
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.fillMaxWidth()
        ) {
            Button(
                onClick = onCancel,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E3A5F))
            ) {
                Text(text = "Cancel SOS", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
            }

            Text(
                text = "[Dev: Force Simulate Match]",
                fontSize = 12.sp,
                color = ResQTextMuted.copy(alpha = 0.8f),
                fontWeight = FontWeight.Medium,
                modifier = Modifier
                    .clickable { onVolunteerMatched("simulated-vol-1") }
                    .padding(8.dp)
            )
        }
    }
}
