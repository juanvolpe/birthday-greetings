import { NextRequest, NextResponse } from 'next/server';
import { getCampaigns, createCampaign } from '@/utils/storage';
import { sendCampaignNotifications } from '@/utils/email';

export async function GET() {
  try {
    const campaigns = await getCampaigns();
    console.log('API: Fetched campaigns:', campaigns);
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error('API: Error fetching campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { birthdayPerson, gatherer, invitedEmails, name } = body;

    // Validate required fields
    if (!birthdayPerson?.name) {
      return NextResponse.json(
        { error: 'Birthday person name is required' },
        { status: 400 }
      );
    }

    // Create campaign
    const campaign = await createCampaign({
      birthdayPerson,
      gatherer,
      invitedEmails,
      name,
      status: 'collecting',
      createdAt: new Date().toISOString(),
    });

    // Send invitation emails
    if (invitedEmails?.length > 0) {
      await sendCampaignNotifications(campaign);
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
} 