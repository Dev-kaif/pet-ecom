// src/lib/auth.ts
import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import { AuthenticatedUser } from '@/types';

const JWT_SECRET= process.env.NEXTAUTH_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('Please define the NEXTAUTH_SECRET environment variable inside .env.local');
}

/**
 * Verifies authentication and authorization for API routes.
 * @param request The NextRequest object.
 * @param requiredRole The role required for the operation (e.g., 'admin', 'user', or null if just authenticated).
 * @returns An object containing `user` if authenticated/authorized, or `response` if an error occurred.
 */
export async function authenticateAndAuthorize(
  request: NextRequest,
  requiredRole: 'admin' | 'user' | null = null
): Promise<{ user?: AuthenticatedUser; response?: NextResponse }> {
  const token = await getToken({ req: request, secret: JWT_SECRET });

  if (!token) {
    return { response: NextResponse.json({ success: false, message: 'Not authenticated. Please log in.' }, { status: 401 }) };
  }

  const user: AuthenticatedUser = {
    id: token.sub as string,
    email: token.email as string,
    name: token.name as string | undefined,
    role: (token.role || 'user') as 'user' | 'admin', // Default to 'user' if role not explicitly set in token
  };

  // Check Role (Authorization)
  if (requiredRole && user.role !== requiredRole) {
    return { response: NextResponse.json({ success: false, message: `Forbidden. Requires "${requiredRole}" role.` }, { status: 403 }) };
  }

  return { user };
}