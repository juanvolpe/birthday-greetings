'use client';

import { useEffect, useState } from 'react';
import { Greeting } from '@/data/mockData';

interface GreetingsClientProps {
  campaignId: string;
}

export default function GreetingsClient({ campaignId }: GreetingsClientProps) {
  const [greetings, setGreetings] = useState<Greeting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGreetings() {
      try {
        const res = await fetch(`/api/greetings?campaignId=${campaignId}`);
        if (!res.ok) throw new Error('Failed to fetch greetings');
        const data = await res.json();
        setGreetings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      } finally {
        setIsLoading(false);
      }
    }

    fetchGreetings();
  }, [campaignId]);

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
            <p className="text-sm text-gray-500">From: {greeting.name || 'Anonymous'}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 