export interface Campaign {
  id: string;
  birthdayPerson: {
    name: string;
    dateOfBirth: string;
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
  name: string;
  email: string;
  message: string;
  image?: string;
  createdAt: string;
}

// Mock data will be replaced by actual storage
export const campaigns: Campaign[] = [];
export const greetings: Greeting[] = []; 