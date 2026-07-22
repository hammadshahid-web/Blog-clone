// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Mock User Creation (Replace with DB insert in real app)
    const newUser = {
      id: `usr_${Date.now()}`,
      name,
      email,
      role: 'author',
    };

    const accessToken = 'mock_access_token_' + Date.now();
    const refreshToken = 'mock_refresh_token_' + Date.now();

    const response = NextResponse.json({
      user: newUser,
      accessToken,
      message: 'Account created successfully',
    });

    // Set HttpOnly Refresh Token Cookie
    response.cookies.set('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: 'Registration failed. Please try again.' },
      { status: 500 }
    );
  }
}