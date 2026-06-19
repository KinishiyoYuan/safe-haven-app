'use client';
import dynamic from 'next/dynamic';

const SignUpForm = dynamic(() => import('@/components/auth/SignUpForm'), { ssr: false });

export default function SignUpClient() {
  return <SignUpForm />;
}
