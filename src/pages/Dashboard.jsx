import React, { useState, useEffect } from "react";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [user,setUser] = useState(null);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);
  const [credits, setCredits] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((currentUser) => {
    setUser(currentUser);
  });

  return () => unsubscribe();
}, []);

  
  useEffect(() => {
    const fetchCredits = async () => {
      if (!user) return;

      const res = await fetch("https://vertexa-backend-3.onrender.com/api/users/credits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: user.email })
      });

      const data = await res.json();
      if (res.ok) {
        setCredits(data.credits);
      }
    };

    fetchCredits();
  }, [user]);

  const handleAsk = async () => {
    if (!input) return;
    setError("");

    if (credits <= 0) {
      setError("Out of credits. Credits will reset after 7 days.");
      return;
    }

    const res = await fetch("http://localhost:5000/api/ask-ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        question: input
      })
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message);
      return;
    }

    setCredits(data.creditsLeft);
    setResponse(data.answer);
    setHistory([{ question: input, answer: data.answer }, ...history]);
    setInput("");
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  const quickPrompts = [
    "Generate a 30-day marketing plan",
    "Create a SWOT analysis",
    "Suggest pricing strategy",
    "How can I increase sales?"
  ];

  return (
    <div className="min-h-screen bg-black text-white p-8">

      
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold">
          Welcome back 👋
        </h1>

        <div className="flex items-center gap-6">
          <span className="text-gray-400 text-sm">
            {user?.email}
          </span>

          
          <span className="bg-purple-700 px-3 py-1 rounded-full text-sm">
            Credits: {credits}
          </span>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded-lg"
          >
            Logout
          </button>
        </div>
      </div>

      
      <div className="bg-gray-900 p-6 rounded-xl mb-10">
        <h2 className="text-xl font-semibold mb-4">
          Ask Vertexa (AI Business Guide)
        </h2>

        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about marketing, pricing, growth..."
          className="w-full p-3 rounded-lg bg-black border border-gray-700 mb-4"
          rows="3"
        />

        <button
          onClick={handleAsk}
          disabled={credits <= 0}
          className={`px-6 py-2 rounded-lg ${
            credits <= 0
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-600 to-pink-600"
          }`}
        >
          Ask AI
        </button>

        {error && (
          <p className="text-red-500 mt-4">{error}</p>
        )}

        {response && (
          <div className="mt-6 bg-black p-4 rounded-lg border border-gray-700">
            <p className="text-gray-300">{response}</p>
          </div>
        )}
      </div>

      
      <div className="grid md:grid-cols-4 gap-6 mb-10">
        {quickPrompts.map((prompt, index) => (
          <div
            key={index}
            onClick={() => setInput(prompt)}
            className="bg-gray-900 p-4 rounded-xl cursor-pointer hover:bg-gray-800 transition"
          >
            <p>{prompt}</p>
          </div>
        ))}
      </div>

      
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Recent Queries
        </h2>

        {history.length === 0 && (
          <p className="text-gray-500">No queries yet.</p>
        )}

        {history.map((item, index) => (
          <div
            key={index}
            className="bg-gray-900 p-4 rounded-xl mb-4"
          >
            <p className="font-semibold">Q: {item.question}</p>
            <p className="text-gray-400 mt-2">
              A: {item.answer}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;