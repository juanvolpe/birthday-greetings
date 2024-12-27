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
    const data = await request.json();
    console.log('API: Creating campaign with data:', data);
    
    // Validate required fields
    if (!data.birthdayPerson || !data.birthdayPerson.name) {
      return NextResponse.json(
        { error: 'Birthday person name is required' },
        { status: 400 }
      );
    }

    if (!data.gatherer || !data.gatherer.name || !data.gatherer.email) {
      return NextResponse.json(
        { error: 'Gatherer name and email are required' },
        { status: 400 }
      );
    }

    const newCampaign = await createCampaign(data);
    console.log('API: Created campaign:', newCampaign);

    // Send email notifications
    try {
      await sendCampaignNotifications(newCampaign);
      console.log('API: Sent campaign notifications');
    } catch (emailError) {
      console.error('API: Error sending notifications:', emailError);
      // Continue even if email sending fails
    }

    return NextResponse.json(newCampaign, { status: 201 });
  } catch (error) {
    console.error('API: Error creating campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create campaign' },
      { status: 500 }
    );
  }
} 