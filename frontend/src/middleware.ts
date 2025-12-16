// middleware.ts
// Protección de rutas - La protección se maneja principalmente en el AuthContext
// Este middleware puede ser usado para futuras implementaciones de protección de rutas

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Por ahora solo dejamos pasar todo
  // La protección real está en AuthContext y en los componentes de nivel superior
  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
