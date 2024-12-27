'use client';

import { useEffect, useState } from 'react';
import { Campaign, Greeting } from '@/data/mockData';
import Link from 'next/link';

interface ResponseStatus {
  email: string;
  hasResponded: boolean;
  includedPicture: boolean;
  isInvited: boolean;
  senderName?: string;
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
          const email = greeting.senderEmail || 'unknown';
          const existing = statusMap.get(email) || {
            email,
            hasResponded: false,
            includedPicture: false,
            isInvited: false,
          };

          statusMap.set(email, {
            ...existing,
            hasResponded: true,
            includedPicture: !!greeting.imageUrl,
            senderName: greeting.senderName,
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Campaign not found'}</p>
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

  const invitedResponses = responseStatuses.filter(status => status.isInvited);
  const uninvitedResponses = responseStatuses.filter(status => !status.isInvited);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">
          Campaign Status: {campaign?.birthdayPerson.name}'s Birthday
        </h1>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Back to Home
        </Link>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Invited Responses</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow-md rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Picture
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {invitedResponses.map((status) => (
                <tr key={status.email}>
                  <td className="px-6 py-4 whitespace-nowrap">{status.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {status.senderName || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      status.hasResponded
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {status.hasResponded ? 'Completed' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {status.includedPicture ? '✓' : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {uninvitedResponses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Additional Responses</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Picture
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {uninvitedResponses.map((status) => (
                  <tr key={status.email}>
                    <td className="px-6 py-4 whitespace-nowrap">{status.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {status.senderName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {status.includedPicture ? '✓' : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 