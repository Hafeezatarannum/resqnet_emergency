package com.example.resqnet.ui.onboarding

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.ShieldMoon
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqnet.data.RoleManager
import com.example.resqnet.data.UserRole
import com.example.resqnet.theme.*

@Composable
fun RoleSelectionScreen(
    onContinue: () -> Unit
) {
    var selectedRole by remember { mutableStateOf(UserRole.VICTIM) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(ResQBackground)
            .padding(20.dp),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(28.dp))
                .background(ResQCardBackground)
                .border(1.dp, ResQCardBorder, RoundedCornerShape(28.dp))
                .padding(24.dp)
        ) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                verticalArrangement = Arrangement.Center
            ) {
                // Header Logo
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Box(
                        modifier = Modifier
                            .size(32.dp)
                            .clip(RoundedCornerShape(10.dp))
                            .background(
                                Brush.linearGradient(
                                    colors = listOf(ResQPrimaryRed, Color(0xFFB71721))
                                )
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(imageVector = Icons.Default.Shield, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                    }
                    Row {
                        Text(text = "Res", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                        Text(text = "Q", color = ResQPrimaryRed, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                        Text(text = "Net", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    }
                }

                Spacer(modifier = Modifier.height(20.dp))

                Text(
                    text = "Choose Your Role",
                    fontSize = 24.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )

                Text(
                    text = "How would you like to use ResQNet?",
                    fontSize = 13.sp,
                    color = ResQTextMuted,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(top = 6.dp, bottom = 24.dp)
                )

                // 2 Role Cards Side-by-Side (or stacked on smaller screens)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    // Need Help Card (Victim)
                    val isNeedHelp = selectedRole == UserRole.VICTIM
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (isNeedHelp) ResQPrimaryRed.copy(alpha = 0.12f) else ResQCardBackground)
                            .border(
                                width = if (isNeedHelp) 1.5.dp else 1.dp,
                                color = if (isNeedHelp) ResQPrimaryRed else ResQCardBorder,
                                shape = RoundedCornerShape(20.dp)
                            )
                            .clickable {
                                selectedRole = UserRole.VICTIM
                                RoleManager.currentRole = UserRole.VICTIM
                            }
                            .padding(16.dp)
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            // Selected Radio Indicator Dot at top right
                            Box(
                                modifier = Modifier
                                    .fillMaxWidth(),
                                contentAlignment = Alignment.TopEnd
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(16.dp)
                                        .clip(CircleShape)
                                        .background(if (isNeedHelp) ResQPrimaryRed else Color.Transparent)
                                        .border(1.5.dp, if (isNeedHelp) ResQPrimaryRed else ResQTextMuted, CircleShape)
                                )
                            }

                            Box(
                                modifier = Modifier
                                    .size(48.dp)
                                    .clip(CircleShape)
                                    .background(ResQPrimaryRed.copy(alpha = 0.2f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Shield,
                                    contentDescription = "Need Help",
                                    tint = ResQPrimaryRed,
                                    modifier = Modifier.size(24.dp)
                                )
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            Text(
                                text = "Need Help",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )

                            Spacer(modifier = Modifier.height(6.dp))

                            Text(
                                text = "I want to be protected and access emergency services.",
                                fontSize = 11.sp,
                                color = ResQTextMuted,
                                textAlign = TextAlign.Center,
                                lineHeight = 15.sp
                            )
                        }
                    }

                    // Volunteer Card
                    val isVolunteer = selectedRole == UserRole.VOLUNTEER
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .clip(RoundedCornerShape(20.dp))
                            .background(if (isVolunteer) ResQBrandBlue.copy(alpha = 0.12f) else ResQCardBackground)
                            .border(
                                width = if (isVolunteer) 1.5.dp else 1.dp,
                                color = if (isVolunteer) ResQBrandBlue else ResQCardBorder,
                                shape = RoundedCornerShape(20.dp)
                            )
                            .clickable {
                                selectedRole = UserRole.VOLUNTEER
                                RoleManager.currentRole = UserRole.VOLUNTEER
                            }
                            .padding(16.dp)
                    ) {
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Box(
                                modifier = Modifier.fillMaxWidth(),
                                contentAlignment = Alignment.TopEnd
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(16.dp)
                                        .clip(CircleShape)
                                        .background(if (isVolunteer) ResQBrandBlue else Color.Transparent)
                                        .border(1.5.dp, if (isVolunteer) ResQBrandBlue else ResQTextMuted, CircleShape)
                                )
                            }

                            Box(
                                modifier = Modifier
                                    .size(48.dp)
                                    .clip(CircleShape)
                                    .background(ResQBrandBlue.copy(alpha = 0.2f)),
                                contentAlignment = Alignment.Center
                            ) {
                                Icon(
                                    imageVector = Icons.Default.FavoriteBorder,
                                    contentDescription = "Volunteer",
                                    tint = ResQBrandBlue,
                                    modifier = Modifier.size(24.dp)
                                )
                            }

                            Spacer(modifier = Modifier.height(12.dp))

                            Text(
                                text = "Volunteer",
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )

                            Spacer(modifier = Modifier.height(6.dp))

                            Text(
                                text = "I want to respond to emergencies and help others.",
                                fontSize = 11.sp,
                                color = ResQTextMuted,
                                textAlign = TextAlign.Center,
                                lineHeight = 15.sp
                            )
                        }
                    }
                }

                Spacer(modifier = Modifier.height(28.dp))

                // Continue Red Button
                Button(
                    onClick = onContinue,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(50.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = ResQPrimaryRed)
                ) {
                    Text(
                        text = "Continue",
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                }
            }
        }
    }
}
