'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignupPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <SignUp path="/signup" routing="path" signInUrl="/login" />
    </div>
  );
}
