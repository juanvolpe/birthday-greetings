import GreetingsClient from './client';

export default async function GreetingsPage({
  params,
}: {
  params: { campaignId: string };
}) {
  return <GreetingsClient campaignId={params.campaignId} />;
} 