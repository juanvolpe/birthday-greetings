'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

export default function ThankYouPage() {
  const searchParams = useSearchParams();
  const photoUrl = searchParams?.get('photo');
  const campaignName = searchParams?.get('name') || 'Birthday Campaign';

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Birthday person's photo or name */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="absolute top-8 left-8 z-20"
      >
        {photoUrl ? (
          <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-white shadow-xl">
            <Image
              src={photoUrl}
              alt="Birthday Person"
              width={256}
              height={256}
              className="object-cover w-full h-full"
              unoptimized
            />
          </div>
        ) : (
          <div className="w-64 h-64 rounded-full bg-white shadow-xl border-4 border-white flex items-center justify-center">
            <div className="text-4xl font-bold text-purple-600 text-center leading-tight">
              {campaignName.split(' ').map((word, i) => (
                <div key={i}>{word}</div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

      {/* Animated purple block sliding from left */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 100,
          damping: 20,
          duration: 0.8 
        }}
        className="absolute left-0 top-0 h-full w-1/3 bg-gradient-to-br from-purple-600 to-indigo-600"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="absolute inset-0 bg-[url('/sparkles.svg')] opacity-10"
        />
      </motion.div>

      {/* Content */}
      <div className="relative min-h-screen flex items-center">
        <div className="w-1/3" /> {/* Spacer for purple block */}
        <div className="flex-1 flex items-center justify-center px-8">
          <div className="max-w-md w-full">
            {/* Thank you message with staggered animations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="text-center space-y-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  delay: 1,
                  type: "spring",
                  stiffness: 200,
                  damping: 15
                }}
                className="w-28 h-28 mx-auto bg-white rounded-full flex items-center justify-center shadow-xl"
              >
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 }}
                  className="text-6xl"
                >
                  🎉
                </motion.span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-indigo-600"
              >
                Thank You!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 }}
                className="text-gray-600 text-lg"
              >
                Your birthday wishes have been added to the collection.
                <br />
                They will help make this celebration extra special!
              </motion.p>

              {/* Back to home button with hover animation */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
                className="pt-4"
              >
                <Link
                  href="/"
                  className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg 
                    transform hover:scale-105 transition-all duration-200 hover:shadow-lg"
                >
                  Back to Home
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Background decorative elements */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute inset-0 pointer-events-none"
      >
        <div className="absolute top-1/4 right-1/4 w-20 h-20 bg-purple-200 rounded-full blur-xl" />
        <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-indigo-200 rounded-full blur-xl" />
        <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-pink-200 rounded-full blur-xl" />
      </motion.div>
    </div>
  );
} 