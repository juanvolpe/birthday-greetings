import { NextResponse } from 'next/server';
import { greetings } from '@/data/mockData';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const campaignId = searchParams.get('campaignId');
    
    if (campaignId) {
      const filteredGreetings = greetings.filter(g => g.campaignId === campaignId);
      return NextResponse.json(filteredGreetings);
    }
    
    return NextResponse.json(greetings);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch greetings' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const newGreeting = {
      ...data,
      id: `greeting-${greetings.length + 1}`,
      approved: false,
      createdAt: new Date().toISOString(),
    };
    
    greetings.push(newGreeting);
    
    return NextResponse.json(newGreeting, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create greeting' },
      { status: 500 }
    );
  }
} 