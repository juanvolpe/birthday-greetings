'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Campaign } from '@/data/mockData';

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
        setError(err instanceof Error ? err.message : 'Failed to load campaigns');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCampaigns();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Birthday Campaigns</h1>
        <Link
          href="/setup"
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 mb-4">No campaigns yet</p>
          <p className="text-gray-500">
            Click "Create New Campaign" to get started
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {campaigns.map((campaign) => (
            <div
              key={campaign.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2">
                  {campaign.birthdayPerson.name}'s Birthday
                </h2>
                <p className="text-gray-600 mb-4">
                  {new Date(campaign.birthdayPerson.dateOfBirth).toLocaleDateString()}
                </p>
                <div className="flex gap-2">
                  <Link
                    href={`/greetings/${campaign.id}`}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white text-center rounded hover:bg-blue-600"
                  >
                    View Greetings
                  </Link>
                  <Link
                    href={`/status/${campaign.id}`}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Status
                  </Link>
                </div>
              </div>
              <div className="px-6 py-3 bg-gray-50 flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  Created by: {campaign.gatherer.name}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  campaign.status === 'completed'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {campaign.status === 'completed' ? 'Completed' : 'Collecting'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 