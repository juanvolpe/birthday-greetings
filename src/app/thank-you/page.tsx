import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and texture */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-700 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 opacity-5 bg-[url('/sparkles.svg')]" />
      </div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="text-center space-y-8">
            {/* Celebration Icon */}
            <div className="w-28 h-28 mx-auto bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-xl border border-white/20">
              <span className="text-6xl">🎉</span>
            </div>

            {/* Thank You Message */}
            <h1 className="text-5xl font-bold text-white">
              Thank You!
            </h1>

            <p className="text-lg text-white/90">
              Your birthday wishes have been added to the collection.
              <br />
              They will help make this celebration extra special!
            </p>

            {/* Back to Home Button */}
            <div className="pt-4">
              <Link
                href="/"
                className="inline-block px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-lg 
                  border border-white/20 hover:bg-white/20 transition-all duration-200"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
      </div>
    </div>
  );
} 