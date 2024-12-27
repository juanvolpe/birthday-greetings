'use client';

import GreetingsClient from './client';
import { Suspense } from 'react';

interface PageProps {
  params: {
    campaignId: string;
  };
}

export default function GreetingsPage({ params }: PageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    }>
      <GreetingsClient campaignId={params.campaignId} />
    </Suspense>
  );
} 