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
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CompassCalibration
import androidx.compose.material.icons.filled.Layers
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Map
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.Search
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqnet.data.ResQNetRepository
import com.example.resqnet.data.SosEventItem
import com.example.resqnet.theme.*

@Composable
fun NearbyCasesMapScreen(
    onNavigateToTurnByTurn: () -> Unit = {}
) {
    val context = LocalContext.current
    var searchQuery by remember { mutableStateOf("") }
    var selectedLayer by remember { mutableStateOf("Route") }
    var volunteerLat by remember { mutableDoubleStateOf(13.0827) }
    var volunteerLng by remember { mutableDoubleStateOf(80.2707) }
    var casesList by remember { mutableStateOf<List<SosEventItem>>(emptyList()) }

    // Fetch live user emergency requests & volunteer GPS location
    LaunchedEffect(Unit) {
        casesList = ResQNetRepository.getLiveSosEvents()
        try {
            val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
            val lastLoc: Location? = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
                ?: locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)

            if (lastLoc != null) {
                volunteerLat = lastLoc.latitude
                volunteerLng = lastLoc.longitude
            }
        } catch (_: Exception) {}
    }

    val firstCitizenCase = casesList.firstOrNull()
    val victimLat = firstCitizenCase?.latitude ?: 13.0827
    val victimLng = firstCitizenCase?.longitude ?: 80.2707
    val victimName = firstCitizenCase?.user_id ?: "Kavitha S (Citizen User)"

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 8.dp, bottom = 32.dp)
    ) {
        // Header
        item {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    text = "Nearby Emergency Cases Map",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Black,
                    color = MaterialTheme.colorScheme.onBackground
                )
                Text(
                    text = "Navigate from your Volunteer GPS to Citizen User Location.",
                    fontSize = 12.sp,
                    color = ResQPrimaryRed,
                    fontWeight = FontWeight.Bold
                )
            }
        }

        // Search Bar
        item {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search location...", color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.6f), fontSize = 13.sp) },
                leadingIcon = { Icon(imageVector = Icons.Default.Search, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = ResQPrimaryRed,
                    unfocusedBorderColor = MaterialTheme.colorScheme.outline,
                    focusedContainerColor = MaterialTheme.colorScheme.surface,
                    unfocusedContainerColor = MaterialTheme.colorScheme.surface
                )
            )
        }

        // Interactive Map Box (Volunteer -> Citizen User Navigation)
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(260.dp)
                    .clip(RoundedCornerShape(26.dp))
                    .background(MaterialTheme.colorScheme.surface)
                    .border(1.dp, ResQPrimaryRed.copy(alpha = 0.4f), RoundedCornerShape(26.dp))
                    .padding(16.dp)
            ) {
                Column(
                    modifier = Modifier.fillMaxSize(),
                    verticalArrangement = Arrangement.SpaceBetween
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(ResQPrimaryRed.copy(alpha = 0.2f))
                                .padding(horizontal = 10.dp, vertical = 4.dp)
                        ) {
                            Text(text = "● ${casesList.size} Active Citizen Requests", color = ResQPrimaryRed, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }

                        // Launch Turn-by-Turn Navigation from Volunteer to Citizen User
                        IconButton(
                            onClick = {
                                try {
                                    val gmmIntentUri = Uri.parse("google.navigation:q=$victimLat,$victimLng&mode=d")
                                    val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
                                    mapIntent.setPackage("com.google.android.apps.maps")
                                    context.startActivity(mapIntent)
                                } catch (_: Exception) {
                                    val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com/maps/dir/?api=1&origin=$volunteerLat,$volunteerLng&destination=$victimLat,$victimLng&travelmode=driving"))
                                    context.startActivity(browserIntent)
                                }
                            },
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(ResQPrimaryRed.copy(alpha = 0.2f))
                        ) {
                            Icon(imageVector = Icons.Default.Navigation, contentDescription = "Google Maps Navigation", tint = ResQPrimaryRed, modifier = Modifier.size(18.dp))
                        }
                    }

                    // Map Pins Box showing Volunteer & Citizen User Location
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        MapPinPill("🔴 Citizen User ($victimName): ${firstCitizenCase?.address ?: "Anna Salai, Chennai"}", ResQPrimaryRed)
                        Spacer(modifier = Modifier.height(10.dp))
                        MapPinPill("🟢 You (Volunteer GPS Location)", ResQSuccessGreen)
                    }

                    Text(
                        text = "Tap navigation icon to start Google Maps from Volunteer -> User",
                        fontSize = 10.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        modifier = Modifier.align(Alignment.CenterHorizontally)
                    )
                }
            }
        }

        // MAP LAYERS Title
        item {
            Text(text = "MAP LAYERS", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }

        // Map Layer Grid Tiles
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                LayerTile(modifier = Modifier.weight(1f), title = "Route", icon = Icons.Default.Navigation, isSelected = selectedLayer == "Route", onClick = { selectedLayer = "Route"; onNavigateToTurnByTurn() })
                LayerTile(modifier = Modifier.weight(1f), title = "Traffic", icon = Icons.Default.Layers, isSelected = selectedLayer == "Traffic", onClick = { selectedLayer = "Traffic" })
                LayerTile(modifier = Modifier.weight(1f), title = "Heatmap", icon = Icons.Default.CompassCalibration, isSelected = selectedLayer == "Heatmap", onClick = { selectedLayer = "Heatmap" })
                LayerTile(modifier = Modifier.weight(1f), title = "Resources", icon = Icons.Default.LocationOn, isSelected = selectedLayer == "Resources", onClick = { selectedLayer = "Resources" })
            }
        }

        // Active Emergency Cases List
        item {
            Text(text = "ACTIVE CITIZEN USER REQUESTS (${casesList.size})", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }

        items(casesList) { caseItem ->
            val caseLat = caseItem.latitude
            val caseLng = caseItem.longitude

            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(MaterialTheme.colorScheme.surface)
                    .border(1.dp, ResQPrimaryRed.copy(alpha = 0.3f), RoundedCornerShape(20.dp))
                    .clickable {
                        try {
                            val gmmIntentUri = Uri.parse("google.navigation:q=$caseLat,$caseLng&mode=d")
                            val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
                            mapIntent.setPackage("com.google.android.apps.maps")
                            context.startActivity(mapIntent)
                        } catch (_: Exception) {
                            val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://www.google.com/maps/dir/?api=1&origin=$volunteerLat,$volunteerLng&destination=$caseLat,$caseLng&travelmode=driving"))
                            context.startActivity(browserIntent)
                        }
                    }
                    .padding(16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(ResQPrimaryRed.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(imageVector = Icons.Default.Navigation, contentDescription = null, tint = ResQPrimaryRed)
                    }

                    Column(modifier = Modifier.weight(1f)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(text = "${(caseItem.emergency_type ?: "Medical").uppercase()} • ${caseItem.user_id}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
                            Text(text = caseItem.timestamp, fontSize = 10.sp, color = ResQPrimaryRed, fontWeight = FontWeight.Bold)
                        }
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(
                            text = "📍 User Location: ${caseItem.address ?: "Anna Salai, Chennai"}",
                            fontSize = 11.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant,
                            fontWeight = FontWeight.SemiBold
                        )
                        Spacer(modifier = Modifier.height(2.dp))
                        Text(text = "Tap to navigate Turn-by-Turn from Volunteer -> User", fontSize = 11.sp, color = ResQSuccessGreen, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}

@Composable
private fun MapPinPill(text: String, color: Color) {
    Box(
        modifier = Modifier
            .clip(RoundedCornerShape(14.dp))
            .background(Color.White)
            .padding(horizontal = 12.dp, vertical = 4.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            Box(modifier = Modifier.size(8.dp).clip(CircleShape).background(color))
            Text(text = text, color = Color.Black, fontSize = 11.sp, fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
private fun LayerTile(
    modifier: Modifier = Modifier,
    title: String,
    icon: ImageVector,
    isSelected: Boolean,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(if (isSelected) ResQPrimaryRed.copy(alpha = 0.15f) else MaterialTheme.colorScheme.surface)
            .border(1.dp, if (isSelected) ResQPrimaryRed else MaterialTheme.colorScheme.outline, RoundedCornerShape(16.dp))
            .clickable { onClick() }
            .padding(10.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(imageVector = icon, contentDescription = title, tint = if (isSelected) ResQPrimaryRed else MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(18.dp))
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = title, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
        }
    }
}
