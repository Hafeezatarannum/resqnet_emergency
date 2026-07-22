package com.example.resqnet.ui.support

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.BugReport
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Message
import androidx.compose.material.icons.filled.ThumbUp
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqnet.data.ResQNetRepository
import com.example.resqnet.theme.*
import kotlinx.coroutines.launch

@Composable
fun FeedbackScreen() {
    var selectedType by remember { mutableStateOf<String?>(null) }
    var message by remember { mutableStateOf("") }
    var isLoading by remember { mutableStateOf(false) }
    var successMsg by remember { mutableStateOf<String?>(null) }
    var errorMsg by remember { mutableStateOf<String?>(null) }
    val coroutineScope = rememberCoroutineScope()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(ResQBackground)
            .padding(horizontal = 20.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(20.dp),
        contentPadding = PaddingValues(top = 24.dp, bottom = 40.dp)
    ) {
        // Top Icon & Header (Matching Image 2)
        item {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth()
            ) {
                Box(
                    modifier = Modifier
                        .size(72.dp)
                        .clip(CircleShape)
                        .background(ResQBrandBlue.copy(alpha = 0.12f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Message,
                        contentDescription = "Feedback",
                        tint = ResQBrandBlue,
                        modifier = Modifier.size(36.dp)
                    )
                }

                Spacer(modifier = Modifier.height(16.dp))

                Text(
                    text = "Send Feedback",
                    fontSize = 26.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )

                Spacer(modifier = Modifier.height(8.dp))

                Text(
                    text = "Your feedback helps us improve ResQNet. Let us know what you think or report an issue.",
                    fontSize = 13.sp,
                    color = ResQTextMuted,
                    textAlign = TextAlign.Center,
                    lineHeight = 18.sp,
                    modifier = Modifier.padding(horizontal = 12.dp)
                )
            }
        }

        // Success / Error Alerts
        if (successMsg != null) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(ResQSuccessGreen.copy(alpha = 0.15f))
                        .border(1.dp, ResQSuccessGreen.copy(alpha = 0.4f), RoundedCornerShape(16.dp))
                        .padding(14.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Icon(imageVector = Icons.Default.CheckCircle, contentDescription = null, tint = ResQSuccessGreen)
                        Text(text = successMsg!!, color = ResQSuccessGreen, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        if (errorMsg != null) {
            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .clip(RoundedCornerShape(16.dp))
                        .background(ResQPrimaryRed.copy(alpha = 0.15f))
                        .border(1.dp, ResQPrimaryRed.copy(alpha = 0.4f), RoundedCornerShape(16.dp))
                        .padding(14.dp)
                ) {
                    Text(text = errorMsg!!, color = ResQPrimaryRed, fontSize = 13.sp, fontWeight = FontWeight.Bold)
                }
            }
        }

        // Form Card (Matching Image 2)
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(28.dp))
                    .background(ResQCardBackground)
                    .border(1.dp, ResQCardBorder, RoundedCornerShape(28.dp))
                    .padding(20.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Text(
                        text = "What kind of feedback do you have?",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )

                    // Type Options Grid (Matching Image 2)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        TypeTile(
                            modifier = Modifier.weight(1f),
                            title = "Idea / Suggestion",
                            icon = Icons.Default.ThumbUp,
                            isSelected = selectedType == "idea",
                            color = ResQBrandBlue,
                            onClick = { selectedType = "idea"; errorMsg = null }
                        )

                        TypeTile(
                            modifier = Modifier.weight(1f),
                            title = "Report an Issue",
                            icon = Icons.Default.BugReport,
                            isSelected = selectedType == "issue",
                            color = ResQPrimaryRed,
                            onClick = { selectedType = "issue"; errorMsg = null }
                        )

                        TypeTile(
                            modifier = Modifier.weight(1f),
                            title = "Other",
                            icon = Icons.Default.Message,
                            isSelected = selectedType == "other",
                            color = ResQSuccessGreen,
                            onClick = { selectedType = "other"; errorMsg = null }
                        )
                    }

                    Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                        Text(text = "Message", fontSize = 13.sp, fontWeight = FontWeight.Medium, color = ResQTextMuted)

                        OutlinedTextField(
                            value = message,
                            onValueChange = {
                                if (it.length <= 1000) message = it
                                errorMsg = null
                            },
                            placeholder = { Text("Tell us what's on your mind...", color = ResQTextMuted.copy(alpha = 0.6f), fontSize = 13.sp) },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(130.dp),
                            shape = RoundedCornerShape(16.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = ResQPrimaryRed,
                                unfocusedBorderColor = ResQCardBorder,
                                focusedContainerColor = ResQCardBackground,
                                unfocusedContainerColor = ResQCardBackground
                            )
                        )

                        Text(
                            text = "${message.length}/1000",
                            fontSize = 11.sp,
                            color = ResQTextMuted,
                            textAlign = TextAlign.End,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }

                    Button(
                        onClick = {
                            if (selectedType == null) {
                                errorMsg = "Please select a feedback type."
                                return@Button
                            }
                            if (message.isBlank()) {
                                errorMsg = "Please write a message before submitting."
                                return@Button
                            }

                            isLoading = true
                            coroutineScope.launch {
                                ResQNetRepository.submitFeedback(selectedType!!, message.trim())
                                isLoading = false
                                successMsg = "Thank you! Your feedback has been saved successfully."
                                message = ""
                                selectedType = null
                            }
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp),
                        enabled = !isLoading,
                        shape = RoundedCornerShape(16.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = ResQPrimaryRed)
                    ) {
                        if (isLoading) {
                            CircularProgressIndicator(color = Color.White, modifier = Modifier.size(20.dp))
                        } else {
                            Text(text = "Submit Feedback", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun TypeTile(
    modifier: Modifier = Modifier,
    title: String,
    icon: ImageVector,
    isSelected: Boolean,
    color: Color,
    onClick: () -> Unit
) {
    Box(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(if (isSelected) color.copy(alpha = 0.15f) else ResQCardBackground)
            .border(1.dp, if (isSelected) color else ResQCardBorder, RoundedCornerShape(16.dp))
            .clickable { onClick() }
            .padding(vertical = 14.dp, horizontal = 8.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(imageVector = icon, contentDescription = title, tint = if (isSelected) color else ResQTextMuted, modifier = Modifier.size(20.dp))
            Spacer(modifier = Modifier.height(6.dp))
            Text(text = title, fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.White, textAlign = TextAlign.Center)
        }
    }
}
