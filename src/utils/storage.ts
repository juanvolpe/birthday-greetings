import fs from 'fs/promises';
import path from 'path';
import { Campaign, Greeting } from '@/data/mockData';

const DATA_DIR = process.env.NODE_ENV === 'production' 
  ? '/app'  // Render disk mount path
  : path.join(process.cwd(), 'data');

const CAMPAIGNS_FILE = 'campaigns.json';
const GREETINGS_FILE = 'greetings.json';

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Initialize storage files if they don't exist
async function initializeStorage() {
  await ensureDataDir();
  
  try {
    await fs.access(path.join(DATA_DIR, CAMPAIGNS_FILE));
  } catch {
    await fs.writeFile(path.join(DATA_DIR, CAMPAIGNS_FILE), '[]');
  }
  
  try {
    await fs.access(path.join(DATA_DIR, GREETINGS_FILE));
  } catch {
    await fs.writeFile(path.join(DATA_DIR, GREETINGS_FILE), '[]');
  }
}

// Campaign storage operations
export async function getCampaigns(): Promise<Campaign[]> {
  await initializeStorage();
  const data = await fs.readFile(path.join(DATA_DIR, CAMPAIGNS_FILE), 'utf-8');
  return JSON.parse(data);
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  const campaigns = await getCampaigns();
  return campaigns.find(c => c.id === id) || null;
}

export async function createCampaign(campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt'>): Promise<Campaign> {
  const campaigns = await getCampaigns();
  const newCampaign: Campaign = {
    ...campaign,
    id: `campaign-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  campaigns.push(newCampaign);
  await fs.writeFile(
    path.join(DATA_DIR, CAMPAIGNS_FILE),
    JSON.stringify(campaigns, null, 2)
  );
  
  return newCampaign;
}

export async function updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
  const campaigns = await getCampaigns();
  const index = campaigns.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  campaigns[index] = {
    ...campaigns[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  await fs.writeFile(
    path.join(DATA_DIR, CAMPAIGNS_FILE),
    JSON.stringify(campaigns, null, 2)
  );
  
  return campaigns[index];
}

// Greeting storage operations
export async function getGreetings(campaignId?: string): Promise<Greeting[]> {
  await initializeStorage();
  const data = await fs.readFile(path.join(DATA_DIR, GREETINGS_FILE), 'utf-8');
  const greetings = JSON.parse(data);
  
  if (campaignId) {
    return greetings.filter((g: Greeting) => g.campaignId === campaignId);
  }
  
  return greetings;
}

export async function createGreeting(greeting: Omit<Greeting, 'id' | 'createdAt'>): Promise<Greeting> {
  const greetings = await getGreetings();
  const newGreeting: Greeting = {
    ...greeting,
    id: `greeting-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  
  greetings.push(newGreeting);
  await fs.writeFile(
    path.join(DATA_DIR, GREETINGS_FILE),
    JSON.stringify(greetings, null, 2)
  );
  
  return newGreeting;
} 