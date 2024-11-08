
import Link from 'next/link';
import { MailIcon, PhoneIcon } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-200 py-8 w-full">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row justify-between">
        {/* About Section */}
        <div className="mb-6 lg:mb-0">
          <h3 className="text-xl font-semibold mb-4">Event Management System</h3>
          <p className="text-gray-400">
            Simplifying event management in Malaysia. Create, register, and manage events with ease.
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-6 lg:mb-0">
          <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
          <ul>
            <li className="mb-2">
              <Link href="/">
                Home
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/features">
                Features
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/how-it-works">
                How It Works
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/events">
                Events
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/about-us">
                About Us
              </Link>
            </li>
            <li className="mb-2">
              <Link href="/contact-us">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div>
          <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
          <div className="flex items-center mb-2">
            <MailIcon className="h-5 w-5 text-blue-600 mr-2" />
            <a href="mailto:contact@eventify.com" className="hover:text-white">
              contact@ems.com
            </a>
          </div>
          <div className="flex items-center mb-2">
            <PhoneIcon className="h-5 w-5 text-blue-600 mr-2" />
            <a href="tel:+60123456789" className="hover:text-white">
              +60 12-345 6789
            </a>
          </div>
          <div className="flex items-center">
            {/* <LocationMarkerIcon className="h-5 w-5 text-blue-600 mr-2" /> */}
            <span>Jalan Sungai Tiram 8, 11900 Bayan Lepas, Penang, Malaysia</span>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 border-t border-gray-700 pt-4 text-center">
        <p className="text-gray-400">&copy; {new Date().getFullYear()} Event Management System. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
