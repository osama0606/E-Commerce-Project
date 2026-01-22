import React from "react";
import Layout from "./../components/Layout/Layout";

const Policy = () => {
  return (
    <Layout title="Privacy Policy - TajSouq">
      <div className="bg-slate-50 dark:bg-slate-900 py-12 transition-colors">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          {/* Header */}
          <header className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-50">
              Privacy Policy
            </h1>
            <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
              Your privacy matters. This page explains how TajSouq handles your data.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Last updated: January 14, 2026
            </p>
          </header>

          {/* Content card */}
          <main className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm space-y-8">
            {/* 1. Introduction */}
            <section className="space-y-2 text-sm md:text-base">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50">
                1. Introduction
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                This Privacy Policy explains how TajSouq collects, uses, and protects your personal
                information when you use our website and services.
              </p>
            </section>

            {/* 2. Information we collect */}
            <section className="space-y-3 text-sm md:text-base">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50">
                2. Information we collect
              </h2>
              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                <p className="font-medium">Information you provide</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>Name, email, phone number, and address</li>
                  <li>Account details and order information</li>
                  <li>Messages you send through forms or support</li>
                </ul>
              </div>
              <div className="space-y-2 text-slate-700 dark:text-slate-300">
                <p className="font-medium">Information collected automatically</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>IP address, device, and browser type</li>
                  <li>Pages visited and actions on the site</li>
                  <li>Cookies and similar technologies</li>
                </ul>
              </div>
            </section>

            {/* 3. How we use your information */}
            <section className="space-y-2 text-sm md:text-base">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50">
                3. How we use your information
              </h2>
              <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                <li>To process orders and payments</li>
                <li>To provide support and respond to queries</li>
                <li>To improve our website and services</li>
                <li>To send important updates about your orders</li>
                <li>To prevent fraud and maintain security</li>
              </ul>
            </section>

            {/* 4. Sharing of data */}
            <section className="space-y-2 text-sm md:text-base">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50">
                4. Sharing your information
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                TajSouq does not sell your personal data. Limited sharing may happen with trusted
                service providers such as payment gateways, shipping partners, or when required by
                law.
              </p>
            </section>

            {/* 5. Cookies */}
            <section className="space-y-2 text-sm md:text-base">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50">
                5. Cookies and tracking
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Cookies help remember your preferences, keep you signed in, and understand how the
                site is used. You can control cookies from your browser settings, but some features
                may not work correctly if they are disabled.
              </p>
            </section>

            {/* 6. Data security */}
            <section className="space-y-2 text-sm md:text-base">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50">
                6. Data security
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                Reasonable technical and organizational measures are used to protect your data.
                However, no online system can be guaranteed 100% secure.
              </p>
            </section>

            {/* 7. Your rights */}
            <section className="space-y-2 text-sm md:text-base">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50">
                7. Your choices and rights
              </h2>
              <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                <li>Request access to your personal data</li>
                <li>Request correction or deletion where applicable</li>
                <li>Opt out of marketing emails at any time</li>
              </ul>
            </section>

            {/* 8. Changes */}
            <section className="space-y-2 text-sm md:text-base">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50">
                8. Changes to this policy
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                This policy may be updated occasionally. When important changes are made, the
                updated date at the top of this page will change.
              </p>
            </section>

            {/* 9. Contact */}
            <section className="space-y-2 text-sm md:text-base">
              <h2 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50">
                9. Contact us
              </h2>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                For any questions about this Privacy Policy, you can contact:
              </p>
              <ul className="space-y-1 text-slate-700 dark:text-slate-300">
                <li>Email: osama060699@gmail.com</li>
                <li>Phone: +91 7841917661</li>
                <li>Address: Marol,Andheri East,Mumbai, Maharashtra, India</li>
              </ul>
            </section>
          </main>
        </div>
      </div>
    </Layout>
  );
};

export default Policy;
