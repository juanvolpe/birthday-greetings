import dynamic from 'next/dynamic';

const ThankYouClient = dynamic(() => import('./client'), {
  ssr: false
});

export default function ThankYouPage() {
  return <ThankYouClient />;
} 