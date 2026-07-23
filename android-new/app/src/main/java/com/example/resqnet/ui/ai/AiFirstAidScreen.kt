package com.example.resqnet.ui.ai

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
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.Healing
import androidx.compose.material.icons.filled.LocalFireDepartment
import androidx.compose.material.icons.filled.Send
import androidx.compose.material.icons.filled.SmartToy
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqnet.theme.*

data class Message(val sender: String, val text: String)

@Composable
fun AiFirstAidScreen() {
    var queryText by remember { mutableStateOf("") }
    val messages = remember {
        mutableStateListOf(
            Message("ai", "Hello! I am your ResQNet AI Emergency First Aid Assistant. Ask any first aid or emergency response question below, or select a quick topic.")
        )
    }

    val guides = listOf(
        GuideItem("CPR Guide", Icons.Default.Favorite, ResQPrimaryRed),
        GuideItem("Severe Bleeding", Icons.Default.Healing, ResQWarningOrange),
        GuideItem("Burn Treatment", Icons.Default.LocalFireDepartment, ResQBrandBlue)
    )

    fun getAiFirstAidResponse(query: String): String {
        val q = query.lowercase().trim()
        return when {
            q.contains("cpr") || q.contains("cardiac") || q.contains("heart stop") || q.contains("unconscious") ->
                "🚨 CPR & CARDIAC ARREST RESPONSE:\n" +
                "1. Check for responsiveness & breathing.\n" +
                "2. Call 911 or trigger ResQNet SOS immediately.\n" +
                "3. Place hands in center of chest.\n" +
                "4. Perform hard & fast chest compressions (100-120 bpm, 2 inches deep).\n" +
                "5. Continue until emergency medical help arrives."

            q.contains("bleed") || q.contains("blood") || q.contains("cut") || q.contains("wound") ->
                "🩸 SEVERE BLEEDING CONTROL:\n" +
                "1. Apply direct, firm pressure over wound with clean cloth.\n" +
                "2. Keep pressure applied continuously—do not lift cloth to inspect.\n" +
                "3. Elevate injured area above heart level if possible.\n" +
                "4. If blood soaks through, place another cloth directly on top.\n" +
                "5. Call emergency services if bleeding is heavy or spurting."

            q.contains("burn") || q.contains("scald") || q.contains("fire") ->
                "🔥 BURN FIRST AID:\n" +
                "1. Cool the burn under cool (not ice-cold) running water for 10–20 minutes.\n" +
                "2. Remove clothing/jewelry near burn before swelling starts.\n" +
                "3. Cover burn loosely with sterile non-stick bandage or plastic wrap.\n" +
                "4. Do NOT pop blisters or apply butter/oils."

            q.contains("snake") || q.contains("bite") || q.contains("venom") ->
                "🐍 SNAKE BITE EMERGENCY:\n" +
                "1. Keep victim calm & immobilized; prevent movement to slow venom flow.\n" +
                "2. Keep bitten limb at or below heart level.\n" +
                "3. Remove rings, watches, or tight clothing near bite.\n" +
                "4. Clean wound gently—do NOT suck venom, cut skin, or apply tourniquet.\n" +
                "5. Transport immediately to hospital with antivenom."

            q.contains("chok") || q.contains("airway") || q.contains("food stuck") ->
                "😮‍💨 CHOKING EMERGENCY (HEIMLICH MANEUVER):\n" +
                "1. Stand behind victim and wrap arms around waist.\n" +
                "2. Make a fist with one hand, place just above navel.\n" +
                "3. Grasp fist with other hand and give quick, upward abdominal thrusts.\n" +
                "4. Repeat until object is dislodged or victim becomes unresponsive."

            q.contains("fracture") || q.contains("bone") || q.contains("broken") || q.contains("sprain") ->
                "🦴 BONE FRACTURE & SPRAIN CARE:\n" +
                "1. Immobilize the injured area immediately—do NOT try to realign bone.\n" +
                "2. Apply ice wrapped in towel for 15-20 minutes to reduce swelling.\n" +
                "3. Support joint with soft padding or splint.\n" +
                "4. Seek immediate orthopedic emergency care."

            q.contains("seizure") || q.contains("fit") || q.contains("epilepsy") ->
                "⚡ SEIZURE FIRST AID:\n" +
                "1. Ease person to floor and turn onto side to keep airway clear.\n" +
                "2. Clear hard or sharp objects away from victim.\n" +
                "3. Cushion victim's head with folded jacket or pillow.\n" +
                "4. Do NOT hold them down or put anything in their mouth."

            q.contains("faint") || q.contains("dizzy") || q.contains("pass out") ->
                "😵 FAINTING & LOSS OF CONSCIOUSNESS:\n" +
                "1. Lay person flat on back and elevate legs 12 inches.\n" +
                "2. Loosen tight collars, belts, or waistbands.\n" +
                "3. Check breathing; if unresponsive for > 1 min, call emergency services."

            q.contains("stroke") || q.contains("paralysis") || q.contains("speech") ->
                "🧠 STROKE IDENTIFICATION (FAST Test):\n" +
                "• F (Face): Ask to smile—does one side droop?\n" +
                "• A (Arms): Ask to raise both arms—does one arm drift down?\n" +
                "• S (Speech): Is speech slurred or strange?\n" +
                "• T (Time): Call emergency services immediately!"

            q.contains("poison") || q.contains("overdose") || q.contains("chemical") ->
                "⚠️ POISONING & CHEMICAL EXPOSURE:\n" +
                "1. If swallowed: Do NOT induce vomiting unless instructed by poison control.\n" +
                "2. If in eyes: Flush eyes with lukewarm water for 15-20 minutes.\n" +
                "3. Call Poison Control / Emergency Services with chemical name immediately."

            else ->
                "🩺 FIRST AID GUIDANCE:\n" +
                "1. Ensure scene safety before approaching victim.\n" +
                "2. Check responsiveness (Alert, Voice, Pain, Unresponsive).\n" +
                "3. Call 911 or trigger ResQNet SOS for immediate ambulance dispatch.\n" +
                "4. Keep victim calm, warm, and comfortable until medical personnel arrive."
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(ResQBackground)
            .padding(16.dp)
    ) {
        // AI Title Header
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(10.dp),
            modifier = Modifier.padding(bottom = 12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(ResQBrandBlue.copy(alpha = 0.2f)),
                contentAlignment = Alignment.Center
            ) {
                Icon(imageVector = Icons.Default.SmartToy, contentDescription = "AI Assistant", tint = ResQBrandBlue, modifier = Modifier.size(22.dp))
            }
            Column {
                Text(text = "ResQNet AI First Aid Assistant", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = Color.White)
                Text(text = "Instant, offline emergency response steps", fontSize = 12.sp, color = ResQTextMuted)
            }
        }

        // Quick Guides Chips
        LazyRow(
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            modifier = Modifier.padding(bottom = 12.dp)
        ) {
            items(guides) { guide ->
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(18.dp))
                        .background(ResQCardBackground)
                        .border(1.dp, ResQCardBorder, RoundedCornerShape(18.dp))
                        .clickable {
                            val response = getAiFirstAidResponse(guide.title)
                            messages.add(Message("user", guide.title))
                            messages.add(Message("ai", response))
                        }
                        .padding(horizontal = 12.dp, vertical = 8.dp)
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                        Icon(imageVector = guide.icon, contentDescription = guide.title, tint = guide.tint, modifier = Modifier.size(16.dp))
                        Text(text = guide.title, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
                    }
                }
            }
        }

        // Chat Log
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(10.dp),
            contentPadding = PaddingValues(vertical = 8.dp)
        ) {
            items(messages) { msg ->
                val isAi = msg.sender == "ai"
                Box(
                    modifier = Modifier.fillMaxWidth(),
                    contentAlignment = if (isAi) Alignment.CenterStart else Alignment.CenterEnd
                ) {
                    Box(
                        modifier = Modifier
                            .widthIn(max = 300.dp)
                            .clip(RoundedCornerShape(18.dp))
                            .background(if (isAi) ResQCardBackground else ResQBrandBlue)
                            .border(1.dp, if (isAi) ResQCardBorder else Color.Transparent, RoundedCornerShape(18.dp))
                            .padding(14.dp)
                    ) {
                        Text(
                            text = msg.text,
                            fontSize = 13.sp,
                            color = Color.White,
                            lineHeight = 18.sp
                        )
                    }
                }
            }
        }

        // Query Input Field
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 8.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            OutlinedTextField(
                value = queryText,
                onValueChange = { queryText = it },
                placeholder = { Text("Ask AI First Aid Assistant...", color = ResQTextMuted, fontSize = 13.sp) },
                modifier = Modifier.weight(1f),
                singleLine = true,
                shape = RoundedCornerShape(24.dp),
                colors = OutlinedTextFieldDefaults.colors(
                    focusedBorderColor = ResQBrandBlue,
                    unfocusedBorderColor = ResQCardBorder,
                    focusedContainerColor = ResQCardBackground,
                    unfocusedContainerColor = ResQCardBackground
                )
            )

            IconButton(
                onClick = {
                    if (queryText.isNotBlank()) {
                        val userQ = queryText
                        queryText = ""
                        messages.add(Message("user", userQ))
                        val aiAns = getAiFirstAidResponse(userQ)
                        messages.add(Message("ai", aiAns))
                    }
                },
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(ResQBrandBlue)
            ) {
                Icon(imageVector = Icons.Default.Send, contentDescription = "Send", tint = Color.White, modifier = Modifier.size(20.dp))
            }
        }
    }
}

private data class GuideItem(val title: String, val icon: ImageVector, val tint: Color)
