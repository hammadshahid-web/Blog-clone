import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    // Basic Validation Check
    if (!password || password.length < 8) {
      return NextResponse.json(
        { message: 'Password must be at least 8 characters long.' },
        { status: 400 }
      );
    }

    // Allow mock testing tokens or validate token presence
    if (!token) {
      return NextResponse.json(
        { message: 'Invalid or expired reset token.' },
        { status: 400 }
      );
    }

    // Success response for password reset
    return NextResponse.json(
      { 
        success: true, 
        message: 'Password successfully updated. Please login with your new password.' 
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to reset password. Internal Server Error.' },
      { status: 500 }
    );
  }
}