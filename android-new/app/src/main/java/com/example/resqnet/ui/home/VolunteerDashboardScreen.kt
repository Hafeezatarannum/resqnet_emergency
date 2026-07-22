package com.example.resqnet.ui.home

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.example.resqnet.data.SupabaseClient
import io.github.jan.supabase.postgrest.postgrest
import kotlinx.coroutines.launch
import kotlinx.serialization.Serializable

@Serializable
data class SosEvent(
    val id: String = "",
    val user_id: String = "",
    val emergency_type: String = "",
    val severity: String = "",
    val status: String = "active"
)

@Composable
fun VolunteerDashboardScreen(
    onNavigateBack: () -> Unit
) {
    var activeEvents by remember { mutableStateOf<List<SosEvent>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val coroutineScope = rememberCoroutineScope()

    LaunchedEffect(Unit) {
        try {
            val events = SupabaseClient.client.postgrest["sos_events"]
                .select {
                    filter {
                        eq("status", "active")
                    }
                }
                .decodeList<SosEvent>()
            activeEvents = events
        } catch (e: Exception) {
            errorMessage = e.message
        } finally {
            isLoading = false
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Text("Active SOS Alerts", style = MaterialTheme.typography.headlineMedium)
            TextButton(onClick = onNavigateBack) {
                Text("Back")
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        if (isLoading) {
            CircularProgressIndicator()
        } else if (errorMessage != null) {
            Text(errorMessage!!, color = MaterialTheme.colorScheme.error)
        } else if (activeEvents.isEmpty()) {
            Text("No active SOS alerts at the moment. Good job!")
        } else {
            LazyColumn {
                items(activeEvents) { event ->
                    Card(
                        modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp)
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text("User ID: ${event.user_id}", style = MaterialTheme.typography.titleMedium)
                            Text("Type: ${event.emergency_type}")
                            Text("Severity: ${event.severity}", color = MaterialTheme.colorScheme.error)
                            
                            Spacer(modifier = Modifier.height(8.dp))
                            
                            Button(onClick = {
                                coroutineScope.launch {
                                    try {
                                        // Update to assigned
                                        SupabaseClient.client.postgrest["sos_events"]
                                            .update({
                                                set("status", "assigned")
                                            }) {
                                                filter { eq("user_id", event.user_id) }
                                            }
                                        // Refresh list locally for simplicity
                                        activeEvents = activeEvents.filter { it.user_id != event.user_id }
                                    } catch (e: Exception) {
                                        errorMessage = "Failed to assign: ${e.message}"
                                    }
                                }
                            }) {
                                Text("Accept & Help")
                            }
                        }
                    }
                }
            }
        }
    }
}
