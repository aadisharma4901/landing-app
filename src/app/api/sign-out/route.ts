import { auth } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Note: With Clerk, signing out is typically handled by the frontend
    // or by clearing the session. We'll return success and let the frontend handle redirect.
    // However, since we're using a form action, we'll redirect on the frontend after successful response.
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
}