package com.example.resqnet.data

import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.realtime.Realtime

object SupabaseClient {
    val client = createSupabaseClient(
        supabaseUrl = "https://ziutypjgzzayeqwkdnco.supabase.co",
        supabaseKey = "sb_publishable_23qyxTDgqsbRpC7-JaA3DQ_4HtpSNy1"
    ) {
        install(Auth)
        install(Postgrest)
        install(Realtime)
    }
}
