import { Metadata } from "next";
import SignUpClient from "./SignUpClient";

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default function SignUp() {
  return <SignUpClient />;
}