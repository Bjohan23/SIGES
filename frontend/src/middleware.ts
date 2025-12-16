// middleware.ts
// Protección de rutas desactivada - La protección se maneja en el AuthContext
// El middleware de Next.js 16 tiene problemas con Supabase cookies

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Por ahora solo dejamos pasar todo
  // La protección real está en AuthContext y en los componentes
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
