'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BirthdayPerson {
  name: string;
  age: number;
  dateOfBirth: string;
  email: string;
  gender: string;
  interests: string[];
}

export default function SetupPage() {
  const router = useRouter();
  const [birthdayPerson, setBirthdayPerson] = useState<BirthdayPerson>({
    name: '',
    age: 0,
    dateOfBirth: '',
    email: '',
    gender: '',
    interests: [],
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
    // TODO: Implement API call to create campaign
    console.log('Creating campaign with:', { birthdayPerson, invitedEmails });
    // For now, just redirect to home
    router.push('/');
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Setup Birthday Campaign</h1>
      
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-4">
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
          className="w-full py-3 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Create Campaign
        </button>
      </form>
    </div>
  );
}