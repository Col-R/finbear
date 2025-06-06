import {signIn} from '@/app/auth/actions'

export default function LoginPage() {
    return (
        <form action={signIn}>
            <input name="email" type="email" placeholder="Email" required />
            <input name="password" type="password" placeholder="Password" required />
            <button type="submit">Log In</button>
            <p>You should be able to see this without authentication</p>
        </form>
    )
}