import { NextRequest, NextResponse } from 'next/server';
import { getCampaignById, updateCampaign } from '@/utils/storage';
import { sendCampaignNotifications } from '@/utils/email';

export async function POST(request: NextRequest) {
  try {
    const campaignId = request.url.split('/').slice(-2)[0];
    const { emails } = await request.json() as { emails: string[] };

    // Get existing campaign
    const campaign = await getCampaignById(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { error: 'Campaign not found' },
        { status: 404 }
      );
    }

    // Add new emails to the campaign
    const emailSet = new Set([...campaign.invitedEmails, ...emails]);
    const updatedEmails = Array.from(emailSet);
    const updatedCampaign = await updateCampaign(campaignId, {
      ...campaign,
      invitedEmails: updatedEmails
    });

    if (!updatedCampaign) {
      throw new Error('Failed to update campaign');
    }

    // Send invitations only to new emails
    const newEmails = emails.filter((email: string) => !campaign.invitedEmails.includes(email));
    if (newEmails.length > 0) {
      await sendCampaignNotifications({
        ...updatedCampaign,
        invitedEmails: newEmails
      });
    }

    return NextResponse.json(updatedCampaign);
  } catch (error) {
    console.error('API: Error adding invitees:', error);
    return NextResponse.json(
      { error: 'Failed to add invitees' },
      { status: 500 }
    );
  }
} 