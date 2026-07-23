package com.example.resqnet.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import com.example.resqnet.data.ResQNetRepository

private val DarkColorScheme = darkColorScheme(
    primary = ResQPrimaryRed,
    onPrimary = Color.White,
    primaryContainer = ResQPrimaryGlow,
    onPrimaryContainer = Color.White,
    secondary = ResQBrandBlue,
    onSecondary = Color.White,
    background = Color(0xFF071A2F),
    onBackground = Color(0xFFFFFFFF),
    surface = Color(0xFF0D1B2A),
    onSurface = Color(0xFFFFFFFF),
    surfaceVariant = Color(0xFF112240),
    onSurfaceVariant = Color(0xFFA8B3CF),
    outline = Color(0x1AFFFFFF),
    error = ResQPrimaryRed,
    onError = Color.White
)

private val LightColorScheme = lightColorScheme(
    primary = ResQPrimaryRed,
    onPrimary = Color.White,
    primaryContainer = ResQPrimaryGlow,
    onPrimaryContainer = Color.White,
    secondary = ResQBrandBlue,
    onSecondary = Color.White,
    background = Color(0xFFF1F5F9),
    onBackground = Color(0xFF0F172A),
    surface = Color(0xFFFFFFFF),
    onSurface = Color(0xFF0F172A),
    surfaceVariant = Color(0xFFE2E8F0),
    onSurfaceVariant = Color(0xFF64748B),
    outline = Color(0xFFCBD5E1),
    error = ResQPrimaryRed,
    onError = Color.White
)

@Composable
fun ResqnetTheme(
    content: @Composable () -> Unit
) {
    val systemDark = isSystemInDarkTheme()
    val isDark = when (ResQNetRepository.selectedThemeState) {
        "Light" -> false
        "Dark" -> true
        else -> systemDark
    }

    val colorScheme = if (isDark) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
