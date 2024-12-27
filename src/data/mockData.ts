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
  gatherer: {
    name: string;
    email: string;
  };
  invitedEmails: string[];
  status: 'collecting' | 'completed';
  createdAt: string;
  updatedAt: string;
}

export interface Greeting {
  id: string;
  campaignId: string;
  message: string;
  senderName?: string;
  senderEmail?: string;
  imageUrl?: string;
  createdAt: string;
}

// Mock data will be replaced by actual storage
export const campaigns: Campaign[] = [];
export const greetings: Greeting[] = []; 