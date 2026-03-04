import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";

const FreeTrial = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [business, setBusiness] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  
  useEffect(() => {
    if (auth.currentUser) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      await fetch("https://vertexa-backend-3.onrender.com/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    name: business,
    email: email,
    password: password
  })
});

      
      navigate("/dashboard");

    } catch (err) {
      setError("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="bg-gray-900 p-10 rounded-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Sign Up
        </h2>

        <form onSubmit={handleSignup} className="space-y-4">

          <input
            type="text"
            placeholder="Business Name"
            value={business}
            onChange={(e) => setBusiness(e.target.value)}
            className="w-full p-3 rounded-lg bg-black border border-gray-700"
            required
          />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-lg bg-black border border-gray-700"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-lg bg-black border border-gray-700"
            required
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 py-3 rounded-lg font-semibold"
          >
            Create Account
          </button>

          <p className="text-sm text-gray-400 mt-4 text-center">
            Already have an account?{" "}
            <Link to="/login" className="text-purple-500 hover:underline">
              Sign In
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default FreeTrial;