package com.example.resqnet.data

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue

enum class UserRole {
    VICTIM,
    VOLUNTEER
}

object RoleManager {
    var currentRole by mutableStateOf(UserRole.VICTIM)

    fun toggleRole() {
        currentRole = if (currentRole == UserRole.VICTIM) UserRole.VOLUNTEER else UserRole.VICTIM
    }
}
