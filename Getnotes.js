import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )

  const {
    data: { user }
  } = await supabase.auth.getUser()

  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false })

  if (error) return new Response(JSON.stringify({ error }), { status: 400 })

  return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
})
