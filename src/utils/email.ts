import { Campaign } from '@/data/mockData';

// In a real app, replace with your email service provider (SendGrid, AWS SES, etc.)
async function sendEmail(to: string, subject: string, content: string) {
  // For development, just log the email
  if (process.env.NODE_ENV !== 'production') {
    console.log('Email would be sent:', { to, subject, content });
    return;
  }

  // TODO: Implement real email sending
  // Example with SendGrid:
  // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({
  //     personalizations: [{ to: [{ email: to }] }],
  //     from: { email: process.env.FROM_EMAIL },
  //     subject,
  //     content: [{ type: 'text/html', value: content }],
  //   }),
  // });
  // return response.ok;
}

export async function sendCampaignNotifications(campaign: Campaign) {
  const { birthdayPerson, gatherer, invitedEmails } = campaign;
  
  // Send confirmation to the gatherer
  await sendEmail(
    gatherer.email,
    'Birthday Campaign Created Successfully',
    `
    <h1>Your Birthday Campaign for ${birthdayPerson.name} has been created!</h1>
    <p>You can now start collecting birthday wishes from friends and family.</p>
    <p>We'll notify the invited people to submit their wishes.</p>
    `
  );

  // Send invitations to friends and family
  for (const email of invitedEmails) {
    await sendEmail(
      email,
      `Contribute to ${birthdayPerson.name}'s Birthday Wishes`,
      `
      <h1>You're invited to share birthday wishes!</h1>
      <p>${gatherer.name} has invited you to contribute to ${birthdayPerson.name}'s birthday wishes.</p>
      <p>Click the link below to submit your message and/or photo:</p>
      <a href="${process.env.NEXT_PUBLIC_BASE_URL}/upload/${campaign.id}">
        Submit Your Birthday Wish
      </a>
      `
    );
  }
} 