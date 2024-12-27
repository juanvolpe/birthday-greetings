'use client';

import { useEffect, useState } from 'react';
import { Greeting, Campaign } from '@/data/mockData';

interface GreetingsClientProps {
  campaignId: string;
}

export default function GreetingsClient({ campaignId }: GreetingsClientProps) {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<'none' | 'invited' | 'not-invited'>('none');
  const [isVerifying, setIsVerifying] = useState(false);

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

  const handleVerifyEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    try {
      // Check if email was invited
      const isInvited = campaign?.invitedEmails.includes(email);
      setVerificationStatus(isInvited ? 'invited' : 'not-invited');

      // If all invited people have submitted greetings, update campaign status
      if (isInvited && campaign) {
        const allGreetings = new Set(greetings.map(g => g.email));
        const allInvited = campaign.invitedEmails;
        const allSubmitted = allInvited.every(invitedEmail => 
          allGreetings.has(invitedEmail)
        );

        if (allSubmitted) {
          // Update campaign status to completed
          await fetch(`/api/campaigns/${campaignId}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status: 'completed' }),
          });
        }
      }
    } catch (err) {
      setError('Failed to verify email');
    } finally {
      setIsVerifying(false);
    }
  };

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
      {/* Email Verification Form */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4">Verify Your Invitation</h3>
        <form onSubmit={handleVerifyEmail} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Enter your email
            </label>
            <div className="flex gap-3">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="your@email.com"
                required
              />
              <button
                type="submit"
                disabled={isVerifying}
                className={`px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors ${
                  isVerifying ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isVerifying ? 'Verifying...' : 'Verify'}
              </button>
            </div>
          </div>
          
          {verificationStatus !== 'none' && (
            <div className={`p-4 rounded-lg ${
              verificationStatus === 'invited' 
                ? 'bg-green-50 text-green-800' 
                : 'bg-yellow-50 text-yellow-800'
            }`}>
              {verificationStatus === 'invited' 
                ? "✅ You're on the guest list! You can submit your wishes."
                : "⚠️ This email wasn't invited, but you can still submit your wishes."}
            </div>
          )}
        </form>
      </div>

      <h2 className="text-2xl font-bold mb-6">Greetings</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {greetings.map((greeting) => (
          <div key={greeting.id} className="bg-white rounded-lg shadow-md p-6">
            {greeting.image && (
              <div className="mb-4">
                <img
                  src={greeting.image}
                  alt="Greeting"
                  className="w-full h-48 object-cover rounded-lg"
                />
              </div>
            )}
            <p className="text-gray-800 mb-2">{greeting.message}</p>
            <div className="text-sm">
              <p className="font-medium text-gray-800">From: {greeting.name || 'Anonymous'}</p>
              <p className="text-gray-500">{greeting.email}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 