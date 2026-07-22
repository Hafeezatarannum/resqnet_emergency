package com.example.resqnet.ui.volunteer

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.EmojiEvents
import androidx.compose.material.icons.filled.FlashOn
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Star
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

@Composable
fun AchievementsScreen() {
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(ResQBackground)
            .padding(horizontal = 20.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp),
        contentPadding = PaddingValues(top = 20.dp, bottom = 40.dp)
    ) {
        // Header (Matching Pic 5)
        item {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .background(ResQPrimaryRed.copy(alpha = 0.15f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(imageVector = Icons.Default.EmojiEvents, contentDescription = null, tint = ResQPrimaryRed, modifier = Modifier.size(24.dp))
                }
                Column {
                    Text(text = "Volunteer Achievements", fontSize = 22.sp, fontWeight = FontWeight.Black, color = Color.White)
                    Text(text = "Your impact on the community", fontSize = 12.sp, color = ResQTextMuted)
                }
            }
        }

        // Current Rank Banner (Matching Pic 5)
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(26.dp))
                    .background(
                        Brush.linearGradient(
                            colors = listOf(Color(0xFF0284C7), Color(0xFF10B981))
                        )
                    )
                    .padding(22.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Text(text = "CURRENT RANK", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White.copy(alpha = 0.8f))
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Text(text = "Level 1", fontSize = 26.sp, fontWeight = FontWeight.Black, color = Color.White)
                        Icon(imageVector = Icons.Default.Shield, contentDescription = null, tint = Color.White, modifier = Modifier.size(22.dp))
                    }
                    Text(text = "500 points to Level 2", fontSize = 12.sp, color = Color.White.copy(alpha = 0.9f))
                }
            }
        }

        // Stats Cards Row (Matching Pic 5)
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                StatCardTile(modifier = Modifier.weight(1f), icon = "📈", value = "0", label = "Impact Score")
                StatCardTile(modifier = Modifier.weight(1f), icon = "🏆", value = "Top 100%", label = "City Leaderboard")
            }
        }

        // Badges Earned Section Title (Pic 5)
        item {
            Text(text = "Badges Earned", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }

        // Badge List (Matching Pic 5)
        item {
            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                BadgeRow(icon = Icons.Default.Star, iconTint = Color(0xFFF59E0B), title = "First Responder", subtitle = "Completed your first emergency response.")
                BadgeRow(icon = Icons.Default.Shield, iconTint = ResQBrandBlue, title = "Guardian Angel", subtitle = "Saved 10 people in critical condition.")
                BadgeRow(icon = Icons.Default.FlashOn, iconTint = ResQWarningOrange, title = "Lightning Fast", subtitle = "Arrived within 3 minutes of alert broadcast.")
            }
        }
    }
}

@Composable
private fun StatCardTile(
    modifier: Modifier = Modifier,
    icon: String,
    value: String,
    label: String
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(22.dp))
            .background(ResQCardBackground)
            .border(1.dp, ResQCardBorder, RoundedCornerShape(22.dp))
            .padding(18.dp)
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = Modifier.fillMaxWidth()) {
            Text(text = icon, fontSize = 20.sp)
            Spacer(modifier = Modifier.height(6.dp))
            Text(text = value, fontSize = 20.sp, fontWeight = FontWeight.Black, color = Color.White)
            Text(text = label, fontSize = 11.sp, color = ResQTextMuted)
        }
    }
}

@Composable
private fun BadgeRow(
    icon: ImageVector,
    iconTint: Color,
    title: String,
    subtitle: String
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(ResQCardBackground)
            .border(1.dp, ResQCardBorder, RoundedCornerShape(20.dp))
            .padding(16.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(14.dp)) {
            Box(
                modifier = Modifier
                    .size(44.dp)
                    .clip(CircleShape)
                    .background(iconTint.copy(alpha = 0.15f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(imageVector = icon, contentDescription = title, tint = iconTint, modifier = Modifier.size(22.dp))
            }

            Column {
                Text(text = title, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
                Spacer(modifier = Modifier.height(2.dp))
                Text(text = subtitle, fontSize = 12.sp, color = ResQTextMuted)
            }
        }
    }
}
