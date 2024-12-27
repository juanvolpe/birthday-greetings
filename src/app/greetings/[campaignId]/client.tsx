'use client';

import { useEffect, useState } from 'react';
import { Greeting, Campaign } from '@/data/mockData';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface GreetingsClientProps {
  campaignId: string;
}

export default function GreetingsClient({ campaignId }: GreetingsClientProps) {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch campaign details
        const campaignRes = await fetch(`/api/campaigns/${campaignId}`);
        if (!campaignRes.ok) throw new Error('Failed to fetch campaign');
        const campaignData = await campaignRes.json();
        setCampaign(campaignData);

        // Fetch greetings
        const greetingsRes = await fetch(`/api/greetings?campaignId=${campaignId}`);
        if (!greetingsRes.ok) throw new Error('Failed to fetch greetings');
        const data = await greetingsRes.json();
        setGreetings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [campaignId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-8 rounded-2xl bg-white/50 backdrop-blur-sm shadow-xl">
          <p className="text-red-500 mb-4 text-lg">{error || 'Campaign not found'}</p>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-4"
          >
            Birthday Wishes for {campaign.birthdayPerson.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg"
          >
            A collection of heartfelt messages from friends and family
          </motion.p>
        </div>

        {/* Greetings Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {greetings.map((greeting, index) => (
            <motion.div
              key={greeting.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]"
            >
              {greeting.image && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={greeting.image}
                    alt="Greeting"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                  />
                </div>
              )}
              <div className="p-6">
                <p className="text-gray-800 text-lg mb-4 leading-relaxed">
                  "{greeting.message}"
                </p>
                <div className="border-t pt-4">
                  <p className="font-medium text-gray-800">
                    {greeting.name || 'Anonymous'}
                  </p>
                  <p className="text-sm text-gray-500">{greeting.email}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {greetings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <p className="text-gray-600 text-xl mb-4">No greetings yet</p>
            <p className="text-gray-500">
              Be the first one to send your birthday wishes!
            </p>
          </motion.div>
        )}

        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <Link
            href="/"
            className="inline-flex items-center px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Campaigns
          </Link>
        </motion.div>
      </div>
    </div>
  );
} 