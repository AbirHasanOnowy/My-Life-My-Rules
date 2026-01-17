"use client";

import { createContext, useEffect, useState } from "react";
import api from "@/lib/axios";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        try {
            const res = await api.get("/auth/me"); // cookie-based
            setUser(res.data);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const logout = async () => {
        await api.post("/auth/logout");
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{ user, setUser, fetchUser, logout, loading }}
        >
            {children}
        </AuthContext.Provider>
    );
}
