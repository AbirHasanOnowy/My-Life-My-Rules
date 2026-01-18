"use client";

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/lib/axios";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Lottie from "lottie-react";
import lottieData from "../../public/signup_lottie.json"; // you can swap later

export default function SignupPage() {
    const { user, fetchUser, loading } = useContext(AuthContext);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const router = useRouter();

    // Email / Password signup
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !confirmPassword) {
            alert("Please provide all information");
            return;
        }

        if (password.length < 6) {
            alert("Passwords must have minimum 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        try {
            await api.post("/auth/register", { name, email, password }, {
                withCredentials: true,
            });
            await fetchUser();
            router.push("/");
        } catch (err) {
            if (err.response?.status === 409) {
                alert("User already exists. Please log in.");
            } else {
                alert(err);
            }
        }

    };

    // Google signup (same endpoint usually)
    const handleGoogleSuccess = async (cred) => {
        try {
            if (!cred?.credential) return;

            await api.post("/auth/google", { credential: cred.credential });
            await fetchUser();
            router.push("/");
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!loading && user) {
            router.push("/");
        }
    }, [user, loading, router]);

    if (loading) return null;

    return (
        <div
            className="w-screen h-screen flex items-center justify-center relative bg-cover bg-center"
            style={{ backgroundImage: "url('/snow_mountain.jpg')" }}
        >
            {/* Blurry overlay */}
            <div className="absolute inset-0 backdrop-blur-xs bg-black/20"></div>

            {/* Main container */}
            <div className="relative z-10 w-4/5 max-w-5xl h-140 flex rounded-2xl overflow-hidden shadow-2xl border border-gray-200/30 bg-transparent">

                {/* Left side - Lottie */}
                <div className="flex-1 flex items-center justify-center bg-gray-100/30 p-5">
                    <Lottie animationData={lottieData} loop className="w-full h-full" />
                </div>

                {/* Right side - Form */}
                <div className="flex-1 flex flex-col justify-center p-12">
                    <h2 className="text-3xl font-semibold mb-2 text-black">
                        My Life, My Rules
                    </h2>
                    <p className="text-gray-900 mb-8">
                        Sign up to get started
                    </p>

                    <input
                        type="name"
                        placeholder="User Name"
                        value={name}
                        required
                        onChange={(e) => setName(e.target.value)}
                        className="w-full mb-4 px-4 py-3 bg-white/30 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        required
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-4 px-4 py-3 bg-white/30 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        required
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 px-4 py-3 bg-white/30 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        required
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full mb-6 px-4 py-3 bg-white/30 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <button
                        className="w-full mb-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        Sign Up
                    </button>

                    <div className="flex gap-4">
                        <div className="flex-1 border border-gray-300 bg-white text-black rounded-lg hover:bg-gray-50 transition">
                            <GoogleLogin onSuccess={handleGoogleSuccess} text="Signup" />
                        </div>

                        <button
                            onClick={() => router.push("/login")}
                            className="flex-1 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-900 transition"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
