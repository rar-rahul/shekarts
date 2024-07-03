import dynamic from "next/dynamic";
const Verifyotp = dynamic(() => import("~/components/Auth/verifyotp"));

export default function SignUpPage() {
  return <Verifyotp />;
}
