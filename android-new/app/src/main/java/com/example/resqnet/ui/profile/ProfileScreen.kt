package com.example.resqnet.ui.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.ContactPhone
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Logout
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqnet.data.EmergencyContactItem
import com.example.resqnet.data.ResQNetRepository
import com.example.resqnet.data.RoleManager
import com.example.resqnet.data.UserProfile
import com.example.resqnet.data.UserRole
import com.example.resqnet.theme.*
import kotlinx.coroutines.launch

@Composable
fun ProfileScreen(
    onLogoutClick: () -> Unit
) {
    var isVolunteer by remember { mutableStateOf(RoleManager.currentRole == UserRole.VOLUNTEER) }
    var profile by remember { mutableStateOf<UserProfile?>(null) }
    var contacts by remember { mutableStateOf<List<EmergencyContactItem>>(emptyList()) }
    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        coroutineScope.launch {
            profile = ResQNetRepository.getProfile()
            contacts = ResQNetRepository.getEmergencyContacts()
        }
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(ResQBackground)
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 24.dp)
    ) {
        // User Card
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(ResQCardBackground)
                    .border(1.dp, ResQCardBorder, RoundedCornerShape(20.dp))
                    .padding(16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Box(
                        modifier = Modifier
                            .size(54.dp)
                            .clip(CircleShape)
                            .background(ResQBrandBlue.copy(alpha = 0.2f)),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(imageVector = Icons.Default.Person, contentDescription = null, tint = ResQBrandBlue, modifier = Modifier.size(28.dp))
                    }
                    Spacer(modifier = Modifier.width(14.dp))
                    Column {
                        Text(
                            text = profile?.full_name ?: "Shaik Hafeeza Tarannum",
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                        Text(
                            text = "${profile?.phone ?: "+91 88854 27587"} • Supabase Verified",
                            fontSize = 12.sp,
                            color = ResQTextMuted
                        )
                    }
                }
            }
        }

        // Role Switch Card
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(ResQCardBackground)
                    .border(1.dp, ResQCardBorder, RoundedCornerShape(20.dp))
                    .padding(16.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        Icon(imageVector = Icons.Default.Shield, contentDescription = null, tint = ResQPrimaryRed)
                        Column {
                            Text(text = "Volunteer Responder Role", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            Text(text = "Receive nearby emergency SOS alerts", fontSize = 11.sp, color = ResQTextMuted)
                        }
                    }

                    Switch(
                        checked = isVolunteer,
                        onCheckedChange = { checked ->
                            isVolunteer = checked
                            RoleManager.toggleRole()
                            coroutineScope.launch {
                                ResQNetRepository.setUserRole(if (checked) "volunteer" else "user")
                            }
                        },
                        colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = ResQPrimaryRed)
                    )
                }
            }
        }

        // Medical ID Card
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(ResQCardBackground)
                    .border(1.dp, ResQCardBorder, RoundedCornerShape(20.dp))
                    .padding(16.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(imageVector = Icons.Default.Favorite, contentDescription = null, tint = ResQPrimaryRed)
                        Text(text = "Medical ID & Health Info", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }

                    HorizontalDivider(color = ResQCardBorder)

                    Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                        MedicalInfoItem("Blood Group", profile?.blood_group ?: "O+")
                        MedicalInfoItem("Organ Donor", "Yes")
                        MedicalInfoItem("Weight", "72 kg")
                    }

                    MedicalInfoItem("Known Allergies", profile?.allergies ?: "NONE")
                    MedicalInfoItem("Chronic Conditions", profile?.conditions ?: "INFECTION")
                }
            }
        }

        // Emergency Contacts
        item {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(ResQCardBackground)
                    .border(1.dp, ResQCardBorder, RoundedCornerShape(20.dp))
                    .padding(16.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        Icon(imageVector = Icons.Default.ContactPhone, contentDescription = null, tint = ResQWarningOrange)
                        Text(text = "Primary Emergency Contacts (${contacts.size})", fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
                    }

                    HorizontalDivider(color = ResQCardBorder)

                    contacts.forEach { contact ->
                        ContactRow(contact.name, contact.phone)
                    }
                }
            }
        }

        // Logout
        item {
            OutlinedButton(
                onClick = onLogoutClick,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(48.dp),
                colors = ButtonDefaults.outlinedButtonColors(contentColor = ResQPrimaryRed)
            ) {
                Icon(imageVector = Icons.Default.Logout, contentDescription = null, modifier = Modifier.size(18.dp))
                Spacer(modifier = Modifier.width(6.dp))
                Text(text = "Log Out of Account", fontWeight = FontWeight.Bold, fontSize = 13.sp)
            }
        }
    }
}

@Composable
private fun MedicalInfoItem(label: String, value: String) {
    Column {
        Text(text = label, fontSize = 11.sp, color = ResQTextMuted)
        Text(text = value, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
    }
}

@Composable
private fun ContactRow(name: String, phone: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(text = name, fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
            Text(text = phone, fontSize = 11.sp, color = ResQTextMuted)
        }
        IconButton(onClick = {}) {
            Icon(imageVector = Icons.Default.Call, contentDescription = "Call", tint = ResQSuccessGreen)
        }
    }
}
