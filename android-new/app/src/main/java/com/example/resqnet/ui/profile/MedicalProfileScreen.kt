package com.example.resqnet.ui.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.ContactPhone
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Logout
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
import com.example.resqnet.data.ResQNetRepository
import com.example.resqnet.data.UserProfile
import com.example.resqnet.theme.*
import kotlinx.coroutines.launch

@Composable
fun MedicalProfileScreen(
    onNavigateToContacts: () -> Unit = {},
    onLogoutClick: () -> Unit = {}
) {
    var profile by remember { mutableStateOf(ResQNetRepository.activeProfileState) }
    var showEditDialog by remember { mutableStateOf(false) }

    var editBloodGroup by remember { mutableStateOf(profile.blood_group ?: "O+") }
    var editConditions by remember { mutableStateOf(profile.conditions ?: "INFECTION") }
    var editAllergies by remember { mutableStateOf(profile.allergies ?: "NONE") }
    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        val fetched = ResQNetRepository.getProfile()
        profile = fetched
        editBloodGroup = fetched.blood_group ?: "O+"
        editConditions = fetched.conditions ?: "INFECTION"
        editAllergies = fetched.allergies ?: "NONE"
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(ResQBackground)
            .padding(horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 20.dp, bottom = 32.dp)
    ) {
        // User Avatar Badge (Pic 5)
        item {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Box(
                    modifier = Modifier.size(80.dp),
                    contentAlignment = Alignment.BottomEnd
                ) {
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .clip(CircleShape)
                            .background(
                                Brush.linearGradient(
                                    colors = listOf(Color(0xFF7C3AED), Color(0xFFEC4899))
                                )
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "SH",
                            color = Color.White,
                            fontSize = 28.sp,
                            fontWeight = FontWeight.Black
                        )
                    }

                    Box(
                        modifier = Modifier
                            .size(24.dp)
                            .clip(CircleShape)
                            .background(ResQCardBackground)
                            .border(1.dp, Color.White.copy(alpha = 0.5f), CircleShape)
                            .clickable { showEditDialog = true },
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Edit,
                            contentDescription = "Edit",
                            tint = Color.White,
                            modifier = Modifier.size(12.dp)
                        )
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                Text(
                    text = profile.full_name ?: "Shaik Hafeeza Tarannum",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color.White,
                    textAlign = TextAlign.Center
                )

                Text(
                    text = profile.phone ?: "8885427587",
                    fontSize = 12.sp,
                    color = ResQTextMuted
                )
            }
        }

        // Medical ID Card (Pic 5)
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp))
                    .background(ResQCardBackground)
                    .border(1.dp, ResQCardBorder, RoundedCornerShape(24.dp))
                    .padding(20.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(imageVector = Icons.Default.Favorite, contentDescription = null, tint = ResQPrimaryRed, modifier = Modifier.size(20.dp))
                            Text(text = "Medical ID", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = ResQPrimaryRed)
                        }

                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(12.dp))
                                .background(ResQCardBorder)
                                .clickable { showEditDialog = true }
                                .padding(horizontal = 12.dp, vertical = 6.dp)
                        ) {
                            Text(text = "Edit", color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        MedicalGridField("BLOOD TYPE", profile.blood_group ?: "O+")
                        MedicalGridField("ORGAN DONOR", "Yes")
                    }

                    MedicalGridField("MEDICAL CONDITIONS", profile.conditions ?: "INFECTION")
                    MedicalGridField("ALLERGIES", profile.allergies ?: "NONE")
                }
            }
        }

        // Clickable Option Rows (Pic 5)
        item {
            Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                ProfileOptionRow(
                    icon = Icons.Default.ContactPhone,
                    title = "Emergency Contacts",
                    subtitle = null,
                    onClick = onNavigateToContacts
                )

                ProfileOptionRow(
                    icon = Icons.Default.LocationOn,
                    title = "Location Settings",
                    subtitle = "Always On",
                    onClick = {}
                )
            }
        }

        // Red Log Out Button (Pic 5)
        item {
            OutlinedButton(
                onClick = onLogoutClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(50.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = ResQPrimaryRed)
            ) {
                Icon(imageVector = Icons.Default.Logout, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text(text = "Log Out", fontWeight = FontWeight.Bold, fontSize = 14.sp)
            }
        }
    }

    // Edit Medical Profile Dialog
    if (showEditDialog) {
        AlertDialog(
            onDismissRequest = { showEditDialog = false },
            title = { Text("Edit Medical Profile", color = Color.White, fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    OutlinedTextField(
                        value = editBloodGroup,
                        onValueChange = { editBloodGroup = it },
                        label = { Text("Blood Group") }
                    )
                    OutlinedTextField(
                        value = editConditions,
                        onValueChange = { editConditions = it },
                        label = { Text("Medical Conditions") }
                    )
                    OutlinedTextField(
                        value = editAllergies,
                        onValueChange = { editAllergies = it },
                        label = { Text("Allergies") }
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        val updated = profile.copy(
                            blood_group = editBloodGroup,
                            conditions = editConditions,
                            allergies = editAllergies
                        )
                        profile = updated
                        coroutineScope.launch {
                            ResQNetRepository.updateProfile(updated)
                        }
                        showEditDialog = false
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = ResQPrimaryRed)
                ) {
                    Text("Save Changes", fontWeight = FontWeight.Bold)
                }
            },
            dismissButton = {
                TextButton(onClick = { showEditDialog = false }) {
                    Text("Cancel", color = ResQTextMuted)
                }
            },
            containerColor = ResQCardBackground
        )
    }
}

@Composable
private fun MedicalGridField(label: String, value: String) {
    Column {
        Text(text = label, fontSize = 10.sp, fontWeight = FontWeight.Bold, color = ResQTextMuted)
        Spacer(modifier = Modifier.height(2.dp))
        Text(text = value, fontSize = 15.sp, fontWeight = FontWeight.Black, color = Color.White)
    }
}

@Composable
private fun ProfileOptionRow(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    title: String,
    subtitle: String?,
    onClick: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(ResQCardBackground)
            .border(1.dp, ResQCardBorder, RoundedCornerShape(20.dp))
            .clickable { onClick() }
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                Icon(imageVector = icon, contentDescription = title, tint = ResQBrandBlue, modifier = Modifier.size(20.dp))
                Text(text = title, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
            }

            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                if (subtitle != null) {
                    Text(text = subtitle, fontSize = 12.sp, color = ResQTextMuted)
                }
                Icon(imageVector = Icons.Default.ChevronRight, contentDescription = null, tint = ResQTextMuted, modifier = Modifier.size(18.dp))
            }
        }
    }
}
