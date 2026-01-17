"use client";

import { useContext, useState, useEffect } from "react";
import { AuthContext } from "@/context/AuthContext";
import api from "@/lib/axios";
import { GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const { user, fetchUser, loading } = useContext(AuthContext); // we'll rename login → fetchUser
    const [form, setForm] = useState({ email: "", password: "" });
    const router = useRouter();

    // Email / Password login
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post("/auth/login", form); // cookie set by backend
            await fetchUser(); // refresh user state in context
        } catch (err) {
            console.error(err);
        }
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
        <div>
            <h2>Login</h2>

            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Email"
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button type="submit">Login</button>
            </form>

            <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => console.log("Google login failed")}
                width={300}
                theme="outline"
                size="large"
                shape="rectangular"
                logo_alignment="left"
            />
        </div>
    );
}
