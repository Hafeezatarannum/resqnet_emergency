export const translations = {
  en: {
    // Navigation
    nav: {
      home: "Home",
      map: "Map",
      aiHelp: "AI Help",
      alerts: "Alerts",
      profile: "Profile",
    },
    // General
    general: {
      continue: "Continue",
      login: "Login",
      getStarted: "Get Started",
      or: "or",
    },
    // Language
    lang: {
      title: "Choose your language",
      subtitle: "You can change this anytime",
      speaks: "speaks your language",
    },
    // Login
    auth: {
      welcome: "Welcome back",
      loginToSave: "Log in to continue saving lives",
      phone: "Phone number",
      password: "Password",
      forgot: "Forgot password?",
      google: "Continue with Google",
      newTo: "New to ResQNet?",
      createAcc: "Create account",
    },
    // Home
    home: {
      greeting: "Hello, Aarav",
      ready: "Ready to save lives?",
      sos: "SOS",
      tapForHelp: "Tap for Emergency Help",
    },
  },
  hi: {
    nav: {
      home: "होम",
      map: "नक्शा",
      aiHelp: "AI मदद",
      alerts: "अलर्ट",
      profile: "प्रोफाइल",
    },
    general: {
      continue: "जारी रखें",
      login: "लॉग इन",
      getStarted: "शुरू करें",
      or: "या",
    },
    lang: {
      title: "अपनी भाषा चुनें",
      subtitle: "आप इसे कभी भी बदल सकते हैं",
      speaks: "आपकी भाषा बोलता है",
    },
    auth: {
      welcome: "वापसी पर स्वागत है",
      loginToSave: "जान बचाने के लिए लॉग इन करें",
      phone: "फ़ोन नंबर",
      password: "पासवर्ड",
      forgot: "पासवर्ड भूल गए?",
      google: "Google के साथ जारी रखें",
      newTo: "ResQNet पर नए हैं?",
      createAcc: "अकाउंट बनाएं",
    },
    home: {
      greeting: "नमस्ते, Aarav",
      ready: "क्या आप जीवन बचाने के लिए तैयार हैं?",
      sos: "मदद",
      tapForHelp: "आपातकालीन मदद के लिए टैप करें",
    },
  },
  ta: {
    nav: {
      home: "முகப்பு",
      map: "வரைபடம்",
      aiHelp: "AI உதவி",
      alerts: "எச்சரிக்கைகள்",
      profile: "சுயவிவரம்",
    },
    general: {
      continue: "தொடரவும்",
      login: "உள்நுழைய",
      getStarted: "தொடங்கவும்",
      or: "அல்லது",
    },
    lang: {
      title: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
      subtitle: "நீங்கள் இதை எப்போது வேண்டுமானாலும் மாற்றலாம்",
      speaks: "உங்கள் மொழியைப் பேசுகிறது",
    },
    auth: {
      welcome: "மீண்டும் வருக",
      loginToSave: "உயிர்களைக் காக்க உள்நுழைக",
      phone: "தொலைபேசி எண்",
      password: "கடவுச்சொல்",
      forgot: "கடவுச்சொல் மறந்துவிட்டதா?",
      google: "Google மூலம் தொடரவும்",
      newTo: "ResQNetக்கு புதியவரா?",
      createAcc: "கணக்கை உருவாக்கு",
    },
    home: {
      greeting: "வணக்கம், Aarav",
      ready: "உயிர்களைக் காக்க தயாரா?",
      sos: "உதவி",
      tapForHelp: "அவசர உதவிக்கு தட்டவும்",
    },
  },
} as const;

export type LanguageCode = keyof typeof translations;
