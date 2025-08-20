import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    supabaseUrl: process.env['NEXT_PUBLIC_SUPABASE_URL'] || null,
    supabaseAnonKey: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'] || null,
    resendApiKey: process.env['RESEND_API_KEY'] ? 'Set' : null,
    emailFrom: process.env['EMAIL_FROM'] || null,
  });
}
