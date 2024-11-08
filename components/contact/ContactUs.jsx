// components/contact/ContactUs.jsx
"use client"
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { MailIcon, PhoneIcon } from 'lucide-react';
import { motion } from 'framer-motion';


const ContactUs = () => {
  return (
    <section className="relative overflow-hidden py-20 bg-gradient-to-r from-white to-blue-50">
      <div className="container mx-auto px-4">

        <div className="absolute inset-0 overflow-hidden">
          <svg
            className="w-full h-full opacity-10"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 800 600"
          >
            <g fill="none" stroke="#ddd" strokeWidth="0.5">
              <circle cx="400" cy="300" r="80" />
              <circle cx="400" cy="300" r="120" />
              <circle cx="400" cy="300" r="160" />
              <circle cx="400" cy="300" r="200" />
            </g>
          </svg>
        </div>

  
        <div className="relative z-10 text-center">
          <Badge className="text-lg bg-opacity-75">
            Contact Us
          </Badge>
          <h2 className="text-5xl font-extrabold mt-6 text-gray-900">
            We'd Love to Hear from You
          </h2>
          <p className="text-xl text-gray-700 mt-4 max-w-3xl mx-auto">
            Whether you have questions, feedback, or want to discuss partnership opportunities, our team is here to assist you.
          </p>
        </div>


        <div className="relative z-10 mt-16 grid grid-cols-1 md:grid-cols-1 gap-12">

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-white bg-opacity-80 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg"
          >
            <h3 className="text-2xl font-bold mb-6 text-blue-600">Get in Touch</h3>
            <div className="space-y-6">
              <div className="flex items-center">
                <MailIcon className="h-6 w-6 text-blue-600 mr-3" />
                <a href="mailto:contact@eventify.com" className="text-gray-700 hover:text-gray-900">
                  contact@ems.com
                </a>
              </div>
              <div className="flex items-center">
                <PhoneIcon className="h-6 w-6 text-blue-600 mr-3" />
                <a href="tel:+60123456789" className="text-gray-700 hover:text-gray-900">
                  +60 12-345 6789
                </a>
              </div>
              <div className="flex items-start">
                <svg className="h-6 w-6 text-blue-600 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 7.25 7 13 7 13s7-5.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5S10.62 6.5 12 6.5s2.5 1.12 2.5 2.5S13.38 11.5 12 11.5z" />
                </svg>
                <span className="text-gray-700">
                Jalan Sungai Tiram 8, 11900 Bayan Lepas,<br />
                  Penang, Malaysia
                </span>
              </div>
            </div>


            <div className="mt-8">
              <h4 className="text-xl font-semibold text-blue-600">Office Hours</h4>
              <p className="text-gray-700 mt-2">
                Monday - Friday: 9:00 AM - 6:00 PM<br />
                Saturday - Sunday: Closed
              </p>
            </div>
          </motion.div>

         
     
          <div className="col-span-3 mt-12">
            <h3 className="text-2xl font-bold mb-6 text-blue-600 text-center">Our Location</h3>
            <div className="h-96 rounded-lg overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps?q=5.2989,100.2681&hl=es;z=14&output=embed"
                width="100%"
                height="100%"
                allowFullScreen={false}
                loading="lazy"
                className="border-0"
                aria-hidden="false"
                tabIndex="0"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
