package com.example.resqnet.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = ResQPrimaryRed,
    onPrimary = Color.White,
    primaryContainer = ResQPrimaryGlow,
    onPrimaryContainer = Color.White,
    secondary = ResQBrandBlue,
    onSecondary = Color.White,
    background = ResQBackground,
    onBackground = ResQTextPrimary,
    surface = ResQCardBackground,
    onSurface = ResQTextPrimary,
    surfaceVariant = ResQSurfaceVariant,
    onSurfaceVariant = ResQTextMuted,
    outline = ResQCardBorder,
    error = ResQPrimaryRed,
    onError = Color.White
)

@Composable
fun ResqnetTheme(
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = DarkColorScheme,
        typography = Typography,
        content = content
    )
}
