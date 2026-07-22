package com.example.resqnet

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.example.resqnet.data.ResQNetRepository
import com.example.resqnet.data.RoleManager
import com.example.resqnet.data.UserRole
import com.example.resqnet.theme.ResQBackground
import com.example.resqnet.ui.ai.AiFirstAidScreen
import com.example.resqnet.ui.components.ResQNetBottomBar
import com.example.resqnet.ui.components.ResQNetDrawerContent
import com.example.resqnet.ui.components.ResQNetHeader
import com.example.resqnet.ui.components.VolunteerDrawerContent
import com.example.resqnet.ui.contacts.EmergencyContactsScreen
import com.example.resqnet.ui.home.HomeScreen
import com.example.resqnet.ui.hospitals.HospitalsScreen
import com.example.resqnet.ui.login.LoginScreen
import com.example.resqnet.ui.login.OtpScreen
import com.example.resqnet.ui.login.SignupScreen
import com.example.resqnet.ui.onboarding.LocationPermissionScreen
import com.example.resqnet.ui.onboarding.NotificationPermissionScreen
import com.example.resqnet.ui.onboarding.RoleSelectionScreen
import com.example.resqnet.ui.profile.MedicalProfileScreen
import com.example.resqnet.ui.settings.SettingsScreen
import com.example.resqnet.ui.sos.ActiveSosScreen
import com.example.resqnet.ui.sos.EmergencySosScreen
import com.example.resqnet.ui.splash.SplashScreen
import com.example.resqnet.ui.support.FeedbackScreen
import com.example.resqnet.ui.support.HelpCenterScreen
import com.example.resqnet.ui.volunteer.AchievementsScreen
import com.example.resqnet.ui.volunteer.EmergencyAlertsScreen
import com.example.resqnet.ui.volunteer.NearbyCasesMapScreen
import com.example.resqnet.ui.volunteer.ResponseHistoryScreen
import com.example.resqnet.ui.volunteer.RouteNavigationScreen
import com.example.resqnet.ui.volunteer.VolunteerDashboardScreen
import com.example.resqnet.ui.welcome.WelcomeScreen
import kotlinx.coroutines.launch

