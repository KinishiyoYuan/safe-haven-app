import { Metadata } from "next";
import dynamic from "next/dynamic";

export const metadata: Metadata = {
  title: "",
  description: "",
};

const SignUpForm = dynamic(() => import("@/components/auth/SignUpForm"), {
  ssr: false,
});

export default function SignUp() {
  return <SignUpForm />;
}