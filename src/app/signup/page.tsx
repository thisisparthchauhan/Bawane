"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { ArrowRight, Lock, Mail, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            // 1. Create Auth User
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Update Auth Profile
            await updateProfile(user, { displayName: name });

            // 3. Create Firestore User Document
            // Default role is "user". Admin role must be set manually in DB for now/testing.
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: name,
                email: email,
                role: "user",
                createdAt: serverTimestamp(),
            });

            // 4. Redirect
            router.push("/dashboard"); // or / if dashboard not ready
        } catch (err: any) {
            console.error("Signup error:", err);
            if (err.code === "auth/email-already-in-use") {
                setError("Email already in use.");
            } else if (err.code === "auth/weak-password") {
                setError("Password should be at least 6 characters.");
            } else {
                setError("Failed to create account. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-md w-full space-y-8 relative z-10 glass-card p-8 border-white/10">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-bold text-white tracking-tight">
                        Create an account
                    </h2>
                    <p className="mt-2 text-sm text-gray-400">
                        Join the elite community of market analysts
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSignup}>
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                            {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <div>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                required
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                icon={<User className="w-4 h-4" />}
                            />
                        </div>
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

                    <Button
                        type="submit"
                        className="w-full"
                        variant="neon"
                        isLoading={isLoading}
                    >
                        Sign up <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <p className="text-gray-400">
                        Already have an account?{" "}
                        <Link href="/login" className="font-medium text-neon-blue hover:text-neon-blue/80 transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
