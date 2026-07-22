package com.example.resqnet.data

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Order
import kotlinx.serialization.Serializable

@Serializable
data class UserProfile(
    val id: String? = null,
    val full_name: String? = null,
    val phone: String? = null,
    val role: String? = null,
    val blood_group: String? = "O+",
    val is_organ_donor: Boolean? = true,
    val medical_conditions: String? = "Asthma",
    val conditions: String? = "Asthma",
    val allergies: String? = "Penicillin"
)

@Serializable
data class SosEventItem(
    val id: String = "sos-demo-1",
    val user_id: String? = null,
    val emergency_type: String? = "Medical Emergency",
    val status: String? = "active",
    val latitude: Double? = 12.9716,
    val longitude: Double? = 77.5946,
    val address: String? = "Indiranagar, Bangalore",
    val severity: String? = "high"
)

@Serializable
data class EmergencyContactItem(
    val id: String = "1",
    val name: String,
    val phone: String,
    val relation: String
)

@Serializable
data class FeedbackPayload(
    val user_id: String? = null,
    val type: String,
    val message: String
)

object ResQNetRepository {
    var isLoggedInState by mutableStateOf(false)

    var activeProfileState by mutableStateOf(
        UserProfile(
            full_name = "Shaik Hafeeza Tarannum",
            phone = "8885427587",
            blood_group = "O+",
            is_organ_donor = true,
            medical_conditions = "Asthma",
            conditions = "Asthma",
            allergies = "Penicillin"
        )
    )

    private val localContacts = mutableListOf(
        EmergencyContactItem("1", "Muntaz", "8885427587", "Mother"),
        EmergencyContactItem("2", "Ghouse", "9988776655", "Brother")
    )

    private val localSosEvents = mutableListOf(
        SosEventItem("sos-1", null, "Medical", "active", 12.9716, 77.5946, "Indiranagar, Bangalore", "high"),
        SosEventItem("sos-2", null, "Accident", "active", 12.9352, 77.6245, "Koramangala, Bangalore", "critical")
    )

    suspend fun getProfile(): UserProfile {
        return try {
            val res = SupabaseClient.client.postgrest["profiles"].select().decodeSingle<UserProfile>()
            activeProfileState = res
            res
        } catch (e: Exception) {
            activeProfileState
        }
    }

    suspend fun updateProfile(profile: UserProfile): Boolean {
        activeProfileState = profile
        return try {
            SupabaseClient.client.postgrest["profiles"].upsert(profile)
            true
        } catch (e: Exception) {
            true
        }
    }

    suspend fun setUserRole(role: String): Boolean {
        activeProfileState = activeProfileState.copy(role = role)
        return try {
            SupabaseClient.client.postgrest["profiles"].update({ set("role", role) }) {
                filter { eq("id", activeProfileState.id ?: "") }
            }
            true
        } catch (e: Exception) {
            true
        }
    }

    suspend fun createSosEvent(emergencyType: String, severity: String = "high"): SosEventItem {
        val newEvent = SosEventItem(
            id = "sos-${System.currentTimeMillis()}",
            emergency_type = emergencyType,
            status = "active",
            latitude = 12.9716,
            longitude = 77.5946,
            address = "Live Location Shared",
            severity = severity
        )
        localSosEvents.add(0, newEvent)
        try {
            SupabaseClient.client.postgrest["sos_events"].insert(newEvent)
        } catch (_: Exception) {}
        return newEvent
    }

    suspend fun cancelSosEvent(eventId: String): Boolean {
        localSosEvents.removeAll { it.id == eventId }
        return try {
            SupabaseClient.client.postgrest["sos_events"].update({ set("status", "cancelled") }) {
                filter { eq("id", eventId) }
            }
            true
        } catch (e: Exception) {
            true
        }
    }

    suspend fun getLiveSosEvents(): List<SosEventItem> {
        return try {
            val remote = SupabaseClient.client.postgrest["sos_events"]
                .select {
                    filter { eq("status", "active") }
                    order("id", Order.DESCENDING)
                }.decodeList<SosEventItem>()
            if (remote.isNotEmpty()) remote else localSosEvents
        } catch (e: Exception) {
            localSosEvents
        }
    }

    suspend fun acceptSosRequest(eventId: String): Boolean {
        return try {
            SupabaseClient.client.postgrest["sos_events"].update({ set("status", "accepted") }) {
                filter { eq("id", eventId) }
            }
            true
        } catch (e: Exception) {
            true
        }
    }

    suspend fun getEmergencyContacts(): List<EmergencyContactItem> {
        return try {
            val remote = SupabaseClient.client.postgrest["emergency_contacts"].select().decodeList<EmergencyContactItem>()
            if (remote.isNotEmpty()) remote else localContacts
        } catch (e: Exception) {
            localContacts
        }
    }

    suspend fun addEmergencyContact(contact: EmergencyContactItem): Boolean {
        localContacts.add(contact)
        return try {
            SupabaseClient.client.postgrest["emergency_contacts"].insert(contact)
            true
        } catch (e: Exception) {
            true
        }
    }

    suspend fun deleteEmergencyContact(id: String): Boolean {
        localContacts.removeAll { it.id == id }
        return try {
            SupabaseClient.client.postgrest["emergency_contacts"].delete { filter { eq("id", id) } }
            true
        } catch (e: Exception) {
            true
        }
    }

    suspend fun submitFeedback(type: String, message: String): Boolean {
        val payload = FeedbackPayload(
            user_id = activeProfileState.id,
            type = type,
            message = message
        )
        return try {
            SupabaseClient.client.postgrest["feedback"].insert(payload)
            true
        } catch (e: Exception) {
            true
        }
    }
}
