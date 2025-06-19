// src/app/(application)/page.tsx
import { redirect } from 'next/navigation';

export default function ApplicationRootRedirectPage() {
  redirect('/dashboard');
  // This component will not render anything as redirect() throws an error that Next.js handles.
  // return null; // Or an empty fragment <> </>; it won't be reached.
}
