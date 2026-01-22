import React from "react";
import Layout from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();

  return (
    <Layout title="About Us - TajSouq">
      <div className="bg-slate-50 dark:bg-slate-900 transition-colors">
        {/* Hero */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-center space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">
              About TajSouq
            </h1>
            <p className="text-sm font-medium inline-block px-3 py-1 rounded-full bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-300">
              Premium online shopping experience
            </p>
            <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              TajSouq brings carefully selected products, secure payments, and a smooth shopping
              journey together in one place.
            </p>
          </div>
        </section>

        {/* Mission / Values */}
        <section className="max-w-5xl mx-auto px-4 pb-16 grid gap-8 md:grid-cols-2">
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">
              Our Mission
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              To make quality products easily accessible with transparent pricing and a reliable
              shopping experience.
            </p>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>• Curated, useful products</li>
              <li>• Simple and secure checkout</li>
              <li>• Focus on long‑term customer trust</li>
            </ul>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-50 mb-3">
              What You Get
            </h2>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              <li>• Secure online payments and protected data</li>
              <li>• Clear product information and pricing</li>
              <li>• Support that actually responds and helps</li>
            </ul>
          </div>
        </section>

        {/* Why choose us (simple cards) */}
        <section className="bg-slate-100 dark:bg-slate-950/40 py-12 transition-colors">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-semibold text-center text-slate-900 dark:text-slate-50 mb-8">
              Why shop with us?
            </h2>
            <div className="grid gap-6 md:grid-cols-3 text-sm">
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 text-center">
                <p className="font-medium text-slate-900 dark:text-slate-50 mb-2">
                  Reliable delivery
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Orders shipped with tracking and clear timelines.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 text-center">
                <p className="font-medium text-slate-900 dark:text-slate-50 mb-2">
                  Secure payments
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Encrypted transactions and trusted payment gateways.
                </p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-5 text-center">
                <p className="font-medium text-slate-900 dark:text-slate-50 mb-2">
                  Helpful support
                </p>
                <p className="text-slate-600 dark:text-slate-400">
                  Assistance before and after your purchase.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-5xl mx-auto px-4 py-16">
          <div className="rounded-xl bg-blue-600 dark:bg-slate-800 text-white px-6 py-10 text-center border border-blue-700 dark:border-slate-700">
            <h2 className="text-2xl font-semibold mb-3">Ready to explore products?</h2>
            <p className="text-sm md:text-base text-blue-100 dark:text-slate-200 mb-6 max-w-xl mx-auto">
              Browse categories, discover new items, and enjoy a smooth shopping flow on TajSouq.
            </p>
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg text-sm font-semibold bg-white dark:bg-slate-200 text-blue-600 dark:text-slate-900 hover:bg-slate-100 dark:hover:bg-slate-300 transition-colors"
            >
              Go to Home
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default About;
