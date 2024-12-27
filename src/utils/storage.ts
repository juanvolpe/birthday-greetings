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
  } catch (error) {
    console.log('Creating data directory:', DATA_DIR);
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Initialize storage files if they don't exist
async function initializeStorage() {
  await ensureDataDir();
  
  try {
    await fs.access(path.join(DATA_DIR, CAMPAIGNS_FILE));
  } catch (error) {
    console.log('Creating campaigns file:', path.join(DATA_DIR, CAMPAIGNS_FILE));
    await fs.writeFile(path.join(DATA_DIR, CAMPAIGNS_FILE), '[]');
  }
  
  try {
    await fs.access(path.join(DATA_DIR, GREETINGS_FILE));
  } catch (error) {
    console.log('Creating greetings file:', path.join(DATA_DIR, GREETINGS_FILE));
    await fs.writeFile(path.join(DATA_DIR, GREETINGS_FILE), '[]');
  }
}

// Campaign storage operations
export async function getCampaigns(): Promise<Campaign[]> {
  try {
    await initializeStorage();
    const data = await fs.readFile(path.join(DATA_DIR, CAMPAIGNS_FILE), 'utf-8');
    console.log('Read campaigns:', data);
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading campaigns:', error);
    return [];
  }
}

export async function getCampaignById(id: string): Promise<Campaign | null> {
  try {
    const campaigns = await getCampaigns();
    return campaigns.find(c => c.id === id) || null;
  } catch (error) {
    console.error('Error getting campaign by ID:', error);
    return null;
  }
}

export async function createCampaign(campaign: Omit<Campaign, 'id' | 'createdAt' | 'updatedAt' | 'status'>): Promise<Campaign> {
  try {
    const campaigns = await getCampaigns();
    const newCampaign: Campaign = {
      ...campaign,
      id: `campaign-${Date.now()}`,
      status: 'collecting',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    campaigns.push(newCampaign);
    console.log('Writing campaigns:', JSON.stringify(campaigns, null, 2));
    await fs.writeFile(
      path.join(DATA_DIR, CAMPAIGNS_FILE),
      JSON.stringify(campaigns, null, 2)
    );
    
    return newCampaign;
  } catch (error) {
    console.error('Error creating campaign:', error);
    throw error;
  }
}

export async function updateCampaign(id: string, updates: Partial<Campaign>): Promise<Campaign | null> {
  try {
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
  } catch (error) {
    console.error('Error updating campaign:', error);
    return null;
  }
}

// Greeting storage operations
export async function getGreetings(campaignId?: string): Promise<Greeting[]> {
  try {
    await initializeStorage();
    const data = await fs.readFile(path.join(DATA_DIR, GREETINGS_FILE), 'utf-8');
    const greetings = JSON.parse(data);
    
    if (campaignId) {
      return greetings.filter((g: Greeting) => g.campaignId === campaignId);
    }
    
    return greetings;
  } catch (error) {
    console.error('Error getting greetings:', error);
    return [];
  }
}

export async function createGreeting(greeting: Omit<Greeting, 'id' | 'createdAt'>): Promise<Greeting> {
  try {
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
  } catch (error) {
    console.error('Error creating greeting:', error);
    throw error;
  }
}

export async function deleteCampaign(id: string): Promise<void> {
  try {
    const campaigns = await getCampaigns();
    const greetings = await getGreetings();
    
    // Remove the campaign
    const updatedCampaigns = campaigns.filter(c => c.id !== id);
    
    // Remove associated greetings
    const updatedGreetings = greetings.filter(g => g.campaignId !== id);
    
    // Save updated data
    await fs.writeFile(
      path.join(DATA_DIR, CAMPAIGNS_FILE),
      JSON.stringify(updatedCampaigns, null, 2)
    );
    
    await fs.writeFile(
      path.join(DATA_DIR, GREETINGS_FILE),
      JSON.stringify(updatedGreetings, null, 2)
    );
  } catch (error) {
    console.error('Error deleting campaign:', error);
    throw error;
  }
} 