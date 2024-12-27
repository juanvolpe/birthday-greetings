import { Campaign } from '@/data/mockData';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

async function sendEmail(to: string, subject: string, content: string) {
  try {
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
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 30px 20px; border-radius: 10px; margin-bottom: 30px; }
            .header h1 { color: white; margin: 0; font-size: 24px; text-align: center; }
            .content { background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .button { display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: #ffffff !important; text-decoration: none; padding: 12px 25px; border-radius: 5px; margin-top: 20px; font-weight: 500; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Birthday Campaign Created!</h1>
            </div>
            <div class="content">
              <h2>Great news, ${gatherer.name}!</h2>
              <p>Your birthday campaign for <strong>${birthdayPerson.name}</strong> has been created successfully.</p>
              <p>We'll notify all invited guests to submit their birthday wishes.</p>
              <p>You can track all responses and monitor the campaign progress using the link below:</p>
              <center>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/status/${campaign.id}" class="button">
                  View Campaign Status
                </a>
              </center>
            </div>
            <div class="footer">
              <p>This email was sent by Birthday Joy - Making celebrations special!</p>
            </div>
          </div>
        </body>
        </html>
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
        `Join ${birthdayPerson.name}'s Birthday Celebration! 🎂`,
        `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #4F46E5, #7C3AED); padding: 30px 20px; border-radius: 10px; margin-bottom: 30px; }
            .header h1 { color: white; margin: 0; font-size: 24px; text-align: center; }
            .content { background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .button { display: inline-block; background: linear-gradient(135deg, #4F46E5, #7C3AED); color: white; text-decoration: none; padding: 12px 25px; border-radius: 5px; margin-top: 20px; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .highlight { color: #4F46E5; font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎈 You're Invited!</h1>
            </div>
            <div class="content">
              <h2>Help Make This Birthday Special!</h2>
              <p><span class="highlight">${gatherer.name}</span> has invited you to be part of <span class="highlight">${birthdayPerson.name}'s</span> birthday celebration!</p>
              <p>Share your special message and photos to create a memorable collection of birthday wishes.</p>
              <p>It only takes a minute to contribute your wishes:</p>
              <center>
                <a href="${process.env.NEXT_PUBLIC_BASE_URL}/upload/${campaign.id}" class="button">
                  Submit Your Birthday Wish
                </a>
              </center>
            </div>
            <div class="footer">
              <p>This invitation was sent by Birthday Joy on behalf of ${gatherer.name}</p>
              <p>Making celebrations special, one wish at a time! 🎉</p>
            </div>
          </div>
        </body>
        </html>
        `
      );
    } catch (error) {
      console.error(`Failed to send invitation to ${email}:`, error);
      // Continue with other emails even if one fails
    }
  }
} 