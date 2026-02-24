import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
      <section className="container mx-auto flex flex-col items-center justify-center px-4 py-24 text-center md:py-32 lg:py-40">
        <div className="mb-8 inline-flex items-center rounded-full border bg-muted px-3 py-1 text-sm font-medium text-muted-foreground shadow-sm">
          <span>🐻 Making finance bearable since 2025</span>
        </div>
        
        <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
          Track Your Investments <br className="hidden sm:inline" />
          with <span className="text-primary">Confidence</span>
        </h1>
        
        <p className="mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl md:text-2xl">
          Finbear gives you the clarity you need to manage your portfolio without the noise. 
          Simple, secure, and built for the modern investor.
        </p>
        
        <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:gap-6">
          <Button asChild size="lg" className="h-12 px-8 text-base font-semibold shadow-lg transition-all hover:scale-105 active:scale-95">
            <Link href="/signup">Get Started Free</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8 text-base font-medium shadow-sm transition-all hover:bg-muted active:scale-95">
            <Link href="/login">Log In</Link>
          </Button>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need to grow
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Powerful tools wrapped in a friendly interface.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="border-muted bg-card/50 transition-colors hover:bg-card">
            <CardHeader>
              <span className="text-4xl mb-2">📊</span>
              <CardTitle>Portfolio Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Manage multiple portfolios and track all your positions in one unified dashboard.
              </p>
            </CardContent>
          </Card>

          <Card className="border-muted bg-card/50 transition-colors hover:bg-card">
            <CardHeader>
              <span className="text-4xl mb-2">⚡</span>
              <CardTitle>Live Market Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Real-time price updates powered by Polygon.io ensure you never miss a beat.
              </p>
            </CardContent>
          </Card>

          <Card className="border-muted bg-card/50 transition-colors hover:bg-card">
            <CardHeader>
              <span className="text-4xl mb-2">📈</span>
              <CardTitle>Smart Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Instant gain/loss calculations and performance metrics at a glance.
              </p>
            </CardContent>
          </Card>

          <Card className="border-muted bg-card/50 transition-colors hover:bg-card">
            <CardHeader>
              <span className="text-4xl mb-2">🛡️</span>
              <CardTitle>Bank-Grade Security</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Your financial data is protected with enterprise-level encryption and Supabase Auth.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="border-t bg-muted/30">
        <div className="container mx-auto flex flex-col items-center justify-center gap-6 px-4 py-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Ready to tame the market?
          </h2>
          <p className="max-w-[600px] text-lg text-muted-foreground">
            Join thousands of investors who trust Finbear to keep their portfolios on track.
            No credit card required to start.
          </p>
          <Button asChild size="lg" className="mt-4 h-12 px-8 text-base font-semibold shadow-lg transition-all hover:scale-105">
            <Link href="/signup">Create Free Account</Link>
          </Button>
        </div>
      </section>

      <footer className="border-t bg-background py-12">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 text-center md:flex-row md:text-left">
          <p className="text-sm text-muted-foreground">
            © 2025 Finbear. Making finance bearable. 🐻
          </p>
          <div className="flex gap-6 text-sm font-medium text-muted-foreground">
            <Link href="#" className="hover:text-foreground hover:underline underline-offset-4">Privacy</Link>
            <Link href="#" className="hover:text-foreground hover:underline underline-offset-4">Terms</Link>
            <Link href="#" className="hover:text-foreground hover:underline underline-offset-4">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
