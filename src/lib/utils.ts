import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function triggerEmergencySms(phones: string[], lat?: number, lng?: number) {
  if (!phones || phones.length === 0) return;

  const phoneString = phones.join(',');
  
  let message = "EMERGENCY! I have triggered an SOS from my ResQNet app. I need help immediately.";
  if (lat && lng) {
    message += `\nMy live location: https://maps.google.com/?q=${lat},${lng}`;
  }

  const encodedMessage = encodeURIComponent(message);
  
  // Create an invisible anchor tag to safely trigger the SMS intent
  const a = document.createElement('a');
  // iOS devices generally prefer &body=, Android prefers ?body=
  const separator = navigator.userAgent.toLowerCase().includes('iphone') || navigator.userAgent.toLowerCase().includes('ipad') ? '&' : '?';
  
  a.href = `sms:${phoneString}${separator}body=${encodedMessage}`;
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}
