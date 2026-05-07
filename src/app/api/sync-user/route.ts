import { currentUser } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabase-server';

export async function POST() {
  const user = await currentUser();

  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  const { error } = await supabaseServer
    .from('users')
    .upsert(
      {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? null,
        first_name: user.firstName,
        last_name: user.lastName,
        image_url: user.imageUrl,
      },
      {
        onConflict: 'id',
      }
    );

  if (error) {
    console.error('Error syncing user:', error);

    return NextResponse.json(
      { error },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
