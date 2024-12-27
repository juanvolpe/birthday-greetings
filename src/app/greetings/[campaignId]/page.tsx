'use client';

import { useState, useEffect } from 'react';
import type { Campaign, Greeting } from '@/data/mockData';

interface GreetingCard {
  id: string;
  message: string;
  senderName?: string;
  imageUrl?: string;
}

export default function GreetingsPage({ params }: { params: { campaignId: string } }) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [greetings, setGreetings] = useState<GreetingCard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch campaign details
        const campaignResponse = await fetch(`/api/campaigns/${params.campaignId}`);
        if (!campaignResponse.ok) throw new Error('Failed to fetch campaign');
        const campaignData = await campaignResponse.json();
        setCampaign(campaignData);

        // Fetch greetings
        const greetingsResponse = await fetch(`/api/greetings?campaignId=${params.campaignId}`);
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
  }, [params.campaignId]);

  function nextGreeting() {
    setCurrentIndex((prev) => (prev + 1) % greetings.length);
  }

  function previousGreeting() {
    setCurrentIndex((prev) => (prev - 1 + greetings.length) % greetings.length);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your birthday wishes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!campaign || greetings.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">No Greetings Found</h1>
          <p className="text-gray-600">There are no birthday wishes to display yet.</p>
        </div>
      </div>
    );
  }

  const currentGreeting = greetings[currentIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Happy Birthday, {campaign.birthdayPerson.name}! 🎉
          </h1>
          <p className="text-xl text-gray-600">
            You have {greetings.length} birthday wishes from your loved ones
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              {currentGreeting.imageUrl && (
                <div className="mb-6">
                  <img
                    src={currentGreeting.imageUrl}
                    alt="Birthday wish"
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
              
              <div className="space-y-4">
                <p className="text-xl text-gray-800 italic">
                  "{currentGreeting.message}"
                </p>
                {currentGreeting.senderName && (
                  <p className="text-gray-600">
                    - With love, {currentGreeting.senderName}
                  </p>
                )}
              </div>
            </div>

            <div className="bg-gray-50 px-8 py-4 flex items-center justify-between">
              <button
                onClick={previousGreeting}
                className="px-4 py-2 text-blue-600 hover:text-blue-800"
              >
                ← Previous
              </button>
              <span className="text-gray-600">
                {currentIndex + 1} of {greetings.length}
              </span>
              <button
                onClick={nextGreeting}
                className="px-4 py-2 text-blue-600 hover:text-blue-800"
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