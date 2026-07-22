package com.example.resqnet.ui.volunteer

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Navigation
import androidx.compose.material.icons.filled.Warning
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqnet.data.ResQNetRepository
import com.example.resqnet.data.SosEventItem
import com.example.resqnet.theme.*
import kotlinx.coroutines.launch

@Composable
fun VolunteerDashboardScreen(
    onNavigateToTracking: (String) -> Unit = {}
) {
    var isAvailable by remember { mutableStateOf(true) }
    var sosAlerts by remember { mutableStateOf<List<SosEventItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(isAvailable) {
        if (isAvailable) {
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
            .background(ResQBackground)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 32.dp)
    ) {
        // Header (Matching Pic 2)
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = "Dashboard",
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.White
                    )
                    Text(
                        text = "First Responder Mode",
                        fontSize = 12.sp,
                        color = ResQTextMuted
                    )
                }

                // Available Badge (Pic 2)
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(ResQSuccessGreen.copy(alpha = 0.15f))
                        .border(1.dp, ResQSuccessGreen.copy(alpha = 0.4f), RoundedCornerShape(20.dp))
                        .clickable { isAvailable = !isAvailable }
                        .padding(horizontal = 12.dp, vertical = 6.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Box(
                            modifier = Modifier
                                .size(8.dp)
                                .clip(CircleShape)
                                .background(if (isAvailable) ResQSuccessGreen else ResQTextMuted)
                        )
                        Text(
                            text = if (isAvailable) "Available" else "Offline",
                            color = if (isAvailable) ResQSuccessGreen else ResQTextMuted,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Stats Row (Matching Pic 2)
        item {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    StatCard(modifier = Modifier.weight(1f), title = "Cases Assigned", value = "12", icon = "❤️")
                    StatCard(modifier = Modifier.weight(1f), title = "People Helped", value = "45", icon = "👥")
                }

                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(20.dp))
                        .background(ResQCardBackground)
                        .border(1.dp, ResQCardBorder, RoundedCornerShape(20.dp))
                        .padding(14.dp)
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Text(text = "⏱️", fontSize = 16.sp)
                            Text(text = "Avg. Response Time", fontSize = 13.sp, color = ResQTextMuted)
                        }
                        Text(text = "4.2 mins", fontSize = 16.sp, fontWeight = FontWeight.Black, color = Color.White)
                    }
                }
            }
        }

        // Section Title (Pic 2)
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Nearby Emergencies",
                    fontSize = 15.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White
                )

                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(12.dp))
                        .background(ResQPrimaryRed.copy(alpha = 0.15f))
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Text(
                        text = "21 Active",
                        color = ResQPrimaryRed,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
        }

        // Alert Cards (Pic 2)
        if (isLoading) {
            item {
                Box(modifier = Modifier.fillMaxWidth().padding(32.dp), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = ResQPrimaryRed)
                }
            }
        } else if (isAvailable && sosAlerts.isNotEmpty()) {
            items(sosAlerts) { alert ->
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(22.dp))
                        .background(ResQCardBackground)
                        .border(1.dp, ResQPrimaryRed.copy(alpha = 0.4f), RoundedCornerShape(22.dp))
                        .padding(18.dp)
                ) {
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(
                                imageVector = Icons.Default.Warning,
                                contentDescription = null,
                                tint = ResQPrimaryRed,
                                modifier = Modifier.size(20.dp)
                            )
                            Text(
                                text = (alert.emergency_type ?: "medical").lowercase(),
                                fontSize = 16.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }

                        Text(
                            text = "Immediate assistance requested.",
                            fontSize = 12.sp,
                            color = ResQTextMuted
                        )

                        Spacer(modifier = Modifier.height(4.dp))

                        // Accept & Decline Buttons (Pic 2)
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(10.dp)
                        ) {
                            Button(
                                onClick = {
                                    coroutineScope.launch {
                                        ResQNetRepository.acceptSosRequest(alert.id)
                                        onNavigateToTracking(alert.id)
                                    }
                                },
                                modifier = Modifier
                                    .weight(1f)
                                    .height(46.dp),
                                shape = RoundedCornerShape(16.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = ResQPrimaryRed)
                            ) {
                                Text(text = "Accept", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                            }

                            Button(
                                onClick = {
                                    sosAlerts = sosAlerts.filter { it.id != alert.id }
                                },
                                modifier = Modifier
                                    .weight(1f)
                                    .height(46.dp),
                                shape = RoundedCornerShape(16.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E3A5F))
                            ) {
                                Text(text = "Decline", fontWeight = FontWeight.SemiBold, fontSize = 14.sp, color = Color.White)
                            }
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
                    Text(text = if (isAvailable) "No active emergency requests." else "You are currently offline.", color = ResQTextMuted, fontSize = 13.sp)
                }
            }
        }
    }
}

@Composable
private fun StatCard(
    modifier: Modifier = Modifier,
    title: String,
    value: String,
    icon: String
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(20.dp))
            .background(ResQCardBackground)
            .border(1.dp, ResQCardBorder, RoundedCornerShape(20.dp))
            .padding(16.dp)
    ) {
        Column {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Text(text = icon, fontSize = 14.sp)
                Text(text = title, fontSize = 11.sp, color = ResQTextMuted)
            }
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = value, fontSize = 24.sp, fontWeight = FontWeight.Black, color = Color.White)
        }
    }
}
