export interface Campaign {
  id: string;
  birthdayPerson: {
    name: string;
    age: number;
    dateOfBirth: string;
    email: string;
    gender: string;
    interests: string[];
  };
  gathererId: string;
  invitedEmails: string[];
  shareableLink: string;
  status: 'draft' | 'collecting' | 'reviewing' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Greeting {
  id: string;
  campaignId: string;
  message: string;
  senderName?: string;
  imageUrl?: string;
  approved: boolean;
  createdAt: string;
}

// Sample campaigns
export const campaigns: Campaign[] = [
  {
    id: 'campaign-1',
    birthdayPerson: {
      name: 'John Doe',
      age: 30,
      dateOfBirth: '1994-01-01',
      email: 'john@example.com',
      gender: 'male',
      interests: ['Reading', 'Travel', 'Photography'],
    },
    gathererId: 'user-1',
    invitedEmails: ['friend1@example.com', 'friend2@example.com'],
    shareableLink: '/upload/campaign-1',
    status: 'collecting',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'campaign-2',
    birthdayPerson: {
      name: 'Jane Smith',
      age: 25,
      dateOfBirth: '1999-02-15',
      email: 'jane@example.com',
      gender: 'female',
      interests: ['Music', 'Cooking', 'Art'],
    },
    gathererId: 'user-2',
    invitedEmails: ['friend3@example.com', 'friend4@example.com'],
    shareableLink: '/upload/campaign-2',
    status: 'completed',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
  },
];

// Sample greetings
export const greetings: Greeting[] = [
  {
    id: 'greeting-1',
    campaignId: 'campaign-1',
    message: 'Happy Birthday! Wishing you all the best on your special day! 🎉',
    senderName: 'Alice',
    imageUrl: 'https://source.unsplash.com/random/400x300?birthday,cake',
    approved: true,
    createdAt: '2024-01-02T10:00:00Z',
  },
  {
    id: 'greeting-2',
    campaignId: 'campaign-1',
    message: 'Many happy returns of the day! Have a fantastic celebration! 🎂',
    senderName: 'Bob',
    imageUrl: 'https://source.unsplash.com/random/400x300?celebration',
    approved: true,
    createdAt: '2024-01-02T11:00:00Z',
  },
  {
    id: 'greeting-3',
    campaignId: 'campaign-2',
    message: 'Happy Birthday Jane! Hope your day is filled with joy and laughter! 🎈',
    senderName: 'Charlie',
    imageUrl: 'https://source.unsplash.com/random/400x300?party',
    approved: true,
    createdAt: '2024-01-03T09:00:00Z',
  },
]; 