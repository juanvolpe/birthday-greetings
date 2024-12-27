'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { Campaign } from '@/data/mockData';

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const response = await fetch('/api/campaigns');
        if (!response.ok) throw new Error('Failed to fetch campaigns');
        const data = await response.json();
        setCampaigns(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading campaigns...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-8">
        Birthday Greetings App
      </h1>
      
      <div className="max-w-2xl mx-auto space-y-8">
        <Link 
          href="/setup" 
          className="block w-full py-3 px-4 text-center bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Create New Campaign
        </Link>
        
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Active Campaigns</h2>
          {campaigns.length === 0 ? (
            <p className="text-center text-gray-600 py-8">
              No active campaigns. Create one to get started!
            </p>
          ) : (
            campaigns.map((campaign) => (
              <div key={campaign.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-medium">
                      Birthday Campaign for {campaign.birthdayPerson.name}
                    </h3>
                    <p className="text-gray-600">Status: {campaign.status}</p>
                  </div>
                  <span className="text-sm text-gray-500">ID: {campaign.id}</span>
                </div>
                
                <div className="flex gap-3">
                  <Link
                    href={`/upload/${campaign.id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    Upload Link
                  </Link>
                  <Link
                    href={`/greetings/${campaign.id}`}
                    className="text-green-500 hover:text-green-700"
                  >
                    View Greetings
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
} 