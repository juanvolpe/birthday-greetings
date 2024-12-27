'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Campaign } from '@/data/mockData';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

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

  useEffect(() => {
    fetchCampaigns();
  }, []);

  async function handleDelete(campaignId: string) {
    if (!confirm('Are you sure you want to delete this campaign? This action cannot be undone.')) {
      return;
    }

    setIsDeleting(campaignId);
    try {
      const response = await fetch(`/api/campaigns/${campaignId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete campaign');
      }

      // Refresh the campaigns list
      await fetchCampaigns();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete campaign');
    } finally {
      setIsDeleting(null);
    }
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-8 rounded-2xl bg-white/50 backdrop-blur-sm shadow-xl"
        >
          <p className="text-red-500 mb-4 text-lg">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Retry
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="flex">
        {/* Sidebar */}
        <motion.aside 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-80 bg-white min-h-screen shadow-xl fixed left-0 top-0 overflow-y-auto"
        >
          <div className="p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-2">
                Birthday Joy
              </h2>
              <p className="text-gray-600">
                Bringing people together to celebrate life's special moments
              </p>
            </div>

            <div className="space-y-8">
              {/* How It Works */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">How It Works</h3>
                
                <div className="space-y-6">
                  {/* Step 1 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Create a Campaign</h4>
                      <p className="text-sm text-gray-600">
                        Start by creating a birthday campaign with the birthday person's details
                      </p>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Invite Friends & Family</h4>
                      <p className="text-sm text-gray-600">
                        Add email addresses of people you want to contribute birthday wishes
                      </p>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-semibold">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Collect Wishes</h4>
                      <p className="text-sm text-gray-600">
                        Invitees receive an email with a link to submit their birthday wishes and photos
                      </p>
                    </div>
                  </div>

                  {/* Step 4 */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-semibold">
                      4
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-1">Track Progress</h4>
                      <p className="text-sm text-gray-600">
                        Monitor responses and view all collected wishes in one place
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Inspirational Quote */}
              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                <svg className="w-8 h-8 text-indigo-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-gray-700 italic mb-2">
                  "The more you praise and celebrate your life, the more there is in life to celebrate."
                </p>
                <p className="text-gray-500 text-sm">- Oprah Winfrey</p>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main Content */}
        <main className="flex-1 ml-80">
          <div className="container mx-auto px-8 py-12">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center mb-12"
            >
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                Birthday Campaigns
              </h1>
              <div className="flex gap-4">
                <Link
                  href="/admin"
                  className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Admin
                </Link>
                <Link
                  href="/setup"
                  className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Create New Campaign
                </Link>
              </div>
            </motion.div>

            {campaigns.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-16 px-4 rounded-2xl bg-white/50 backdrop-blur-sm shadow-xl"
              >
                <p className="text-gray-600 text-xl mb-4">No campaigns yet</p>
                <p className="text-gray-500 mb-8">
                  Start by creating your first birthday campaign
                </p>
                <Link
                  href="/setup"
                  className="px-8 py-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg inline-block"
                >
                  Create New Campaign
                </Link>
              </motion.div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {campaigns.map((campaign, index) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                  >
                    <div className="p-6">
                      <h2 className="text-2xl font-semibold mb-2 text-gray-800">
                        {campaign.birthdayPerson.name}'s Birthday
                      </h2>
                      <p className="text-gray-600 mb-6">
                        {new Date(campaign.birthdayPerson.dateOfBirth).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                      <div className="flex gap-3">
                        <Link
                          href={`/greetings/${campaign.id}`}
                          className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-center rounded-lg hover:from-blue-600 hover:to-indigo-600 transform hover:scale-105 transition-all duration-200"
                        >
                          View Greetings
                        </Link>
                        <Link
                          href={`/status/${campaign.id}`}
                          className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transform hover:scale-105 transition-all duration-200"
                        >
                          Status
                        </Link>
                      </div>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 flex justify-between items-center">
                      <span className="text-sm text-gray-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        {campaign.gatherer.name}
                      </span>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          campaign.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {campaign.status === 'completed' ? 'Completed' : 'Collecting'}
                        </span>
                        <button
                          onClick={() => handleDelete(campaign.id)}
                          disabled={isDeleting === campaign.id}
                          className={`text-red-500 hover:text-red-700 transition-colors duration-200 ${
                            isDeleting === campaign.id ? 'opacity-50 cursor-not-allowed' : ''
                          }`}
                        >
                          {isDeleting === campaign.id ? (
                            <span className="inline-block animate-spin">↻</span>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
} 