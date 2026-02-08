"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/lib/firebase"; // db import needed if we want to check role immediately, but we might rely on AuthContext
import { doc, getDoc } from "firebase/firestore";
import { ArrowRight, Lock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // Determine redirection
            // For immediate redirection based on role, fetch doc.
            // Alternatively, AuthWrapper could handle it, but explicit here is good UX.

            const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));
            let role = "user";
            if (userDoc.exists()) {
                role = userDoc.data().role;
            }

            const adminEmails = ["chauhanparth165@gmail.com", "finsol282@gmail.com"];
            if (role === "admin" || (userCredential.user.email && adminEmails.includes(userCredential.user.email))) {
                router.push("/admin");
            } else {
                router.push("/");
            }

        } catch (err: any) {
            console.error("Login error:", err);
            if (err.code === "auth/invalid-credential" || err.code === "auth/user-not-found" || err.code === "auth/wrong-password") {
                setError("Invalid email or password.");
            } else {
                setError("Failed to login. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-neon-green/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-md w-full space-y-8 relative z-10 glass-card p-8 border-white/10">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-white tracking-tight">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Sign in to access your dashboard
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                required
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icon={<Mail className="w-4 h-4" />}
                            />
                        </div>
                        <div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                required
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icon={<Lock className="w-4 h-4" />}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-700 bg-gray-800 text-neon-blue focus:ring-neon-blue"
                            />
                            <label htmlFor="remember-me" className="ml-2 block text-gray-400">
                                Remember me
                            </label>
                        </div>
                        <Link href="#" className="font-medium text-neon-blue hover:text-neon-blue/80">
                            Forgot password?
                        </Link>
                    </div>

                    <Button
                        type="submit"
                        className="w-full"
                        variant="neon"
                        isLoading={isLoading}
                    >
                        Sign in <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <p className="text-gray-400">
                        Don't have an account?{" "}
                        <Link href="/signup" className="font-medium text-neon-blue hover:text-neon-blue/80 transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
