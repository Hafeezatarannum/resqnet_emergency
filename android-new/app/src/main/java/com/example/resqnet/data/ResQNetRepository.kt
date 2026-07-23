package com.example.resqnet.data

import android.content.Context
import android.location.Location
import android.location.LocationManager
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import io.github.jan.supabase.postgrest.postgrest
import io.github.jan.supabase.postgrest.query.Order
import kotlinx.serialization.Serializable
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

@Serializable
data class EmergencyContactItem(
    val id: String = "",
    val name: String = "",
    val relation: String? = null,
    val phone: String = ""
)

@Serializable
data class UserProfile(
    val id: String = "",
    val full_name: String? = null,
    val phone: String? = null,
    val role: String? = null,
    val blood_group: String? = null,
    val conditions: String? = null,
    val allergies: String? = null
)

@Serializable
data class SosEventItem(
    val id: String = "",
    val user_id: String = "",
    val emergency_type: String? = null,
    val status: String? = "active",
    val latitude: Double = 13.0827,
    val longitude: Double = 80.2707,
    val severity: String? = "high",
    val address: String? = "Anna Salai, Chennai",
    val timestamp: String = "10:15 PM"
)

@Serializable
data class FeedbackItem(
    val id: String = "",
    val type: String = "",
    val message: String = "",
    val user_id: String = ""
)

object ResQNetRepository {
    var isLoggedInState by mutableStateOf(true)
    var selectedThemeState by mutableStateOf("Dark")

    var activeProfileState by mutableStateOf(
        UserProfile(
            id = "usr_001",
            full_name = "Shaik Hafeeza Tarannum",
            phone = "8885427587",
            role = "user",
            blood_group = "O+",
            conditions = "INFECTION",
            allergies = "NONE"
        )
    )

    val localContacts = mutableStateListOf(
        EmergencyContactItem(id = "1", name = "Muntaz", relation = "Mother", phone = "9989927587"),
        EmergencyContactItem(id = "2", name = "Ghouse", relation = "Father", phone = "9908822425")
    )

    private fun getCurrentFormattedTime(): String {
        return try {
            SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())
        } catch (_: Exception) {
            "Just now"
        }
    }

    fun getUserGpsLocation(context: Context?): Pair<Double, Double> {
        if (context == null) return Pair(13.0827, 80.2707)
        return try {
            val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager
            val loc = locationManager.getLastKnownLocation(LocationManager.GPS_PROVIDER)
                ?: locationManager.getLastKnownLocation(LocationManager.NETWORK_PROVIDER)
            if (loc != null) Pair(loc.latitude, loc.longitude) else Pair(13.0827, 80.2707)
        } catch (_: Exception) {
            Pair(13.0827, 80.2707)
        }
    }

    // Active Citizen User Emergency Requests (for Volunteer response)
    val localSosEvents = mutableStateListOf(
        SosEventItem(id = "sos_001", user_id = "Kavitha S (Citizen User)", emergency_type = "Medical", status = "active", latitude = 13.0827, longitude = 80.2707, severity = "Critical", address = "Anna Salai, Chennai (0.4 km away)", timestamp = getCurrentFormattedTime()),
        SosEventItem(id = "sos_002", user_id = "Rahul Sharma (Citizen User)", emergency_type = "Accident", status = "active", latitude = 13.0850, longitude = 80.2750, severity = "High", address = "T. Nagar, Chennai (1.1 km away)", timestamp = "10:12 PM"),
        SosEventItem(id = "sos_003", user_id = "Ananya Roy (Citizen User)", emergency_type = "Cardiac", status = "active", latitude = 13.0780, longitude = 80.2650, severity = "Emergency", address = "Nungambakkam, Chennai (1.8 km away)", timestamp = "09:55 PM")
    )

    suspend fun getProfile(): UserProfile {
        return try {
            val remote = SupabaseClient.client.postgrest["profiles"]
                .select {
                    filter { eq("id", activeProfileState.id) }
                }.decodeSingleOrNull<UserProfile>()
            if (remote != null) {
                activeProfileState = remote
            }
            activeProfileState
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
            SupabaseClient.client.postgrest["profiles"].update({
                set("role", role)
            }) {
                filter { eq("id", activeProfileState.id) }
            }
            true
        } catch (e: Exception) {
            true
        }
    }

    suspend fun createSosEvent(context: Context?, emergencyType: String, severity: String = "high"): SosEventItem {
        val exactTime = getCurrentFormattedTime()
        val (lat, lng) = getUserGpsLocation(context)

        val newEvent = SosEventItem(
            id = "sos_${System.currentTimeMillis()}",
            user_id = "${activeProfileState.full_name ?: "Shaik Hafeeza Tarannum"} (Citizen User)",
            emergency_type = emergencyType,
            status = "active",
            latitude = lat,
            longitude = lng,
            severity = severity,
            address = "Live User GPS (${String.format("%.4f", lat)}, ${String.format("%.4f", lng)})",
            timestamp = exactTime
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
            if (remote.isNotEmpty()) {
                localContacts.clear()
                localContacts.addAll(remote)
            }
            localContacts
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
            SupabaseClient.client.postgrest["emergency_contacts"].delete {
                filter { eq("id", id) }
            }
            true
        } catch (e: Exception) {
            true
        }
    }

    suspend fun submitFeedback(type: String, message: String): Boolean {
        val item = FeedbackItem(
            id = "fb_${System.currentTimeMillis()}",
            type = type,
            message = message,
            user_id = activeProfileState.id
        )
        return try {
            SupabaseClient.client.postgrest["feedback"].insert(item)
            true
        } catch (e: Exception) {
            true
        }
    }
}
