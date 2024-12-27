'use client';

import { useState, useEffect } from 'react';
import { Campaign, Greeting } from '@/data/mockData';
import Link from 'next/link';

interface ClientProps {
  campaignId: string;
}

export default function GreetingsClient({ campaignId }: ClientProps) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch campaign details
        const campaignResponse = await fetch(`/api/campaigns/${campaignId}`);
        if (!campaignResponse.ok) throw new Error('Failed to fetch campaign');
        const campaignData = await campaignResponse.json();
        setCampaign(campaignData);

        // Fetch greetings
        const greetingsResponse = await fetch(`/api/greetings?campaignId=${campaignId}`);
        if (!greetingsResponse.ok) throw new Error('Failed to fetch greetings');
        const greetingsData = await greetingsResponse.json();
        setGreetings(greetingsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [campaignId]);

  function nextGreeting() {
    setCurrentIndex((prev) => (prev + 1) % greetings.length);
  }

  function previousGreeting() {
    setCurrentIndex((prev) => (prev - 1 + greetings.length) % greetings.length);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="p-8 rounded-2xl bg-white/50 backdrop-blur-sm shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-8 rounded-2xl bg-white/50 backdrop-blur-sm shadow-xl">
          <p className="text-red-500 mb-4 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!campaign || greetings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-8 rounded-2xl bg-white/50 backdrop-blur-sm shadow-xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Greetings Found</h1>
          <p className="text-gray-600 mb-6">There are no birthday wishes to display yet.</p>
          <Link
            href="/"
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentGreeting = greetings[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Happy Birthday, {campaign.birthdayPerson.name}! 🎉
          </h1>
          <Link
            href="/"
            className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Back to Home
          </Link>
        </div>

        <p className="text-xl text-gray-600 mb-12 text-center">
          You have {greetings.length} birthday wishes from your loved ones
        </p>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8">
              {currentGreeting.image && (
                <div className="mb-8">
                  <img
                    src={currentGreeting.image}
                    alt="Birthday wish"
                    className="w-full h-64 object-cover rounded-xl shadow-lg"
                  />
                </div>
              )}
              
              <div className="space-y-6">
                <p className="text-xl text-gray-800 italic">
                  "{currentGreeting.message}"
                </p>
                <p className="text-gray-600">
                  - With love, {currentGreeting.name}
                </p>
              </div>
            </div>

            <div className="bg-gray-50 px-8 py-4 flex items-center justify-between">
              <button
                onClick={previousGreeting}
                className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors"
              >
                ← Previous
              </button>
              <span className="text-gray-600">
                {currentIndex + 1} of {greetings.length}
              </span>
              <button
                onClick={nextGreeting}
                className="px-6 py-3 text-gray-700 hover:text-gray-900 transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 