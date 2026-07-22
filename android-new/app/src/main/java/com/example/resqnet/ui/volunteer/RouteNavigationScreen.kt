package com.example.resqnet.ui.volunteer

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.SubdirectoryArrowRight
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqnet.theme.*

@Composable
fun RouteNavigationScreen(
    onEndNavigation: () -> Unit = {}
) {
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(ResQBackground)
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Header & Back Button (Picture 3)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = onEndNavigation,
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(ResQCardBackground)
            ) {
                Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column {
                Text(text = "Turn-by-turn", fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color.White)
                Text(text = "0.4 km • 2 min", fontSize = 12.sp, color = ResQTextMuted)
            }
        }

        // Instruction Box (Picture 3)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(22.dp))
                .background(ResQCardBackground)
                .border(1.dp, ResQCardBorder, RoundedCornerShape(22.dp))
                .padding(18.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(14.dp)) {
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .background(ResQBrandBlue.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = Icons.Default.SubdirectoryArrowRight, contentDescription = null, tint = ResQBrandBlue, modifier = Modifier.size(24.dp))
                }

                Column {
                    Text(text = "Turn right onto MG Road", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    Text(text = "in 200 m", fontSize = 12.sp, color = ResQTextMuted)
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Navigation Map Area (Picture 3)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .clip(RoundedCornerShape(28.dp))
                .background(Color(0xFF0D1B2A))
                .border(1.dp, ResQPrimaryRed.copy(alpha = 0.4f), RoundedCornerShape(28.dp))
                .clickable {
                    try {
                        val gmmIntentUri = Uri.parse("google.navigation:q=13.0900,80.2800&mode=d")
                        val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
                        mapIntent.setPackage("com.google.android.apps.maps")
                        context.startActivity(mapIntent)
                    } catch (_: Exception) {
                        val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://maps.google.com/?q=13.0900,80.2800"))
                        context.startActivity(browserIntent)
                    }
                }
                .padding(20.dp),
            contentAlignment = Alignment.Center
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Icon(imageVector = Icons.Default.Navigation, contentDescription = null, tint = ResQPrimaryRed, modifier = Modifier.size(36.dp))

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(14.dp))
                        .background(Color.White)
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text(text = "Help Needed (0.4 km)", color = Color.Black, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(14.dp))
                        .background(ResQSuccessGreen)
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Text(text = "ResQ Fleet 1", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }

                Text(
                    text = "Tap map to open Turn-by-Turn in Google Maps app",
                    fontSize = 11.sp,
                    color = ResQTextMuted
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Red End Navigation Button (Picture 3)
        Button(
            onClick = onEndNavigation,
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            shape = RoundedCornerShape(16.dp),
            colors = ButtonDefaults.buttonColors(containerColor = ResQPrimaryRed)
        ) {
            Text(text = "End Navigation", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }
    }
}
