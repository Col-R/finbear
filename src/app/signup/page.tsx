import { signUp } from "@/app/auth/actions";

export default function SignupPage() {
  return (
    <form action={signUp}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
  )
}