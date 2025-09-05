import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer-bg-gradient bg-gradient-to-r from-gray-800 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold mb-4">
              <span className="company-name-blue text-blue-400">Easy</span>
              <span className="company-name-green text-green-400">Driver</span>
              <span className="company-name-orange text-orange-400">Hire</span>
            </h3>
            <p className="text-gray-300 mb-6 max-w-md">
              Connecting trusted drivers with employers across Kenya. Find reliable transportation solutions for your business needs.
            </p>
            <div className="flex space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold">E</span>
              </div>
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold">D</span>
              </div>
              <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-sm font-semibold">H</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/drivers" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Browse Drivers
                </Link>
              </li>
              <li>
                <Link href="/drivers/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Become a Driver
                </Link>
              </li>
              <li>
                <Link href="/employer/dashboard" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Employer Dashboard
                </Link>
              </li>
              <li>
                <Link href="/auth/auth" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Sign Up / Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:easydrivershire1@gmail.com" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Contact Support
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Safety Guidelines
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2025 EasyDriversHire. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors text-sm">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
