// Configuración de Supabase Maestro - Super Admin
// URL: https://zljiovululoptycgigyc.supabase.co
const SUPABASE_URL = 'https://zljiovululoptycgigyc.supabase.co';

// NOTA DE SEGURIDAD: 
// Para el Panel SuperAdmin (que es solo de uso personal), estamos usando la "anon key" en el frontend 
// junto asumiendo una autenticación. Como se pidieron credenciales provistas, esta es la llave pública:
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsamlvdnVsdWxvcHR5Y2dpZ3ljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MTYyMDEsImV4cCI6MjA4ODM5MjIwMX0.Kt49YOpCgpgWeTvPwTM_F6TWOJHAogh8xtWwJMZgWRU';

// Instanciar cliente Supabase Maestro
const supabaseMaster = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
