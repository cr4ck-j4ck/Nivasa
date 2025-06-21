import React from "react";
import "./footer.css"; // Create this CSS file for custom styles

export default function Footer() {
  return (
    <footer className="footer bg-gray-100 text-gray-700 pt-8 pb-4 mt-50 w-full">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="font-bold mb-3">Explore</h3>
          <ul>
            <li><a href="/listings" className="hover:underline">All Listings</a></li>
            <li><a href="/cities" className="hover:underline">Cities</a></li>
            <li><a href="/rooms" className="hover:underline">Rooms</a></li>
            <li><a href="/hotels" className="hover:underline">Hotels</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3">Hosting</h3>
          <ul>
            <li><a href="/host" className="hover:underline">Become a Host</a></li>
            <li><a href="/resources" className="hover:underline">Hosting Resources</a></li>
            <li><a href="/community" className="hover:underline">Community Forum</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3">Support</h3>
          <ul>
            <li><a href="/help" className="hover:underline">Help Center</a></li>
            <li><a href="/contact" className="hover:underline">Contact Us</a></li>
            <li><a href="/cancellation" className="hover:underline">Cancellation Options</a></li>
            <li><a href="/covid" className="hover:underline">COVID-19 Response</a></li>
          </ul>
        </div>
        <div>
          <h3 className="font-bold mb-3">About</h3>
          <ul>
            <li><a href="/about" className="hover:underline">About Us</a></li>
            <li><a href="/careers" className="hover:underline">Careers</a></li>
            <li><a href="/privacy" className="hover:underline">Privacy Policy</a></li>
            <li><a href="/terms" className="hover:underline">Terms</a></li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 mt-8 border-t pt-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <span>&copy; {new Date().getFullYear()} Nivasa. All rights reserved.</span>
        <div className="flex space-x-4 mt-2 md:mt-0">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <i className="fab fa-twitter"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}