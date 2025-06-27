'use client';

import { SignIn } from '@clerk/nextjs';

export default function LoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <SignIn path="/login" routing="path" signUpUrl="/signup" />
    </div>
  );
}
