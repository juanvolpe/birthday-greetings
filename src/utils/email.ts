import { Campaign } from '@/data/mockData';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Use the App Password here
  },
});

async function sendEmail(to: string, subject: string, content: string) {
  try {
    if (process.env.NODE_ENV !== 'production') {
      console.log('Email would be sent:', { to, subject, content });
      return;
    }

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to,
      subject,
      html: content,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function sendCampaignNotifications(campaign: Campaign) {
  const { birthdayPerson, gatherer, invitedEmails } = campaign;
  
  // Send confirmation to the gatherer only if email is provided
  if (gatherer.email) {
    try {
      await sendEmail(
        gatherer.email,
        'Birthday Campaign Created Successfully',
        `
        <h1>Your Birthday Campaign for ${birthdayPerson.name} has been created!</h1>
        <p>You can now start collecting birthday wishes from friends and family.</p>
        <p>We'll notify the invited people to submit their wishes.</p>
        <p>You can track the responses here: ${process.env.NEXT_PUBLIC_BASE_URL}/status/${campaign.id}</p>
        `
      );
    } catch (error) {
      console.error('Failed to send gatherer notification:', error);
      // Continue with other notifications even if gatherer email fails
    }
  }

  // Send invitations to friends and family
  for (const email of invitedEmails) {
    try {
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
    } catch (error) {
      console.error(`Failed to send invitation to ${email}:`, error);
      // Continue with other emails even if one fails
    }
  }
} 