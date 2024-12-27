import { NextRequest, NextResponse } from 'next/server';
import { campaigns } from '@/data/mockData';

export async function GET(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
): Promise<NextResponse> {
  try {
    const campaign = campaigns.find(c => c.id === params.campaignId);
    
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(campaign);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch campaign' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { campaignId: string } }
): Promise<NextResponse> {
  try {
    const data = await request.json();
    const campaignIndex = campaigns.findIndex(c => c.id === params.campaignId);
    
    if (campaignIndex === -1) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }
    
    campaigns[campaignIndex] = {
      ...campaigns[campaignIndex],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    
    return NextResponse.json(campaigns[campaignIndex]);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update campaign' },
      { status: 500 }
    );
  }
} 