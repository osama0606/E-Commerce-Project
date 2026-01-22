import React, { useState } from "react";
import Layout from "../components/Layout/Layout";
import toast from "react-hot-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      toast.success("Message sent successfully! We'll contact you soon.");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <Layout title="Contact Us - TajSouq">
      <div className="bg-slate-50 dark:bg-slate-900 transition-colors">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 py-12">
          <div className="text-center space-y-3">
            <p className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300">
              Contact us
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">
              We’d love to hear from you
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Questions, feedback, or support requests — send a message and the team will get back to you.
            </p>
          </div>
        </section>

        {/* Content: form + info */}
        <section className="max-w-5xl mx-auto px-4 pb-16">
          <div className="grid gap-10 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
            {/* Form */}
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-4">
                Send a message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Full name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Email address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Write your message..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full inline-flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send message"}
                </button>

                <p className="text-[11px] text-center text-slate-500 dark:text-slate-500">
                  * Required fields
                </p>
              </form>
            </div>

            {/* Info */}
            <div className="space-y-6 text-sm">
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-3">
                  Contact details
                </h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-400">
                  <li>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      Email:
                    </span>{" "}
                    support@ecommerce.com
                  </li>
                  <li>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      Phone:
                    </span>{" "}
                    +91 800-123-4567
                  </li>
                  <li>
                    <span className="font-medium text-slate-800 dark:text-slate-200">
                      Location:
                    </span>{" "}
                    Thane, Maharashtra, India
                  </li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-3">
                  Business hours
                </h3>
                <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                  <li>Mon – Fri: 9:00 AM – 6:00 PM</li>
                  <li>Sat: 10:00 AM – 4:00 PM</li>
                  <li>Sun: Closed</li>
                </ul>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-5">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-50 mb-3">
                  Social
                </h3>
                <div className="flex items-center gap-4 text-xl">
                  <button className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
                    📘
                  </button>
                  <button className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors">
                    🐦
                  </button>
                  <button className="hover:text-pink-500 dark:hover:text-pink-400 transition-colors">
                    📷
                  </button>
                  <button className="hover:text-slate-500 dark:hover:text-slate-300 transition-colors">
                    💼
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contact;
