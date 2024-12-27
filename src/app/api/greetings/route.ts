import { NextRequest, NextResponse } from 'next/server';
import { getGreetings, createGreeting } from '@/utils/storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const campaignId = searchParams.get('campaignId');
    const greetingsList = await getGreetings(campaignId || undefined);
    return NextResponse.json(greetingsList);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch greetings' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const newGreeting = await createGreeting(data);
    return NextResponse.json(newGreeting, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create greeting' },
      { status: 500 }
    );
  }
} 