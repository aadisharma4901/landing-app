import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get current user data via clerkClient
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
        email: user.emailAddresses[0]?.emailAddress,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch profile',
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { firstName, lastName } = body;

    // Get clerk client and update user
    const client = await clerkClient();
    const updatedUser = await client.users.updateUser(userId, {
      firstName,
      lastName,
    });

    return NextResponse.json({
      success: true,
      user: {
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        imageUrl: updatedUser.imageUrl,
        email: updatedUser.emailAddresses[0]?.emailAddress,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      {
        error: 'Failed to update profile',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
