import { supabase } from '@/lib/supabase'

// ---------------------------------------------------------------------------
// Profile type — mirrors the `profiles` table in Supabase
// ---------------------------------------------------------------------------
export type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  avatar_url: string | null
  role: 'user' | 'volunteer'
  blood_group: string | null
  allergies: string | null
  conditions: string | null
  medications: string | null
  contact_name: string | null
  contact_phone: string | null
  is_verified: boolean
  created_at: string
  updated_at: string
}

export type SosEvent = {
  id: string
  user_id: string
  emergency_type: string | null
  severity: string | null
  status: 'active' | 'assigned' | 'completed' | 'cancelled'
  latitude: number | null
  longitude: number | null
  address: string | null
  description: string | null
  created_at: string
  resolved_at: string | null
}

// ---------------------------------------------------------------------------
// PROFILE API
// ---------------------------------------------------------------------------

/** Fetch the logged-in user's profile */
export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) { console.error('getProfile error:', error.message); return null }
  return data as Profile
}

/** Update the logged-in user's profile fields */
export async function updateProfile(
  userId: string,
  updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>
): Promise<{ error: string | null }> {
  // First, try to update the existing row
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()

  if (error) {
    return { error: error.message }
  }

  // If no rows were updated, the profile doesn't exist yet, so insert it.
  if (data && data.length === 0) {
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({ id: userId, ...updates, updated_at: new Date().toISOString() })
    
    if (insertError) {
      return { error: `Insert failed: ${insertError.message}` }
    }
  }

  return { error: null }
}

/** Switch the user's role between 'user' and 'volunteer' */
export async function setUserRole(
  userId: string,
  role: 'user' | 'volunteer'
): Promise<{ error: string | null }> {
  return updateProfile(userId, { role })
}

// ---------------------------------------------------------------------------
// SOS API
// ---------------------------------------------------------------------------

/** Create a new SOS event and return its ID */
export async function createSosEvent(payload: {
  userId: string
  emergencyType?: string
  severity?: string
  latitude?: number
  longitude?: number
  address?: string
  description?: string
}): Promise<{ id: string | null; error: string | null }> {
  const { data, error } = await supabase
    .from('sos_events')
    .insert({
      user_id: payload.userId,
      emergency_type: payload.emergencyType ?? 'other',
      severity: payload.severity ?? 'high',
      latitude: payload.latitude,
      longitude: payload.longitude,
      address: payload.address,
      description: payload.description,
      status: 'active',
    })
    .select('id')
    .single()

  if (error) return { id: null, error: error.message }
  return { id: data.id, error: null }
}

/** Cancel an active SOS event */
export async function cancelSosEvent(
  sosId: string
): Promise<{ error: string | null }> {
  return updateSosStatus(sosId, 'cancelled');
}

/** Update the status of an SOS event */
export async function updateSosStatus(
  sosId: string,
  status: 'active' | 'assigned' | 'completed' | 'cancelled'
): Promise<{ error: string | null }> {
  const updateData: any = { status };
  
  if (status === 'completed' || status === 'cancelled') {
    updateData.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('sos_events')
    .update(updateData)
    .eq('id', sosId)

  return { error: error ? error.message : null }
}

/** Utility to clear all active test events */
export async function clearAllSosEvents(): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('sos_events')
    .update({ status: 'cancelled', resolved_at: new Date().toISOString() })
    .eq('status', 'active')

  return { error: error ? error.message : null }
}

/** Fetch all active SOS events for the Volunteer Dashboard */
export async function getLiveSosEvents(): Promise<SosEvent[]> {
  const { data, error } = await supabase
    .from('sos_events')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('getLiveSosEvents error:', error.message)
    return []
  }
  return (data ?? []) as SosEvent[]
}

/** Volunteer accepts an SOS request */
export async function acceptSosRequest(
  sosId: string,
  volunteerId: string
): Promise<{ error: string | null }> {
  // 1. Update the SOS event status
  const { error: updateError } = await supabase
    .from('sos_events')
    .update({ status: 'assigned' })
    .eq('id', sosId)

  if (updateError) return { error: updateError.message }

  // 2. Insert the assignment record (this triggers the real-time listener on the victim's app)
  const { error: insertError } = await supabase
    .from('volunteer_assignments')
    .insert({
      sos_id: sosId,
      volunteer_id: volunteerId,
      status: 'accepted',
      accepted_at: new Date().toISOString()
    })

  return { error: insertError ? insertError.message : null }
}
/** Fetch user's SOS history */
export async function getSosHistory(userId: string): Promise<SosEvent[]> {
  const { data, error } = await supabase
    .from('sos_events')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) { console.error('getSosHistory error:', error.message); return [] }
  return (data ?? []) as SosEvent[]
}

