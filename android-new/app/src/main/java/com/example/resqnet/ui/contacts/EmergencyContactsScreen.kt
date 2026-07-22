package com.example.resqnet.ui.contacts

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Group
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
import com.example.resqnet.theme.*
import kotlinx.coroutines.launch

@Composable
fun EmergencyContactsScreen() {
    var contactList by remember {
        mutableStateOf(
            listOf(
                EmergencyContactItem(id = "1", name = "Muntaz", relation = "Mother", phone = "9989927587"),
                EmergencyContactItem(id = "2", name = "Ghouse", relation = "Father", phone = "9908822425")
            )
        )
    }

    var showAddDialog by remember { mutableStateOf(false) }
    var newName by remember { mutableStateOf("") }
    var newRelation by remember { mutableStateOf("") }
    var newPhone by remember { mutableStateOf("") }
    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        val fetched = ResQNetRepository.getEmergencyContacts()
        if (fetched.isNotEmpty()) {
            contactList = fetched
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(ResQBackground)
            .padding(16.dp)
    ) {
        // Header (Pic 4)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Box(
                    modifier = Modifier
                        .size(42.dp)
                        .clip(CircleShape)
                        .background(ResQPrimaryRed.copy(alpha = 0.2f)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Group,
                        contentDescription = null,
                        tint = ResQPrimaryRed,
                        modifier = Modifier.size(22.dp)
                    )
                }

                Column {
                    Text(
                        text = "Emergency Contacts",
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.White
                    )
                    Text(
                        text = "${contactList.size} Active",
                        fontSize = 12.sp,
                        color = ResQTextMuted
                    )
                }
            }

            // Red + Add Button (Pic 4)
            Button(
                onClick = { showAddDialog = true },
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = ResQPrimaryRed),
                contentPadding = PaddingValues(horizontal = 14.dp, vertical = 8.dp)
            ) {
                Icon(imageVector = Icons.Default.Add, contentDescription = "Add", modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(4.dp))
                Text(text = "Add", fontSize = 13.sp, fontWeight = FontWeight.Bold)
            }
        }

        // Contact Cards Container (Pic 4)
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .clip(RoundedCornerShape(20.dp))
                .background(ResQCardBackground)
                .border(1.dp, ResQCardBorder, RoundedCornerShape(20.dp))
                .padding(16.dp)
        ) {
            Column {
                contactList.forEachIndexed { index, contact ->
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(
                                text = contact.name,
                                fontSize = 15.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                            Text(
                                text = "${contact.relation ?: "Family"} • ${contact.phone}",
                                fontSize = 12.sp,
                                color = ResQTextMuted
                            )
                        }

                        // Call & Delete Icons (Pic 4)
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            IconButton(
                                onClick = {},
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(ResQSuccessGreen.copy(alpha = 0.15f))
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Call,
                                    contentDescription = "Call",
                                    tint = ResQSuccessGreen,
                                    modifier = Modifier.size(18.dp)
                                )
                            }

                            IconButton(
                                onClick = {
                                    val targetId = contact.id
                                    contactList = contactList.filter { it.id != targetId }
                                    coroutineScope.launch {
                                        ResQNetRepository.deleteEmergencyContact(targetId)
                                    }
                                },
                                modifier = Modifier
                                    .size(36.dp)
                                    .clip(CircleShape)
                                    .background(ResQPrimaryRed.copy(alpha = 0.15f))
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Delete,
                                    contentDescription = "Delete",
                                    tint = ResQPrimaryRed,
                                    modifier = Modifier.size(18.dp)
                                )
                            }
                        }
                    }

                    if (index < contactList.size - 1) {
                        HorizontalDivider(color = ResQCardBorder)
                    }
                }
            }
        }
    }

    // Add Contact Dialog
    if (showAddDialog) {
        AlertDialog(
            onDismissRequest = { showAddDialog = false },
            title = { Text("Add Emergency Contact", color = Color.White, fontWeight = FontWeight.Bold) },
            text = {
                Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    OutlinedTextField(
                        value = newName,
                        onValueChange = { newName = it },
                        label = { Text("Name") }
                    )
                    OutlinedTextField(
                        value = newRelation,
                        onValueChange = { newRelation = it },
                        label = { Text("Relation (e.g. Mother, Father)") }
                    )
                    OutlinedTextField(
                        value = newPhone,
                        onValueChange = { newPhone = it },
                        label = { Text("Phone Number") }
                    )
                }
            },
            confirmButton = {
                Button(
                    onClick = {
                        if (newName.isNotBlank() && newPhone.isNotBlank()) {
                            val newItem = EmergencyContactItem(
                                id = "c_${System.currentTimeMillis()}",
                                name = newName,
                                relation = newRelation.ifBlank { "Family" },
                                phone = newPhone
                            )
                            contactList = contactList + newItem
                            coroutineScope.launch {
                                ResQNetRepository.addEmergencyContact(newItem)
                            }
                            newName = ""
                            newRelation = ""
                            newPhone = ""
                            showAddDialog = false
                        }
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = ResQPrimaryRed)
                ) {
                    Text("Add Contact")
                }
            },
            dismissButton = {
                TextButton(onClick = { showAddDialog = false }) {
                    Text("Cancel", color = ResQTextMuted)
                }
            },
            containerColor = ResQCardBackground
        )
    }
}
