package com.example.resqnet.ui.settings

import android.widget.Toast
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
import androidx.compose.material.icons.filled.BatteryChargingFull
import androidx.compose.material.icons.filled.Check
import androidx.compose.material.icons.filled.Contrast
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.LocationOn
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material.icons.filled.Smartphone
import androidx.compose.material.icons.filled.Work
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
import com.example.resqnet.data.RoleManager
import com.example.resqnet.data.UserProfile
import com.example.resqnet.data.UserRole
import com.example.resqnet.theme.*
import kotlinx.coroutines.launch

@Composable
fun SettingsScreen() {
    val context = LocalContext.current
    var activeTab by remember { mutableStateOf("Account") }

    var fullName by remember { mutableStateOf(ResQNetRepository.activeProfileState.full_name ?: "Shaik Hafeeza Tarannum") }
    var phone by remember { mutableStateOf(ResQNetRepository.activeProfileState.phone ?: "8885427587") }
    var isVolunteer by remember { mutableStateOf(RoleManager.currentRole == UserRole.VOLUNTEER) }
    var isSaving by remember { mutableStateOf(false) }
    var saveMessage by remember { mutableStateOf<String?>(null) }
    val coroutineScope = rememberCoroutineScope()

    // Settings Toggles
    var locationServices by remember { mutableStateOf(true) }
    var medicalSharing by remember { mutableStateOf(true) }
    var voiceActivation by remember { mutableStateOf(true) }
    var batteryOptimization by remember { mutableStateOf(false) }

    val tabs = listOf("Account", "Appearance", "Privacy", "Emergency", "Device")

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .padding(16.dp)
    ) {
        Text(
            text = "Settings",
            fontSize = 24.sp,
            fontWeight = FontWeight.Bold,
            color = MaterialTheme.colorScheme.onBackground,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        // Scrollable Tabs Header
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(tabs) { tab ->
                val isSelected = activeTab == tab
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(16.dp))
                        .background(if (isSelected) ResQPrimaryRed else MaterialTheme.colorScheme.surface)
                        .border(1.dp, if (isSelected) ResQPrimaryRed else MaterialTheme.colorScheme.outline, RoundedCornerShape(16.dp))
                        .clickable { activeTab = tab }
                        .padding(horizontal = 16.dp, vertical = 10.dp)
                ) {
                    Text(
                        text = tab,
                        color = Color.White,
                        fontSize = 13.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Medium
                    )
                }
            }
        }

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(16.dp),
            contentPadding = PaddingValues(bottom = 32.dp)
        ) {
            when (activeTab) {
                "Account" -> {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(20.dp))
                                .background(MaterialTheme.colorScheme.surface)
                                .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(20.dp))
                                .padding(16.dp)
                        ) {
                            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                                Text(text = "Account Information", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
                                Text(text = "Edit your name and phone number synced to Supabase.", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)

                                if (saveMessage != null) {
                                    Text(text = saveMessage!!, color = ResQSuccessGreen, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                }

                                OutlinedTextField(
                                    value = fullName,
                                    onValueChange = {
                                        fullName = it
                                        saveMessage = null
                                    },
                                    label = { Text("Full Name") },
                                    modifier = Modifier.fillMaxWidth(),
                                    colors = OutlinedTextFieldDefaults.colors(
                                        focusedBorderColor = ResQPrimaryRed,
                                        unfocusedBorderColor = MaterialTheme.colorScheme.outline
                                    )
                                )

                                OutlinedTextField(
                                    value = phone,
                                    onValueChange = {
                                        phone = it
                                        saveMessage = null
                                    },
                                    label = { Text("Phone Number") },
                                    modifier = Modifier.fillMaxWidth(),
                                    colors = OutlinedTextFieldDefaults.colors(
                                        focusedBorderColor = ResQPrimaryRed,
                                        unfocusedBorderColor = MaterialTheme.colorScheme.outline
                                    )
                                )

                                Button(
                                    onClick = {
                                        isSaving = true
                                        val updated = ResQNetRepository.activeProfileState.copy(full_name = fullName, phone = phone)
                                        coroutineScope.launch {
                                            ResQNetRepository.updateProfile(updated)
                                            isSaving = false
                                            saveMessage = "User name updated successfully!"
                                            Toast.makeText(context, "Account information saved!", Toast.LENGTH_SHORT).show()
                                        }
                                    },
                                    modifier = Modifier.fillMaxWidth(),
                                    enabled = !isSaving,
                                    colors = ButtonDefaults.buttonColors(containerColor = ResQPrimaryRed)
                                ) {
                                    if (isSaving) {
                                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(18.dp))
                                    } else {
                                        Text(text = "Save Changes", fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                        }
                    }

                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(20.dp))
                                .background(MaterialTheme.colorScheme.surface)
                                .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(20.dp))
                                .padding(16.dp)
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                                    Icon(imageVector = Icons.Default.Work, contentDescription = null, tint = ResQBrandBlue)
                                    Column {
                                        Text(text = "Volunteer Mode", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
                                        Text(text = "Switch account to First Responder role", fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
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
                                        Toast.makeText(context, "Mode switched to ${if (checked) "Volunteer" else "Citizen"}", Toast.LENGTH_SHORT).show()
                                    },
                                    colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = ResQBrandBlue)
                                )
                            }
                        }
                    }
                }

                "Appearance" -> {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(20.dp))
                                .background(MaterialTheme.colorScheme.surface)
                                .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(20.dp))
                                .padding(16.dp)
                        ) {
                            Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                                Text(text = "Theme & Display", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)

                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    ThemeOptionTile(
                                        modifier = Modifier.weight(1f),
                                        title = "Light",
                                        icon = Icons.Default.LightMode,
                                        isSelected = ResQNetRepository.selectedThemeState == "Light"
                                    ) {
                                        ResQNetRepository.selectedThemeState = "Light"
                                        Toast.makeText(context, "Light Theme Applied!", Toast.LENGTH_SHORT).show()
                                    }

                                    ThemeOptionTile(
                                        modifier = Modifier.weight(1f),
                                        title = "Dark",
                                        icon = Icons.Default.DarkMode,
                                        isSelected = ResQNetRepository.selectedThemeState == "Dark"
                                    ) {
                                        ResQNetRepository.selectedThemeState = "Dark"
                                        Toast.makeText(context, "Dark Theme Applied!", Toast.LENGTH_SHORT).show()
                                    }

                                    ThemeOptionTile(
                                        modifier = Modifier.weight(1f),
                                        title = "System",
                                        icon = Icons.Default.Contrast,
                                        isSelected = ResQNetRepository.selectedThemeState == "System"
                                    ) {
                                        ResQNetRepository.selectedThemeState = "System"
                                        Toast.makeText(context, "System Default Theme Applied!", Toast.LENGTH_SHORT).show()
                                    }
                                }
                            }
                        }
                    }
                }

                "Privacy" -> {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(20.dp))
                                .background(MaterialTheme.colorScheme.surface)
                                .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(20.dp))
                                .padding(16.dp)
                        ) {
                            Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                                ToggleSettingRow("Location Services", "Allow background GPS tracking for fast SOS response.", locationServices) {
                                    locationServices = it
                                    Toast.makeText(context, "Location Services ${if (it) "Enabled" else "Disabled"}", Toast.LENGTH_SHORT).show()
                                }
                                HorizontalDivider(color = MaterialTheme.colorScheme.outline)
                                ToggleSettingRow("Medical Data Sharing", "Share medical profile with verified responders.", medicalSharing) {
                                    medicalSharing = it
                                    Toast.makeText(context, "Medical Sharing ${if (it) "Enabled" else "Disabled"}", Toast.LENGTH_SHORT).show()
                                }
                            }
                        }
                    }
                }

                "Emergency" -> {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(20.dp))
                                .background(MaterialTheme.colorScheme.surface)
                                .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(20.dp))
                                .padding(16.dp)
                        ) {
                            Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                                ToggleSettingRow("Voice Activation", "Always listen for \"Help Me\" keyword.", voiceActivation) {
                                    voiceActivation = it
                                    Toast.makeText(context, "Voice Activation ${if (it) "Enabled" else "Disabled"}", Toast.LENGTH_SHORT).show()
                                }
                            }
                        }
                    }
                }

                "Device" -> {
                    item {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(20.dp))
                                .background(MaterialTheme.colorScheme.surface)
                                .border(1.dp, MaterialTheme.colorScheme.outline, RoundedCornerShape(20.dp))
                                .padding(16.dp)
                        ) {
                            Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
                                ToggleSettingRow("Battery Optimization", "Reduce background scanning to save battery.", batteryOptimization) {
                                    batteryOptimization = it
                                    Toast.makeText(context, "Battery Optimization ${if (it) "Enabled" else "Disabled"}", Toast.LENGTH_SHORT).show()
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun ThemeOptionTile(
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
            .padding(14.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(imageVector = icon, contentDescription = title, tint = if (isSelected) ResQPrimaryRed else MaterialTheme.colorScheme.onSurfaceVariant, modifier = Modifier.size(22.dp))
            Spacer(modifier = Modifier.height(6.dp))
            Text(text = title, fontSize = 12.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
        }
    }
}

@Composable
private fun ToggleSettingRow(
    title: String,
    subtitle: String,
    checked: Boolean,
    onCheckedChange: (Boolean) -> Unit
) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column(modifier = Modifier.weight(1f)) {
            Text(text = title, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.onSurface)
            Text(text = subtitle, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Switch(
            checked = checked,
            onCheckedChange = onCheckedChange,
            colors = SwitchDefaults.colors(checkedThumbColor = Color.White, checkedTrackColor = ResQPrimaryRed)
        )
    }
}
