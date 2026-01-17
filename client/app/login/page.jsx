"use client";

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/lib/axios";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Lottie from 'lottie-react';
import lottieData from '../../public/Login_Lottie.json';

export default function LoginPage() {
    const { user, fetchUser, loading } = useContext(AuthContext); // we'll rename login → fetchUser
    // const [form, setForm] = useState({ email: "", password: "" });
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    // Email / Password login
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post("/auth/login", { email, password }); // cookie set by backend
            await fetchUser(); // refresh user state in context
        } catch (err) {
            console.error(err);
        }
    };

    const signupPage = () => {
        router.push("/register");
    };
    // Google login
    const handleGoogleSuccess = async (cred) => {
        try {
            if (!cred || !cred.credential) {
                console.error("Google credential missing");
                return;
            }
            await api.post("/auth/google", { credential: cred.credential }); // cookie set
            const fetchuser = await fetchUser(); // update context
            if (fetchuser) router.push("/");
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
        <div className="w-screen h-screen flex items-center justify-center relative bg-cover bg-center"
            style={{ backgroundImage: "url('/blue_lake.jpg')" }}>

            {/* Blurry overlay */}
            <div className="absolute inset-0 backdrop-blur-xs bg-black/20"></div>

            {/* Main container */}
            <div className="relative w-4/5 max-w-5xl h-120 flex rounded-2xl overflow-hidden shadow-2xl border border-gray-200/30 bg-transparent">

                {/* Left side - Lottie */}
                <div className="flex-1 flex items-center justify-center bg-gray-100/30 p-5">
                    <Lottie animationData={lottieData} loop={true} className="w-full h-full" />
                </div>

                {/* Right side - Form */}
                <div className="flex-1 flex flex-col justify-center p-12">
                    <h2 className="text-3xl font-semibold mb-2 text-black">Welcome Back!</h2>
                    <p className="text-gray-900 mb-8">Login to continue</p>

                    <input
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-4 px-4 py-3 bg-white/30 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-6 px-4 py-3 bg-white/30 text-black rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />

                    <button className="w-full mb-4 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition" onClick={handleSubmit}
                        disabled={loading}>
                        Login
                    </button>

                    <div className="flex gap-4">
                        <div className="flex-1 py-0 border border-gray-300 bg-white text-black rounded-lg hover:bg-gray-50 transition">
                            <GoogleLogin className="h-full hover:bg-amber-50" onSuccess={handleGoogleSuccess} />
                        </div>
                        <button className="flex-1 py-1.5 min-w-40 bg-gray-600 rounded-lg hover:bg-gray-900 transition"
                            onClick={signupPage}>
                            Sign Up
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
