package com.example.resqnet.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ContactPhone
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Group
import androidx.compose.material.icons.filled.HelpOutline
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material.icons.filled.Message
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.SmartToy
import androidx.compose.material.icons.filled.Work
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqnet.theme.*

data class DrawerMenuItem(val route: String, val title: String, val icon: ImageVector)

@Composable
fun ResQNetDrawerContent(
    currentRoute: String,
    onNavigate: (String) -> Unit,
    onLogout: () -> Unit
) {
    val mainMenuItems = listOf(
        DrawerMenuItem("home", "Home", Icons.Default.Home),
        DrawerMenuItem("volunteer_dashboard", "Volunteer Dashboard", Icons.Default.Work),
        DrawerMenuItem("emergency_sos", "Emergency SOS", Icons.Default.Shield),
        DrawerMenuItem("alerts", "Find Volunteers", Icons.Default.Group),
        DrawerMenuItem("hospitals", "Hospitals", Icons.Default.LocalHospital),
        DrawerMenuItem("emergency_contacts", "Emergency Contacts", Icons.Default.ContactPhone),
        DrawerMenuItem("medical_profile", "Medical Profile", Icons.Default.Favorite),
        DrawerMenuItem("ai_aid", "AI First Aid", Icons.Default.SmartToy),
        DrawerMenuItem("settings", "Settings", Icons.Default.Settings)
    )

    Column(
        modifier = Modifier
            .fillMaxHeight()
            .width(280.dp)
            .background(ResQBackground)
            .statusBarsPadding()
            .navigationBarsPadding()
            .padding(horizontal = 16.dp, vertical = 20.dp),
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        Column {
            // Header Logo
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(10.dp),
                modifier = Modifier.padding(start = 12.dp, bottom = 28.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(36.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(
                            Brush.linearGradient(
                                colors = listOf(ResQPrimaryRed, Color(0xFFB71721))
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Shield,
                        contentDescription = "Logo",
                        tint = Color.White,
                        modifier = Modifier.size(20.dp)
                    )
                }
                Row {
                    Text(text = "Res", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                    Text(text = "Q", color = ResQPrimaryRed, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                    Text(text = "Net", color = Color.White, fontSize = 22.sp, fontWeight = FontWeight.Bold)
                }
            }

            // Main Menu List
            Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                mainMenuItems.forEach { item ->
                    val isSelected = currentRoute == item.route
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (isSelected) ResQPrimaryRed.copy(alpha = 0.18f) else Color.Transparent)
                            .clickable { onNavigate(item.route) }
                            .padding(horizontal = 16.dp, vertical = 12.dp)
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(
                                imageVector = item.icon,
                                contentDescription = item.title,
                                tint = if (isSelected) ResQPrimaryRed else ResQTextMuted,
                                modifier = Modifier.size(20.dp)
                            )
                            Spacer(modifier = Modifier.width(14.dp))
                            Text(
                                text = item.title,
                                fontSize = 14.sp,
                                fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium,
                                color = if (isSelected) ResQPrimaryRed else Color.White
                            )
                        }
                    }
                }
            }
        }

        // Bottom Items (Help Center, Feedback, Logout)
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            HorizontalDivider(color = ResQCardBorder, modifier = Modifier.padding(bottom = 12.dp))

            DrawerFooterRow(
                icon = Icons.Default.HelpOutline,
                title = "Help Center",
                onClick = { onNavigate("help_center") }
            )

            DrawerFooterRow(
                icon = Icons.Default.Message,
                title = "Feedback",
                onClick = { onNavigate("feedback") }
            )

            DrawerFooterRow(
                icon = Icons.Default.Logout,
                title = "Logout",
                onClick = onLogout
            )
        }
    }
}

@Composable
private fun DrawerFooterRow(
    icon: ImageVector,
    title: String,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .clickable { onClick() }
            .padding(horizontal = 16.dp, vertical = 10.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = ResQTextMuted,
                modifier = Modifier.size(20.dp)
            )
            Spacer(modifier = Modifier.width(14.dp))
            Text(
                text = title,
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium,
                color = Color.White
            )
        }
    }
}
