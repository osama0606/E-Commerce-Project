import React from "react";
import Footer from "./Footer";
import Header from "./Header";
import { Helmet } from "react-helmet";
import { Toaster } from "react-hot-toast";

const Layout = ({
  children,
  title,
  description,
  keywords,
  author,
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>

      {/* Header (already handles theme + search etc.) */}
      <Header />

      {/* Main Content */}
      <main className="flex-1 min-h-[70vh] relative bg-inherit text-inherit">
        <Toaster />
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

Layout.defaultProps = {
  title: "Desi Deals",
  description: "Best products at Indian prices",
  keywords: "ecommerce, shopping, india",
  author: "Desi Deals",
};

export default Layout;
