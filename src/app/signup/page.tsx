import registerUser from "@/components/auth/RegisterUser";
import SignupForm   from "@/components/auth/SignupForm";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-muted">
      <SignupForm action={registerUser} />
    </div>
  );
}
