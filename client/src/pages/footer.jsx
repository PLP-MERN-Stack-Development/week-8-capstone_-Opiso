import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const appName = "Pisto Wellpoint";

  return (
    <footer className="bg-green-900 text-white mt-12">
      <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-3 gap-8">
        {/* Brand / About */}
        <div>
          <h2 className="text-xl font-bold mb-3">{appName}</h2>
          <p className="text-sm">
            Connecting patients with verified doctors. Trusted healthcare at
            your fingertips.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/about" className="hover:underline">
                About
              </Link>
            </li>
            <li>
              <Link to="/contactAdmin" className="hover:underline">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/doctors" className="hover:underline">
                Find a Doctor
              </Link>
            </li>
            <li>
              <Link to="/login" className="hover:underline">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="hover:underline">
                Register
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p className="text-sm">Email: support@pistowellpoint.com</p>
          <p className="text-sm">Phone: +254 712 345 678</p>
          <p className="text-sm">Location: Nairobi, Kenya</p>
        </div>
      </div>
      <div className="text-center text-sm bg-green-800 py-4">
        &copy; {new Date().getFullYear()} {appName}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
