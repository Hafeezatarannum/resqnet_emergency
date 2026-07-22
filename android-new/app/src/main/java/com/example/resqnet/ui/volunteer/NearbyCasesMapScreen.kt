package com.example.resqnet.ui.volunteer

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.example.resqnet.theme.*

@Composable
fun NearbyCasesMapScreen(
    onNavigateToTurnByTurn: () -> Unit = {}
) {
    val context = LocalContext.current
    var searchQuery by remember { mutableStateOf("") }
    var selectedLayer by remember { mutableStateOf("Route") }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(ResQBackground)
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 8.dp, bottom = 32.dp)
    ) {
        // Header (Matching Pic 2)
        item {
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(
                    text = "Chennai Fleet Live Map",
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White
                )
                Text(
                    text = "Monitor real-time incidents and responder locations.",
                    fontSize = 12.sp,
                    color = ResQTextMuted
                )
            }
        }

        // Search Bar (Pic 2)
        item {
            OutlinedTextField(
                value = searchQuery,
                onValueChange = { searchQuery = it },
                placeholder = { Text("Search Chennai location...", color = ResQTextMuted.copy(alpha = 0.6f), fontSize = 13.sp) },
                leadingIcon = { Icon(imageVector = Icons.Default.Search, contentDescription = null, tint = ResQTextMuted) },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = ResQPrimaryRed,
                    unfocusedBorderColor = ResQCardBorder,
                    focusedContainerColor = ResQCardBackground,
                    unfocusedContainerColor = ResQCardBackground
                )
            )
        }

        // Interactive Map Box with Google Maps Trigger (Pic 2)
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .height(260.dp)
                    .clip(RoundedCornerShape(26.dp))
                    .background(Color(0xFF0D1B2A))
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
                            Text(text = "● 3 Active Emergencies Nearby", color = ResQPrimaryRed, fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }

                        IconButton(
                            onClick = {
                                try {
                                    val gmmIntentUri = Uri.parse("geo:13.0827,80.2707?q=13.0827,80.2707(Chennai+Emergency+Fleet)")
                                    val mapIntent = Intent(Intent.ACTION_VIEW, gmmIntentUri)
                                    mapIntent.setPackage("com.google.android.apps.maps")
                                    context.startActivity(mapIntent)
                                } catch (_: Exception) {
                                    val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse("https://maps.google.com/?q=13.0827,80.2707"))
                                    context.startActivity(browserIntent)
                                }
                            },
                            modifier = Modifier
                                .size(36.dp)
                                .clip(CircleShape)
                                .background(ResQCardBackground)
                        ) {
                            Icon(imageVector = Icons.Default.LocationOn, contentDescription = "Google Maps", tint = ResQPrimaryRed, modifier = Modifier.size(18.dp))
                        }
                    }

                    // Map Pins Simulation Box
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        MapPinPill("Help Needed", ResQPrimaryRed)
                        Spacer(modifier = Modifier.height(10.dp))
                        MapPinPill("ResQ Fleet 1", ResQSuccessGreen)
                        Spacer(modifier = Modifier.height(10.dp))
                        MapPinPill("You (Chennai)", ResQBrandBlue)
                    }

                    Text(
                        text = "Tap pin to open in Google Maps",
                        fontSize = 10.sp,
                        color = ResQTextMuted,
                        modifier = Modifier.align(Alignment.CenterHorizontally)
                    )
                }
            }
        }

        // MAP LAYERS Title (Pic 2)
        item {
            Text(text = "MAP LAYERS", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = ResQTextMuted)
        }

        // Map Layer Grid Tiles (Pic 2)
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

        // LIVE ROUTE Title (Pic 2)
        item {
            Text(text = "LIVE ROUTE", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = ResQTextMuted)
        }

        // Faster Route Card (Pic 2)
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(ResQSuccessGreen.copy(alpha = 0.1f))
                    .border(1.dp, ResQSuccessGreen.copy(alpha = 0.3f), RoundedCornerShape(20.dp))
                    .clickable { onNavigateToTurnByTurn() }
                    .padding(16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(ResQSuccessGreen.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(imageVector = Icons.Default.Navigation, contentDescription = null, tint = ResQSuccessGreen)
                    }

                    Column {
                        Text(text = "Faster route available", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        Text(text = "Save 4 min via Ring Road. Traffic is clear.", fontSize = 11.sp, color = ResQSuccessGreen)
                    }
                }
            }
        }

        // High Risk Zone Card (Pic 2)
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(ResQWarningOrange.copy(alpha = 0.1f))
                    .border(1.dp, ResQWarningOrange.copy(alpha = 0.3f), RoundedCornerShape(20.dp))
                    .padding(16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                    Box(
                        modifier = Modifier
                            .size(44.dp)
                            .clip(RoundedCornerShape(12.dp))
                            .background(ResQWarningOrange.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(imageVector = Icons.Default.Warning, contentDescription = null, tint = ResQWarningOrange)
                    }

                    Column {
                        Text(text = "High Risk Zone", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = ResQWarningOrange)
                        Text(text = "Multiple accidents reported ahead. Drive carefully.", fontSize = 11.sp, color = ResQTextMuted)
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
            .background(if (isSelected) ResQPrimaryRed.copy(alpha = 0.15f) else ResQCardBackground)
            .border(1.dp, if (isSelected) ResQPrimaryRed else ResQCardBorder, RoundedCornerShape(16.dp))
            .clickable { onClick() }
            .padding(10.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(imageVector = icon, contentDescription = title, tint = if (isSelected) ResQPrimaryRed else ResQTextMuted, modifier = Modifier.size(18.dp))
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = title, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }
    }
}
