import { Home, Shield, AlertTriangle, ArrowLeft } from "lucide-react"

export default function UnauthorizedPage() {
  const handleGoHome = () => {
    // Replace with your actual home navigation logic
    window.location.href = '/'
  }

  const handleGoBack = () => {
    window.history.back()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-red-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-orange-400/20 to-yellow-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Floating Warning Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <Shield className="absolute top-20 left-20 w-8 h-8 text-red-400/30 animate-bounce delay-300" />
        <AlertTriangle className="absolute top-40 right-32 w-6 h-6 text-orange-400/30 animate-bounce delay-700" />
        <Shield className="absolute bottom-40 left-32 w-7 h-7 text-yellow-400/30 animate-bounce delay-1000" />
        <AlertTriangle className="absolute bottom-20 right-20 w-8 h-8 text-red-400/30 animate-bounce delay-500" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="bg-white/70 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 border border-white/20">
          {/* Error Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <Shield className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              401
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-700 mb-4">
              Unauthorized Access
            </h2>
            <p className="text-lg text-gray-600 mb-2">
              Sorry, you don't have permission to access this page.
            </p>
            <p className="text-gray-500">
              Please check your credentials or contact an administrator if you believe this is an error.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGoHome}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Go to Home
            </button>
            
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl border border-gray-200 hover:border-gray-300 transform hover:-translate-y-1 transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Go Back
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 mb-4">
              Need help? Here are some options:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a href="/login" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                Login Page
              </a>
              <a href="/contact" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                Contact Support
              </a>
              <a href="/help" className="text-blue-600 hover:text-blue-800 hover:underline transition-colors">
                Help Center
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Error Code: 401 • {new Date().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}