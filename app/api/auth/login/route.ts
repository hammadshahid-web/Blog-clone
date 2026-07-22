import { NextResponse } from 'next/server';
import { signAccessToken, signRefreshToken } from '@/lib/jwt';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    // 💡 Replace with real DB validation (e.g. Prisma / Drizzle)
    if (email !== 'ali@devpulse.com' || password !== 'Password123!') {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const user = { userId: 'usr_101', email, role: 'author' };

    const accessToken = await signAccessToken(user);
    const refreshToken = await signRefreshToken(user);

    const response = NextResponse.json({
      user,
      accessToken,
    });

    // Set Refresh Token in HTTP-Only Cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}