@Composable
fun MainNavigation() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route ?: "splash"

    val drawerState = rememberDrawerState(initialValue = DrawerValue.Closed)
    val coroutineScope = rememberCoroutineScope()

    val showBars = currentRoute !in listOf(
        "splash", "welcome", "login", "signup", "otp",
        "role_selection", "location_permission", "notification_permission", "active_sos"
    )

    val isVolunteer = RoleManager.currentRole == UserRole.VOLUNTEER

    ModalNavigationDrawer(
        drawerState = drawerState,
        gesturesEnabled = showBars,
        drawerContent = {
            if (showBars) {
                if (isVolunteer) {
                    VolunteerDrawerContent(
                        currentRoute = currentRoute,
                        onNavigate = { route ->
                            coroutineScope.launch { drawerState.close() }
                            navController.navigate(route) {
                                popUpTo("home") { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        onLogout = {
                            ResQNetRepository.isLoggedInState = false
                            coroutineScope.launch { drawerState.close() }
                            navController.navigate("welcome") {
                                popUpTo(0) { inclusive = true }
                            }
                        }
                    )
                } else {
                    ResQNetDrawerContent(
                        currentRoute = currentRoute,
                        onNavigate = { route ->
                            coroutineScope.launch { drawerState.close() }
                            navController.navigate(route) {
                                popUpTo("home") { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        onLogout = {
                            ResQNetRepository.isLoggedInState = false
                            coroutineScope.launch { drawerState.close() }
                            navController.navigate("welcome") {
                                popUpTo(0) { inclusive = true }
                            }
                        }
                    )
                }
            }
        }
    ) {
        Scaffold(
            containerColor = ResQBackground,
            topBar = {
                if (showBars) {
                    ResQNetHeader(
                        onMenuClick = {
                            coroutineScope.launch { drawerState.open() }
                        }
                    )
                }
            },
            bottomBar = {
                if (showBars) {
                    ResQNetBottomBar(
                        currentRoute = currentRoute,
                        onNavigate = { route ->
                            navController.navigate(route) {
                                popUpTo("home") { saveState = true }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        ) { innerPadding ->
            Box(modifier = Modifier.padding(innerPadding)) {
                NavHost(navController = navController, startDestination = "splash") {
                    composable("splash") {
                        SplashScreen(
                            onSplashFinished = {
                                if (ResQNetRepository.isLoggedInState) {
                                    val target = if (RoleManager.currentRole == UserRole.VOLUNTEER) "volunteer_dashboard" else "home"
                                    navController.navigate(target) {
                                        popUpTo(0) { inclusive = true }
                                    }
                                } else {
                                    navController.navigate("welcome") {
                                        popUpTo("splash") { inclusive = true }
                                    }
                                }
                            }
                        )
                    }

                    composable("welcome") {
                        WelcomeScreen(
                            onNavigateToSignup = { navController.navigate("signup") },
                            onNavigateToLogin = { navController.navigate("login") },
                            onNavigateToSos = { navController.navigate("emergency_sos") }
                        )
                    }

                    composable("login") {
                        LoginScreen(
                            onLoginSuccess = {
                                val target = if (RoleManager.currentRole == UserRole.VOLUNTEER) "volunteer_dashboard" else "home"
                                navController.navigate(target) {
                                    popUpTo(0) { inclusive = true }
                                }
                            },
                            onNavigateToSignup = { navController.navigate("signup") },
                            onNavigateToOtp = { navController.navigate("otp") },
                            onNavigateToEmergency = { navController.navigate("home") }
                        )
                    }

                    composable("otp") {
                        OtpScreen(
                            onSuccess = {
                                navController.navigate("login") {
                                    popUpTo("otp") { inclusive = true }
                                }
                            },
                            onBackToLogin = { navController.popBackStack() }
                        )
                    }

                    composable("signup") {
                        SignupScreen(
                            onSignupSuccess = {
                                navController.navigate("role_selection") {
                                    popUpTo("signup") { inclusive = true }
                                }
                            },
                            onNavigateToLogin = { navController.navigate("login") }
                        )
                    }

                    composable("role_selection") {
                        RoleSelectionScreen(
                            onContinue = {
                                navController.navigate("location_permission") {
                                    popUpTo("role_selection") { inclusive = true }
                                }
                            }
                        )
                    }

                    composable("location_permission") {
                        LocationPermissionScreen(
                            onAllowLocation = {
                                navController.navigate("notification_permission") {
                                    popUpTo("location_permission") { inclusive = true }
                                }
                            },
                            onSkip = {
                                navController.navigate("notification_permission") {
                                    popUpTo("location_permission") { inclusive = true }
                                }
                            }
                        )
                    }

                    composable("notification_permission") {
                        NotificationPermissionScreen(
                            onEnableNotifications = {
                                val target = if (RoleManager.currentRole == UserRole.VOLUNTEER) "volunteer_dashboard" else "home"
                                navController.navigate(target) {
                                    popUpTo(0) { inclusive = true }
                                }
                            },
                            onSkip = {
                                val target = if (RoleManager.currentRole == UserRole.VOLUNTEER) "volunteer_dashboard" else "home"
                                navController.navigate(target) {
                                    popUpTo(0) { inclusive = true }
                                }
                            }
                        )
                    }

                    composable("home") {
                        HomeScreen(
                            onTriggerSos = { navController.navigate("emergency_sos") },
                            onNavigateToVoiceSos = { navController.navigate("emergency_sos") },
                            onNavigateToShakeSos = { navController.navigate("emergency_sos") },
                            onNavigateToHospitals = { navController.navigate("hospitals") },
                            onNavigateToContacts = { navController.navigate("emergency_contacts") },
                            onNavigateToProfile = { navController.navigate("medical_profile") },
                            onNavigateToAlerts = { navController.navigate("emergency_requests") },
                            onNavigateToTracking = { sosId -> navController.navigate("live_tracking") }
                        )
                    }

                    composable("volunteer_dashboard") {
                        VolunteerDashboardScreen(
                            onNavigateToTracking = { sosId -> navController.navigate("live_tracking") }
                        )
                    }

                    composable("emergency_requests") {
                        EmergencyAlertsScreen(
                            onNavigateToTracking = { sosId -> navController.navigate("live_tracking") }
                        )
                    }

                    composable("nearby_cases") {
                        NearbyCasesMapScreen(
                            onNavigateToTurnByTurn = { navController.navigate("live_tracking") }
                        )
                    }

                    composable("response_history") {
                        ResponseHistoryScreen()
                    }

                    composable("achievements") {
                        AchievementsScreen()
                    }

                    composable("settings") {
                        SettingsScreen()
                    }

                    composable("help_center") {
                        HelpCenterScreen()
                    }

                    composable("feedback") {
                        FeedbackScreen()
                    }

                    composable("emergency_sos") {
                        EmergencySosScreen(
                            onTriggerComplete = {
                                navController.navigate("active_sos")
                            }
                        )
                    }

                    composable("active_sos") {
                        ActiveSosScreen(
                            onSosConfirmed = { category ->
                                navController.navigate("live_tracking") {
                                    popUpTo("home")
                                }
                            },
                            onCancel = { navController.popBackStack() }
                        )
                    }

                    composable("live_tracking") {
                        RouteNavigationScreen(
                            onEndNavigation = {
                                val target = if (RoleManager.currentRole == UserRole.VOLUNTEER) "volunteer_dashboard" else "home"
                                navController.navigate(target) {
                                    popUpTo("home") { inclusive = true }
                                }
                            }
                        )
                    }

                    composable("hospitals") {
                        HospitalsScreen(
                            onBackClick = { navController.popBackStack() }
                        )
                    }

                    composable("emergency_contacts") {
                        EmergencyContactsScreen()
                    }

                    composable("medical_profile") {
                        MedicalProfileScreen(
                            onNavigateToContacts = { navController.navigate("emergency_contacts") },
                            onLogoutClick = {
                                ResQNetRepository.isLoggedInState = false
                                navController.navigate("welcome") {
                                    popUpTo(0) { inclusive = true }
                                }
                            }
                        )
                    }

                    composable("ai_aid") {
                        AiFirstAidScreen()
                    }

                    composable("alerts") {
                        EmergencyAlertsScreen(
                            onNavigateToTracking = { sosId -> navController.navigate("live_tracking") }
                        )
                    }
                }
            }
        }
    }
}
