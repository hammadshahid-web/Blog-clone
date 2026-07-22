import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyRefreshToken, signAccessToken, signRefreshToken } from '@/lib/jwt';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const refreshToken = cookieStore.get('refreshToken')?.value;

    if (!refreshToken) {
      return NextResponse.json({ message: 'Refresh token missing' }, { status: 401 });
    }

    const payload = await verifyRefreshToken(refreshToken);
    if (!payload) {
      return NextResponse.json({ message: 'Invalid or expired refresh token' }, { status: 401 });
    }

    const user = { userId: payload.userId, email: payload.email, role: payload.role };

    // Generate New Tokens (Token Rotation)
    const newAccessToken = await signAccessToken(user);
    const newRefreshToken = await signRefreshToken(user);

    const response = NextResponse.json({
      user,
      accessToken: newAccessToken,
    });

    // Rotate Refresh Token
    response.cookies.set('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ message: 'Failed to refresh token' }, { status: 500 });
  }
}