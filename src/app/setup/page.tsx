'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SetupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const birthdayPersonName = formData.get('birthdayPersonName')?.toString().trim();
    const gathererEmail = formData.get('gathererEmail')?.toString().trim();

    if (!birthdayPersonName) {
      setError('Birthday person name is required');
      setIsSubmitting(false);
      return;
    }

    if (!gathererEmail) {
      setError('Your email is required');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthdayPerson: {
            name: birthdayPersonName,
            dateOfBirth: formData.get('dateOfBirth')?.toString() || new Date().toISOString().split('T')[0],
            email: formData.get('birthdayPersonEmail')?.toString() || '',
          },
          gatherer: {
            name: formData.get('gathererName')?.toString() || 'Anonymous',
            email: gathererEmail,
          },
          invitedEmails: formData.get('invitedEmails')?.toString().split(',').map(email => email.trim()).filter(Boolean) || [],
          name: formData.get('campaignName')?.toString() || `${birthdayPersonName}'s Birthday`,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create campaign');
      }

      const data = await response.json();
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Create New Campaign
            </h1>
            <Link
              href="/"
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              ← Back
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Birthday Person Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Birthday Person Information</h3>
              
              <div>
                <label htmlFor="birthdayPersonName" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="birthdayPersonName"
                  name="birthdayPersonName"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter the birthday person's name"
                />
              </div>

              <div>
                <label htmlFor="birthdayPersonEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="birthdayPersonEmail"
                  name="birthdayPersonEmail"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter the birthday person's email"
                />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Birthday Date
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Campaign Name */}
            <div>
              <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-1">
                Campaign Name
              </label>
              <input
                type="text"
                id="campaignName"
                name="campaignName"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="Enter a name for this campaign"
              />
            </div>

            {/* Gatherer Info */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">Your Information</h3>
              
              <div>
                <label htmlFor="gathererName" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="gathererName"
                  name="gathererName"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="gathererEmail" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="gathererEmail"
                  name="gathererEmail"
                  required
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            {/* Invited Emails */}
            <div>
              <label htmlFor="invitedEmails" className="block text-sm font-medium text-gray-700 mb-1">
                Invite Others (Optional)
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

            {/* Submit Button */}
            <div className="flex justify-end">
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
                    Creating Campaign...
                  </span>
                ) : (
                  'Create Campaign'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}