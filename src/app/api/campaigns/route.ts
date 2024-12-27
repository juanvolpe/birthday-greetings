import { NextRequest, NextResponse } from 'next/server';
import { campaigns } from '@/data/mockData';

export async function GET(
  request: NextRequest
): Promise<NextResponse> {
  try {
    return NextResponse.json(campaigns);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const data = await request.json();
    const newCampaign = {
      ...data,
      id: `campaign-${campaigns.length + 1}`,
      status: 'collecting',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    campaigns.push(newCampaign);
    
    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
} 