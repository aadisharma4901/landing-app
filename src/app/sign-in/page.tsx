import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';

export default async function Page() {
  const { userId } = await auth();

  if (userId) {
    redirect('/');
  }

  const signInUrl = process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL 
    || 'https://one-yak-34.accounts.dev/sign-in?redirect_url=http%3A%2F%2Flocalhost%3A3000%2F';

  redirect(signInUrl);
}
