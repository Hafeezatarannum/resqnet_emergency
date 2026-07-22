package com.example.resqnet.ui.ai

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Healing
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.SmartToy
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqnet.theme.*

data class Message(val sender: String, val text: String)

@Composable
fun AiFirstAidScreen() {
    var queryText by remember { mutableStateOf("") }
    val messages = remember {
        mutableStateListOf(
            Message("ai", "Hello! I am your ResQNet AI Emergency First Aid Assistant. Select a quick guide below or ask any emergency care question.")
        )
    }

    val guides = listOf(
        GuideItem("CPR Guide", Icons.Default.Favorite, ResQPrimaryRed),
        GuideItem("Severe Bleeding", Icons.Default.Healing, ResQWarningOrange),
        GuideItem("Burn Treatment", Icons.Default.LocalFireDepartment, ResQBrandBlue)
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(ResQBackground)
            .padding(16.dp)
    ) {
        // AI Title
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.padding(bottom = 12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(ResQBrandBlue.copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(imageVector = Icons.Default.SmartToy, contentDescription = "AI Assistant", tint = ResQBrandBlue, modifier = Modifier.size(22.dp))
            }
            Column {
                Text(text = "ResQNet AI First Aid Assistant", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                Text(text = "Instant, offline emergency response steps", fontSize = 12.sp, color = ResQTextMuted)
            }
        }

        // Quick Guides Chips
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.padding(bottom = 12.dp)
        ) {
            items(guides) { guide ->
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(18.dp))
                        .background(ResQCardBackground)
                        .border(1.dp, ResQCardBorder, RoundedCornerShape(18.dp))
                        .clickable {
                            val response = when (guide.title) {
                                "CPR Guide" -> "CPR STEPS:\n1. Call 911 / SOS.\n2. Place hands on center of chest.\n3. Push hard and fast at 100-120 bpm (to the beat of 'Staying Alive')."
                                "Severe Bleeding" -> "BLEEDING CONTROL:\n1. Apply firm, direct pressure with clean cloth.\n2. Do NOT remove cloth if soaked—add another layer on top."
                                else -> "BURN RELIEF:\n1. Cool burn immediately under cool running water for 10-20 mins.\n2. Cover loosely with sterile cling film or plastic wrap."
                            }
                            messages.add(Message("user", guide.title))
                            messages.add(Message("ai", response))
                        }
                        .padding(horizontal = 12.dp, vertical = 8.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Icon(imageVector = guide.icon, contentDescription = guide.title, tint = guide.tint, modifier = Modifier.size(16.dp))
                        Text(text = guide.title, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
                    }
                }
            }
        }

        // Chat Log
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            contentPadding = PaddingValues(vertical = 8.dp)
        ) {
            items(messages) { msg ->
                val isAi = msg.sender == "ai"
                Box(
                    modifier = Modifier
                        .fillMaxWidth(),
                    contentAlignment = if (isAi) Alignment.CenterStart else Alignment.CenterEnd
                ) {
                    Box(
                        modifier = Modifier
                            .widthIn(max = 280.dp)
                            .clip(RoundedCornerShape(18.dp))
                            .background(if (isAi) ResQCardBackground else ResQBrandBlue)
                            .border(1.dp, if (isAi) ResQCardBorder else Color.Transparent, RoundedCornerShape(18.dp))
                            .padding(14.dp)
                    ) {
                        Text(
                            text = msg.text,
                            fontSize = 13.sp,
                            color = Color.White,
                            lineHeight = 18.sp
                        )
                    }
                }
            }
        }

        // Query Input Field
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = queryText,
                onValueChange = { queryText = it },
                placeholder = { Text("Ask AI First Aid Assistant...", color = ResQTextMuted, fontSize = 13.sp) },
                modifier = Modifier.weight(1f),
                singleLine = true,
                shape = RoundedCornerShape(24.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = ResQBrandBlue,
                    unfocusedBorderColor = ResQCardBorder,
                    focusedContainerColor = ResQCardBackground,
                    unfocusedContainerColor = ResQCardBackground
                )
            )

            IconButton(
                onClick = {
                    if (queryText.isNotBlank()) {
                        messages.add(Message("user", queryText))
                        val userQ = queryText
                        queryText = ""
                        messages.add(Message("ai", "Regarding '$userQ': Keep calm, ensure safety of the surroundings, and check if the victim is conscious and breathing."))
                    }
                },
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(ResQBrandBlue)
            ) {
                Icon(imageVector = Icons.Default.Send, contentDescription = "Send", tint = Color.White, modifier = Modifier.size(20.dp))
            }
        }
    }
}

private data class GuideItem(val title: String, val icon: ImageVector, val tint: Color)
