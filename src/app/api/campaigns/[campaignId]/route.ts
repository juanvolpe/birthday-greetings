import { NextRequest, NextResponse } from 'next/server';
import { campaigns } from '@/data/mockData';

type Props = {
  params: {
    campaignId: string;
  };
};

export async function GET(_: NextRequest, props: Props) {
  try {
    const campaign = campaigns.find(c => c.id === props.params.campaignId);
    
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

export async function PATCH(request: NextRequest, props: Props) {
  try {
    const data = await request.json();
    const campaignIndex = campaigns.findIndex(c => c.id === props.params.campaignId);
    
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