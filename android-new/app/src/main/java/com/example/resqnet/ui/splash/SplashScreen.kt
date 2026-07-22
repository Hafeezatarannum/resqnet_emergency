package com.example.resqnet.ui.splash

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.DarkMode
import androidx.compose.material.icons.filled.LightMode
import androidx.compose.material.icons.filled.Shield
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqnet.theme.*
import kotlinx.coroutines.delay

@Composable
fun SplashScreen(
    onSplashFinished: () -> Unit
) {
    var hasNavigated by remember { mutableStateOf(false) }
    var isDarkMode by remember { mutableStateOf(false) }

    fun triggerFinish() {
        if (!hasNavigated) {
            hasNavigated = true
            onSplashFinished()
        }
    }

    // Auto-advance after 2.5 seconds
    LaunchedEffect(Unit) {
        delay(2500L)
        triggerFinish()
    }

    // Glowing Aura Animation
    val infiniteTransition = rememberInfiniteTransition(label = "splashPulse")
    val auraScale by infiniteTransition.animateFloat(
        initialValue = 0.95f,
        targetValue = 1.15f,
        animationSpec = infiniteRepeatable(
            animation = tween(1200, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(if (isDarkMode) ResQBackground else Color.White)
    ) {
        // Top right Controls (Theme Icon & Skip Button)
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(horizontal = 24.dp, vertical = 16.dp),
            horizontalArrangement = Arrangement.End,
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(
                onClick = { isDarkMode = !isDarkMode },
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(if (isDarkMode) ResQCardBackground else Color(0xFFF1F5F9))
            ) {
                Icon(
                    imageVector = if (isDarkMode) Icons.Default.LightMode else Icons.Default.DarkMode,
                    contentDescription = "Theme Toggle",
                    tint = if (isDarkMode) Color.White else Color(0xFF0F172A),
                    modifier = Modifier.size(20.dp)
                )
            }

            Spacer(modifier = Modifier.width(12.dp))

            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(24.dp))
                    .background(if (isDarkMode) ResQPrimaryRed.copy(alpha = 0.2f) else Color(0xFFFEE2E2))
                    .clickable { triggerFinish() }
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        text = "Skip",
                        color = ResQPrimaryRed,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Icon(
                        imageVector = Icons.Default.ArrowForward,
                        contentDescription = "Skip",
                        tint = ResQPrimaryRed,
                        modifier = Modifier.size(16.dp)
                    )
                }
            }
        }

        // Central Shield Logo + Glow + Wordmark + Subtitle
        Column(
            modifier = Modifier
                .align(Alignment.Center)
                .padding(horizontal = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Box(
                contentAlignment = Alignment.Center
            ) {
                // Red glowing aura
                Box(
                    modifier = Modifier
                        .size(130.dp)
                        .clip(CircleShape)
                        .background(ResQPrimaryRed.copy(alpha = 0.2f))
                )

                // Central Shield Red Icon Box
                Box(
                    modifier = Modifier
                        .size(86.dp)
                        .clip(RoundedCornerShape(24.dp))
                        .background(
                            Brush.linearGradient(
                                colors = listOf(ResQPrimaryRed, Color(0xFFC5111E))
                            )
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        imageVector = Icons.Default.Shield,
                        contentDescription = "ResQNet Logo",
                        tint = Color.White,
                        modifier = Modifier.size(44.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // ResQNet Wordmark
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    text = "Res",
                    color = if (isDarkMode) Color.White else Color(0xFF0F172A),
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Black
                )
                Text(
                    text = "Q",
                    color = ResQPrimaryRed,
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Black
                )
                Text(
                    text = "Net",
                    color = if (isDarkMode) Color.White else Color(0xFF0F172A),
                    fontSize = 32.sp,
                    fontWeight = FontWeight.Black
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            // Tagline / Subtitle
            Text(
                text = "Help Arrives When Seconds Matter",
                color = if (isDarkMode) ResQTextMuted else Color(0xFF94A3B8),
                fontSize = 14.sp,
                fontWeight = FontWeight.Medium
            )
        }

        // Bottom Progress Red Line Indicator
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .navigationBarsPadding()
                .padding(bottom = 48.dp)
                .width(100.dp)
                .height(4.dp)
                .clip(RoundedCornerShape(2.dp))
                .background(ResQPrimaryRed)
        )
    }
}
