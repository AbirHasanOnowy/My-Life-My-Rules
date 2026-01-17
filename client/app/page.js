"use client";

import { useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <ProtectedRoute>
      <div>
        <h1>Welcome {user?.email}</h1>
        <button onClick={logout}>Logout</button>
      </div>
    </ProtectedRoute>
  );
}
