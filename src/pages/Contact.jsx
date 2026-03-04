import { useState } from "react";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess(false);
    setErrorMsg("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "https://vertexa-backend-3.onrender.com/"}/api/contact`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(form)
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        setErrorMsg(data.message || "Something went wrong.");
      }
    } catch (error) {
      console.error(error);
      setErrorMsg("Backend not running or connection failed.");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen px-6 py-20 bg-black text-white overflow-hidden">

      
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-purple-600 blur-[140px] opacity-10 rounded-full pointer-events-none"></div>

      <div className="relative z-10 text-center">
        <h1 className="text-4xl font-bold mb-8">Contact Us</h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-xl mx-auto space-y-6"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="w-full p-3 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:border-purple-500"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:border-purple-500"
            required
          />

          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            rows="5"
            className="w-full p-3 bg-gray-900 border border-gray-800 rounded-xl focus:outline-none focus:border-purple-500"
            required
          ></textarea>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:opacity-90 active:scale-95 transition disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>

        {success && (
          <p className="text-green-400 mt-6">
            Message sent successfully 🚀
          </p>
        )}

        {errorMsg && (
          <p className="text-red-400 mt-6">
            {errorMsg}
          </p>
        )}
      </div>
    </div>
  );
}

export default Contact;