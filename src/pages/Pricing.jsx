import { useNavigate } from "react-router-dom";

function Pricing() {
  const navigate = useNavigate();

  const handlePlanSelect = async (plan) => {
  if (plan === "enterprise") {
    navigate("/contact");
    return;
  }

  try {
    const response = await fetch(
      "https://vertexa-backend-3.onrender.com/api/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      }
    );

    const data = await response.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert("Something went wrong.");
    }

  } catch (error) {
    console.error(error);
    alert("Backend not running.");
  }
};
  return (
    <section className="relative min-h-screen py-20 px-6 bg-black text-white overflow-hidden">

      
      <div className="absolute -top-20 left-0 w-[400px] h-[400px] bg-purple-600 blur-[140px] opacity-10 rounded-full pointer-events-none"></div>

      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-bold mb-12">Simple Pricing</h1>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          
          <div className="p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:scale-105 transition duration-300">
            <h2 className="text-2xl font-semibold mb-4">Starter</h2>
            <p className="text-4xl font-bold mb-6">$29/mo</p>
            <ul className="text-gray-400 space-y-2 mb-6">
              <li>✔ 1 AI Voice Agent</li>
              <li>✔ 1,000 Calls</li>
              <li>✔ Email Support</li>
            </ul>
            <button
              onClick={() => handlePlanSelect("starter")}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition"
            >
              Choose Plan
            </button>
          </div>

          
          <div className="p-8 rounded-2xl bg-gray-900 border-2 border-purple-600 scale-105 shadow-xl shadow-purple-500/20">
            <h2 className="text-2xl font-semibold mb-4">Pro</h2>
            <p className="text-4xl font-bold mb-6">$99/mo</p>
            <ul className="text-gray-400 space-y-2 mb-6">
              <li>✔ 5 AI Voice Agents</li>
              <li>✔ 10,000 Calls</li>
              <li>✔ Priority Support</li>
            </ul>
            <button
              onClick={() => handlePlanSelect("pro")}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition"
            >
              Choose Plan
            </button>
          </div>

          
          <div className="p-8 rounded-2xl bg-gray-900 border border-gray-800 hover:scale-105 transition duration-300">
            <h2 className="text-2xl font-semibold mb-4">Enterprise</h2>
            <p className="text-4xl font-bold mb-6">Custom</p>
            <ul className="text-gray-400 space-y-2 mb-6">
              <li>✔ Unlimited Agents</li>
              <li>✔ Unlimited Calls</li>
              <li>✔ Dedicated Manager</li>
            </ul>
            <button
              onClick={() => handlePlanSelect("enterprise")}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition"
            >
              Contact Sales
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Pricing;