/** Fetch a volunteer's assignment history */
export async function getVolunteerHistory(volunteerId: string): Promise<SosEvent[]> {
  const { data, error } = await supabase
    .from('volunteer_assignments')
    .select('..., sos_events(*)')
    .eq('volunteer_id', volunteerId)
    .order('accepted_at', { ascending: false })
    .limit(20)

  if (error) { console.error('getVolunteerHistory error:', error.message); return [] }
  // Extract the nested sos_events
  return data.map((d: any) => d.sos_events).filter(Boolean) as SosEvent[]
}

/** Fetch a single SOS event by ID */
export async function getSosEventById(sosId: string): Promise<SosEvent | null> {
  const { data, error } = await supabase
    .from('sos_events')
    .select('*')
    .eq('id', sosId)
    .single()

  if (error) { console.error('getSosEventById error:', error.message); return null }
  return data as SosEvent
}

// ---------------------------------------------------------------------------
// EMERGENCY CONTACTS API
// ---------------------------------------------------------------------------

export type EmergencyContact = {
  id: string
  name: string
  phone: string
  relation: string | null
  priority: number
}

export async function getEmergencyContacts(userId: string): Promise<EmergencyContact[]> {
  const { data, error } = await supabase
    .from('emergency_contacts')
    .select('*')
    .eq('user_id', userId)
    .order('priority', { ascending: true })

  if (error) { console.error('getContacts error:', error.message); return [] }
  return (data ?? []) as EmergencyContact[]
}

export async function addEmergencyContact(
  userId: string,
  contact: Omit<EmergencyContact, 'id'>
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('emergency_contacts')
    .insert({ user_id: userId, ...contact })

  return { error: error ? error.message : null }
}

export async function deleteEmergencyContact(contactId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('emergency_contacts')
    .delete()
    .eq('id', contactId)

  return { error: error ? error.message : null }
}

// ---------------------------------------------------------------------------
// CONNECTION TEST
// ---------------------------------------------------------------------------

/** Quick connectivity test — call this from the browser console to verify setup */
export async function testSupabaseConnection(): Promise<void> {
  console.log('🔌 Testing Supabase connection...')
  const { data, error } = await supabase.from('profiles').select('count').limit(1)
  if (error) {
    console.error('❌ Connection FAILED:', error.message)
  } else {
    console.log('✅ Supabase connected successfully!', data)
  }
}

// ---------------------------------------------------------------------------
// LIVE GPS TRACKING & REALTIME CHANNELS
// ---------------------------------------------------------------------------

/** Update the volunteer's persistent last_location in the database using PostGIS */
export async function updateVolunteerLocation(
  userId: string,
  lat: number,
  lng: number
): Promise<{ error: string | null }> {
  // Supabase automatically casts WKT (Well-Known Text) strings to geography types
  const pointStr = `POINT(${lng} ${lat})`;

  const { error } = await supabase
    .from('profiles')
    .update({ last_location: pointStr })
    .eq('id', userId);

  return { error: error ? error.message : null };
}

/** 
 * Establish a Realtime Channel broadcast for a specific SOS Event.
 * Call this from the Volunteer's app inside a `setInterval` or location hook
 * to send live updates directly to the victim without hitting the database disk.
 */
export function broadcastLocation(
  sosId: string,
  lat: number,
  lng: number
) {
  const channel = supabase.channel(`sos_channel_${sosId}`);
  channel.send({
    type: 'broadcast',
    event: 'location',
    payload: { lat, lng, timestamp: new Date().toISOString() }
  });
}

/**
 * Subscribe to Live Location broadcasts for a specific SOS Event.
 * Call this from the Victim's app to receive location updates and animate the map marker.
 * @returns The channel instance so the caller can unsubscribe() when the component unmounts.
 */
export function subscribeToLocation(
  sosId: string,
  onLocationUpdate: (payload: { lat: number, lng: number, timestamp: string }) => void
) {
  const channel = supabase.channel(`sos_channel_${sosId}`);
  
  channel
    .on('broadcast', { event: 'location' }, (payload) => {
      onLocationUpdate(payload.payload as any);
    })
    .subscribe();

  return channel;
}



// ---------------------------------------------------------------------------
// FEEDBACK API
// ---------------------------------------------------------------------------

export type FeedbackType = 'idea' | 'issue' | 'other';

/** Submit user feedback — saved to the `feedback` table in Supabase */
export async function submitFeedback(payload: {
  userId: string;
  type: FeedbackType;
  message: string;
}): Promise<{ error: string | null }> {
  // Mock API call for feedback submission
  await new Promise((resolve) => setTimeout(resolve, 800));
  console.log("Feedback submitted:", payload);
  
  return { error: null };
}
