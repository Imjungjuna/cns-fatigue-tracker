"use client";

import { useState } from "react";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { signup } from "../actions";
import Link from "next/link";

const passwordRequirements = [
  { label: "At least 7 characters", test: (v: string) => v.length >= 7 },
  { label: "Lowercase letter", test: (v: string) => /[a-z]/.test(v) },
  { label: "Uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "Number", test: (v: string) => /\d/.test(v) },
] as const;

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const getStrength = (value: string): number => {
    if (!value) return 0;
    return passwordRequirements.filter((req) => req.test(value)).length * 25;
  };

  const strength = getStrength(password);
  const strengthLabel =
    strength <= 25 ? "Weak" : strength <= 50 ? "Medium" : strength <= 75 ? "Strong" : "Very Strong";

  const strengthColor =
    strength <= 25
      ? "bg-red-500"
      : strength <= 50
      ? "bg-yellow-500"
      : strength <= 75
      ? "bg-blue-500"
      : "bg-green-600";


  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-background via-background to-muted p-4">
      <Card className="w-full max-w-lg border-0 shadow-none bg-transparent">
        <CardHeader className="text-center mb-6">
          
          <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
          <CardDescription>
            Enter your credentials to activate your account
          </CardDescription>
        </CardHeader>

        <form action={signup}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 h-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>

              {password && (
                <div className="space-y-2 pt-2">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full transition-all duration-300",
                        strengthColor
                      )}
                      style={{ width: `${strength}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Strength: <span className="font-medium">{strengthLabel}</span>
                  </p>
                </div>
              )}

              <div className="space-y-1.5 text-sm text-muted-foreground pt-2">
                {passwordRequirements.map(({ label, test }) => (
                  <div key={label} className="flex items-center gap-2">
                    {test(password) ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5" />
                    )}
                    <span>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full h-11 font-medium">
              Sign Up
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link
                href="/login"
                className="text-primary hover:underline font-medium"
              >
                Sign in
              </Link>
            </div>

            <div className="text-xs text-center text-muted-foreground pt-2">
              By continuing, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">
                Privacy Policy
              </a>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}