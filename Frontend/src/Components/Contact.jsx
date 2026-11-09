import { useState } from "react";
import { Mail, Phone, Send } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  function handleSubmit(e) {
    e.preventDefault();
    console.log(form);
    alert("Your message has been submitted!");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-800">
          Contact Us
        </h1>
        <p className="mt-2 text-gray-500">
          Have a question or need help? Get in touch with the SOLVI team.
        </p>

        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <div className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              Get in touch
            </h2>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-100 p-3 text-violet-600">
                <Mail size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">Email</p>
                <p className="text-sm text-gray-500">
                  hello@solvi.ai
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-violet-100 p-3 text-violet-600">
                <Phone size={20} />
              </div>
              <div>
                <p className="font-medium text-gray-800">Support</p>
                <p className="text-sm text-gray-500">
                  We're here to help you.
                </p>
              </div>
            </div>

            <div className="rounded-xl bg-violet-50 p-4">
              <h3 className="font-semibold text-violet-800">
                We're listening!
              </h3>
              <p className="mt-1 text-sm text-violet-700">
                Share your questions, suggestions, or feedback to help us
                improve your SOLVI experience.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-2xl bg-white p-6 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              Send a message
            </h2>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Your Name
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Enter your name"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Message
              </label>
              <textarea
                required
                rows="4"
                value={form.message}
                onChange={(e) =>
                  setForm({ ...form, message: e.target.value })
                }
                placeholder="Write your message..."
                className="w-full resize-none rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
              />
            </div>

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-5 py-3 font-medium text-white transition hover:bg-violet-700"
            >
              <Send size={18} />
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
