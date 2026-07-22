package com.example.resqnet.ui.map

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Directions
import androidx.compose.material.icons.filled.LocalHospital
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.example.resqnet.theme.*
import com.google.android.gms.maps.model.CameraPosition
import com.google.android.gms.maps.model.LatLng
import com.google.maps.android.compose.*

data class HospitalItem(val name: String, val distance: String, val beds: Int, val latLng: LatLng)

@Composable
fun MapScreen() {
    var selectedFilter by remember { mutableStateOf("Hospitals") }
    val defaultPos = LatLng(12.9716, 77.5946)
    val cameraPositionState = rememberCameraPositionState {
        position = CameraPosition.fromLatLngZoom(defaultPos, 14f)
    }

    val hospitalList = listOf(
        HospitalItem("Apollo Emergency Care", "0.8 km", 12, LatLng(12.9725, 77.5955)),
        HospitalItem("Fortis Multi-Specialty", "1.5 km", 5, LatLng(12.9760, 77.5990)),
        HospitalItem("City General Hospital", "2.2 km", 18, LatLng(12.9680, 77.5910))
    )

    var selectedHospital by remember { mutableStateOf(hospitalList[0]) }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(ResQBackground)
    ) {
        // Google Map view
        GoogleMap(
            modifier = Modifier.fillMaxSize(),
            cameraPositionState = cameraPositionState
        ) {
            hospitalList.forEach { hospital ->
                Marker(
                    state = MarkerState(position = hospital.latLng),
                    title = hospital.name,
                    snippet = "${hospital.distance} • ${hospital.beds} ICU beds available",
                    onClick = {
                        selectedHospital = hospital
                        false
                    }
                )
            }
        }

        // Top Filter Bar
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            val filters = listOf("All", "Hospitals", "Ambulance", "Police", "Fire")
            items(filters) { filter ->
                val isSelected = selectedFilter == filter
                Box(
                    modifier = Modifier
                        .clip(RoundedCornerShape(20.dp))
                        .background(if (isSelected) ResQPrimaryRed else ResQCardBackground)
                        .border(1.dp, if (isSelected) ResQPrimaryRed else ResQCardBorder, RoundedCornerShape(20.dp))
                        .clickable { selectedFilter = filter }
                        .padding(horizontal = 14.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = filter,
                        color = Color.White,
                        fontSize = 12.sp,
                        fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal
                    )
                }
            }
        }

        // Bottom Hospital Card Overlay
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .align(Alignment.BottomCenter)
                .padding(16.dp)
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(20.dp))
                    .background(ResQCardBackground)
                    .border(1.dp, ResQCardBorder, RoundedCornerShape(20.dp))
                    .padding(16.dp)
            ) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            Icon(imageVector = Icons.Default.LocalHospital, contentDescription = null, tint = ResQSuccessGreen)
                            Text(text = selectedHospital.name, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = Color.White)
                        }
                        Text(text = selectedHospital.distance, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = ResQTextMuted)
                    }

                    Text(text = "Available ICU Beds: ${selectedHospital.beds} • 24/7 Trauma Care", fontSize = 12.sp, color = ResQTextMuted)

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Button(
                            onClick = {},
                            modifier = Modifier
                                .weight(1f)
                                .height(44.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = ResQBrandBlue)
                        ) {
                            Icon(imageVector = Icons.Default.Directions, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "Navigate", fontWeight = FontWeight.Bold, fontSize = 12.sp)
                        }

                        OutlinedButton(
                            onClick = {},
                            modifier = Modifier
                                .weight(1f)
                                .height(44.dp),
                            colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.White)
                        ) {
                            Icon(imageVector = Icons.Default.Call, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text(text = "Call ER", fontSize = 12.sp)
                        }
                    }
                }
            }
        }
    }
}
