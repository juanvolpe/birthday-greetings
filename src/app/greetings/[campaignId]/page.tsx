import GreetingsClient from './client';

interface PageProps {
  params: {
    campaignId: string;
  };
}

export default function GreetingsPage({ params }: PageProps) {
  return <GreetingsClient campaignId={params.campaignId} />;
} 