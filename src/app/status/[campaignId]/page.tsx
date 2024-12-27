'use client';

import { useEffect, useState } from 'react';
import { Campaign, Greeting } from '@/data/mockData';
import Link from 'next/link';

interface ResponseStatus {
  email: string;
  hasResponded: boolean;
  includedPicture: boolean;
  isInvited: boolean;
  name?: string;
}

export default function CampaignStatusPage({
  params,
}: {
  params: { campaignId: string };
}) {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [responseStatuses, setResponseStatuses] = useState<ResponseStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch campaign details
        const campaignRes = await fetch(`/api/campaigns/${params.campaignId}`);
        if (!campaignRes.ok) throw new Error('Failed to fetch campaign');
        const campaignData = await campaignRes.json();
        setCampaign(campaignData);

        // Fetch greetings
        const greetingsRes = await fetch(`/api/greetings?campaignId=${params.campaignId}`);
        if (!greetingsRes.ok) throw new Error('Failed to fetch greetings');
        const greetings: Greeting[] = await greetingsRes.json();

        // Create status map for all invited emails
        const statusMap = new Map<string, ResponseStatus>();
        
        // Initialize with invited emails
        campaignData.invitedEmails.forEach((email: string) => {
          statusMap.set(email, {
            email,
            hasResponded: false,
            includedPicture: false,
            isInvited: true,
          });
        });

        // Update with responses
        greetings.forEach((greeting) => {
          const email = greeting.email;
          const existing = statusMap.get(email) || {
            email,
            hasResponded: false,
            includedPicture: false,
            isInvited: false,
          };

          statusMap.set(email, {
            ...existing,
            hasResponded: true,
            includedPicture: !!greeting.image,
            name: greeting.name,
          });
        });

        setResponseStatuses(Array.from(statusMap.values()));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [params.campaignId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="p-8 rounded-2xl bg-white/50 backdrop-blur-sm shadow-xl">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-8 rounded-2xl bg-white/50 backdrop-blur-sm shadow-xl">
          <p className="text-red-500 mb-4 text-lg">{error || 'Campaign not found'}</p>
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

  const invitedResponses = responseStatuses.filter(status => status.isInvited);
  const uninvitedResponses = responseStatuses.filter(status => !status.isInvited);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Campaign Status: {campaign.birthdayPerson.name}'s Birthday
          </h1>
          <Link
            href="/"
            className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Back to Home
          </Link>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Invited Responses */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-blue-500 to-indigo-500">
              <h2 className="text-xl font-semibold text-white">Invited Responses</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {invitedResponses.map((status) => (
                  <div
                    key={status.email}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-900">
                        {status.name || status.email}
                      </p>
                      {status.name && (
                        <p className="text-sm text-gray-500">{status.email}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          status.hasResponded
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {status.hasResponded ? 'Responded' : 'Pending'}
                      </span>
                      {status.hasResponded && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            status.includedPicture
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {status.includedPicture ? 'Has Image' : 'No Image'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Additional Responses */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 bg-gradient-to-r from-green-500 to-teal-500">
              <h2 className="text-xl font-semibold text-white">Additional Responses</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {uninvitedResponses.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">
                    No additional responses yet
                  </p>
                ) : (
                  uninvitedResponses.map((status) => (
                    <div
                      key={status.email}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {status.name || status.email}
                        </p>
                        {status.name && (
                          <p className="text-sm text-gray-500">{status.email}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Responded
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            status.includedPicture
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {status.includedPicture ? 'Has Image' : 'No Image'}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 