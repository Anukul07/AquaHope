import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaEnvelope,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#f1f1f1] text-[#212529] py-12 px-6 md:px-20 font-inter">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold text-[#0077b6] mb-2">AquaHope</h2>
          <p className="text-sm text-[#555]">
            Bringing clean water to every corners of Africa, one donation at a
            time.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm text-[#555]">
            <li>
              <a href="#campaigns" className="hover:text-[#0077b6] transition">
                Campaigns
              </a>
            </li>
            <li>
              <a href="#donate" className="hover:text-[#0077b6] transition">
                Donate
              </a>
            </li>
            <li>
              <a href="/login" className="hover:text-[#0077b6] transition">
                Login
              </a>
            </li>
            <li>
              <a href="/register" className="hover:text-[#0077b6] transition">
                Register
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
          <p className="text-sm text-[#555] flex items-center gap-2 mb-3">
            <FaEnvelope /> contact@aquahope.org
          </p>
          <div className="flex gap-4 text-[#555] text-lg">
            <a href="#" className="hover:text-[#0077b6]" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-[#0077b6]" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-[#0077b6]" aria-label="Twitter">
              <FaTwitter />
            </a>
          </div>
        </div>

        {/* Newsletter Subscription */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            Subscribe to Our Newsletter
          </h3>
          <p className="text-sm text-[#555] mb-4">
            Get updates on our latest campaigns and success stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0077b6] text-sm"
            />
            <button className="bg-[#0077b6] hover:bg-[#005f87] text-white px-5 py-2 rounded-md text-sm transition">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-12 pt-6 text-center text-sm text-[#999]">
        &copy; {new Date().getFullYear()} AquaHope. All rights reserved.
      </div>
    </footer>
  );
}
