'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Campaign } from '@/data/mockData';

interface UploadFormData {
  message: string;
  senderName: string;
  image?: File;
}

export default function UploadPage({ params }: { params: { campaignId: string } }) {
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [formData, setFormData] = useState<UploadFormData>({
    message: '',
    senderName: '',
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCampaign() {
      try {
        const response = await fetch(`/api/campaigns/${params.campaignId}`);
        if (!response.ok) throw new Error('Campaign not found');
        const data = await response.json();
        setCampaign(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      }
    }

    fetchCampaign();
  }, [params.campaignId]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    
    try {
      // In a real app, you'd upload the image to a storage service first
      // and get back a URL. For now, we'll use the preview URL
      const greetingData = {
        campaignId: params.campaignId,
        message: formData.message,
        senderName: formData.senderName || undefined,
        imageUrl: imagePreview || undefined,
      };

      const response = await fetch('/api/greetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(greetingData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit greeting');
      }

      // Show success message and redirect
      alert('Thank you for your wishes!');
      router.push('/thank-you');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit greeting');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Send Birthday Wishes</h1>
      <p className="text-center text-gray-600 mb-8">
        For: {campaign.birthdayPerson.name}
      </p>

      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Your Message</label>
            <textarea
              required
              className="w-full p-3 border rounded-lg min-h-[150px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Write your birthday message here..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Your Name (Optional)</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="How should we sign your message?"
              value={formData.senderName}
              onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Add a Photo (Optional)</label>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full"
              />
              {imagePreview && (
                <div className="relative w-full max-w-xs mx-auto">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="rounded-lg shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setFormData({ ...formData, image: undefined });
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 rounded-lg text-white font-medium transition-colors ${
            isSubmitting
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {isSubmitting ? 'Sending...' : 'Send Birthday Wishes'}
        </button>
      </form>
    </div>
  );
}