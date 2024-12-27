'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BirthdayPerson {
  name: string;
  age: number;
  dateOfBirth: string;
  email: string;
  gender: string;
  interests: string[];
}

interface Gatherer {
  name: string;
  email: string;
}

export default function SetupPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [birthdayPerson, setBirthdayPerson] = useState<BirthdayPerson>({
    name: '',
    age: 0,
    dateOfBirth: '',
    email: '',
    gender: '',
    interests: [],
  });

  const [gatherer, setGatherer] = useState<Gatherer>({
    name: '',
    email: '',
  });

  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [interest, setInterest] = useState('');

  function addEmail() {
    if (newEmail && !invitedEmails.includes(newEmail)) {
      setInvitedEmails([...invitedEmails, newEmail]);
      setNewEmail('');
    }
  }

  function addInterest() {
    if (interest && !birthdayPerson.interests.includes(interest)) {
      setBirthdayPerson({
        ...birthdayPerson,
        interests: [...birthdayPerson.interests, interest],
      });
      setInterest('');
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/campaigns', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          birthdayPerson,
          gatherer,
          invitedEmails,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create campaign');
      }

      const campaign = await response.json();
      console.log('Campaign created:', campaign);
      router.push('/');
    } catch (err) {
      console.error('Error creating campaign:', err);
      setError(err instanceof Error ? err.message : 'Failed to create campaign');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Setup Birthday Campaign</h1>
        <Link
          href="/"
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
        >
          Back to Home
        </Link>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Birthday Person Details</h3>
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded"
              value={birthdayPerson.name}
              onChange={(e) => setBirthdayPerson({...birthdayPerson, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Age</label>
            <input
              type="number"
              required
              min="0"
              className="w-full p-2 border rounded"
              value={birthdayPerson.age || ''}
              onChange={(e) => setBirthdayPerson({...birthdayPerson, age: parseInt(e.target.value)})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Date of Birth</label>
            <input
              type="date"
              required
              className="w-full p-2 border rounded"
              value={birthdayPerson.dateOfBirth}
              onChange={(e) => setBirthdayPerson({...birthdayPerson, dateOfBirth: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              className="w-full p-2 border rounded"
              value={birthdayPerson.email}
              onChange={(e) => setBirthdayPerson({...birthdayPerson, email: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Gender</label>
            <select
              required
              className="w-full p-2 border rounded"
              value={birthdayPerson.gender}
              onChange={(e) => setBirthdayPerson({...birthdayPerson, gender: e.target.value})}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Interests</label>
            <div className="flex gap-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
                placeholder="Add an interest"
              />
              <button
                type="button"
                onClick={addInterest}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {birthdayPerson.interests.map((item, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {item}
                  <button
                    type="button"
                    className="ml-2 text-blue-600 hover:text-blue-800"
                    onClick={() => setBirthdayPerson({
                      ...birthdayPerson,
                      interests: birthdayPerson.interests.filter((_, i) => i !== index)
                    })}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Information (Campaign Gatherer)</h3>
          <div>
            <label className="block text-sm font-medium mb-2">Your Name</label>
            <input
              type="text"
              required
              className="w-full p-2 border rounded"
              value={gatherer.name}
              onChange={(e) => setGatherer({...gatherer, name: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Your Email</label>
            <input
              type="email"
              required
              className="w-full p-2 border rounded"
              value={gatherer.email}
              onChange={(e) => setGatherer({...gatherer, email: e.target.value})}
            />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Invite Friends & Family</h3>
          <div className="flex gap-2">
            <input
              type="email"
              className="flex-1 p-2 border rounded"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter email address"
            />
            <button
              type="button"
              onClick={addEmail}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add
            </button>
          </div>
          
          <div className="space-y-2">
            {invitedEmails.map((email, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span>{email}</span>
                <button
                  type="button"
                  onClick={() => setInvitedEmails(invitedEmails.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600'
          } text-white rounded`}
        >
          {isSubmitting ? 'Creating Campaign...' : 'Create Campaign'}
        </button>
      </form>
    </div>
  );
}