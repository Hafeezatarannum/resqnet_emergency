package com.example.resqnet.ui.volunteer

import android.content.Context
import android.content.Intent
import android.location.Location
import android.location.LocationManager
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
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqnet.data.ResQNetRepository
import com.example.resqnet.data.SosEventItem
import com.example.resqnet.theme.*

@Composable
fun RouteNavigationScreen(
    onEndNavigation: () -> Unit = {}
) {
    val context = LocalContext.current
    var volunteerLat by remember { mutableDoubleStateOf(12.9716) }
    var volunteerLng by remember { mutableDoubleStateOf(77.5946) }
    var targetSosEvent by remember { mutableStateOf<SosEventItem?>(null) }

    LaunchedEffect(Unit) {
        targetSosEvent = ResQNetRepository.localSosEvents.firstOrNull()
        try {
            val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
            val loc = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
                ?: locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)
            if (loc != null) {
                volunteerLat = loc.latitude
                volunteerLng = loc.longitude
            }
        } catch (_: Exception) {}
    }

    val victimLat = targetSosEvent?.latitude ?: 12.9716
    val victimLng = targetSosEvent?.longitude ?: 77.5946
    val victimName = targetSosEvent?.user_id ?: "Victim Emergency"
    val victimAddress = targetSosEvent?.address ?: "Indiranagar, Bangalore"

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Header & Back Button
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
                    .background(MaterialTheme.colorScheme.surface)
            ) {
                Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = MaterialTheme.colorScheme.onSurface)
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column {
                Text(text = "Turn-by-turn Navigation", fontSize = 20.sp, fontWeight = FontWeight.Black, color = MaterialTheme.colorScheme.onBackground)
                Text(text = "Victim: $victimName • $victimAddress", fontSize = 12.sp, color = ResQPrimaryRed, fontWeight = FontWeight.Bold)
            }
        }

        // Instruction Box
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(22.dp))
                .background(MaterialTheme.colorScheme.surface)
                .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(22.dp))
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
                    Text(text = "Head towards $victimAddress", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
                    Text(text = "Live GPS Navigation to Victim Location", fontSize = 12.sp, color = ResQSuccessGreen, fontWeight = FontWeight.Bold)
                }
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        // Navigation Map Area (Tap to open Turn-by-Turn in Google Maps)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .clip(RoundedCornerShape(28.dp))
                .background(MaterialTheme.colorScheme.surface)
                .border(1.dp, ResQPrimaryRed.copy(alpha = 0.4f), RoundedCornerShape(28.dp))
                .clickable {
                    try {
                        val gmmIntentUri = Uri.parse("google.navigation:q=$victimLat,$victimLng&mode=d")
                        val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
                        mapIntent.setPackage("com.google.android.apps.maps")
                        context.startActivity(mapIntent)
                    } catch (_: Exception) {
                        val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com/maps/dir/?api=1&origin=$volunteerLat,$volunteerLng&destination=$victimLat,$victimLng&travelmode=driving"))
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
                Icon(imageVector = Icons.Default.Navigation, contentDescription = null, tint = ResQPrimaryRed, modifier = Modifier.size(44.dp))

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(14.dp))
                        .background(ResQPrimaryRed)
                        .padding(horizontal = 14.dp, vertical = 6.dp)
                ) {
                    Text(text = "🔴 Victim: $victimName", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(14.dp))
                        .background(ResQSuccessGreen)
                        .padding(horizontal = 14.dp, vertical = 6.dp)
                ) {
                    Text(text = "🟢 You (Volunteer Responder)", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                }

                Text(
                    text = "Tap box to start Turn-by-Turn Navigation in Google Maps",
                    fontSize = 11.sp,
                    color = ResQBrandBlue,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        Spacer(modifier = Modifier.height(20.dp))

        // Red End Navigation Button
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
