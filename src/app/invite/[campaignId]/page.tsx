'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Campaign } from '@/data/mockData';
import Link from 'next/link';

export default function InviteMorePage({ params }: { params: { campaignId: string } }) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        const response = await fetch(`/api/campaigns/${params.campaignId}`);
        if (!response.ok) throw new Error('Campaign not found');
        const data = await response.json();
        setCampaign(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load campaign');
      } finally {
        setIsLoading(false);
      }
    }

    fetchCampaign();
  }, [params.campaignId]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const newEmails = formData.get('invitedEmails')?.toString().split(',').map(email => email.trim()).filter(Boolean) || [];

      if (newEmails.length === 0) {
        setError('Please enter at least one email address');
        return;
      }

      // Add new emails to the campaign
      const response = await fetch(`/api/campaigns/${params.campaignId}/invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emails: newEmails }),
      });

      if (!response.ok) {
        throw new Error('Failed to add new invitees');
      }

      // Redirect back to home page
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

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
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-6 bg-gradient-to-r from-blue-500 to-indigo-500">
            <h1 className="text-2xl font-bold text-white">Add More Invitees</h1>
            <p className="text-blue-100 mt-2">
              {campaign.birthdayPerson.name}'s Birthday Campaign
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label htmlFor="invitedEmails" className="block text-sm font-medium text-gray-700 mb-1">
                Invite More People
              </label>
              <textarea
                id="invitedEmails"
                name="invitedEmails"
                rows={3}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter email addresses separated by commas"
              />
              <p className="mt-1 text-sm text-gray-500">
                Separate multiple email addresses with commas
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <Link
                href="/"
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transform hover:scale-105 transition-all duration-200"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg 
                  hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 
                  shadow-md hover:shadow-lg ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Invites...
                  </span>
                ) : (
                  'Send Invites'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 