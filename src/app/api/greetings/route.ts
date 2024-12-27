import { NextRequest, NextResponse } from 'next/server';
import { getGreetings, createGreeting } from '@/utils/storage';

export async function GET(request: NextRequest) {
  try {
    const greetings = await getGreetings();
    return NextResponse.json(greetings);
  } catch (error) {
    console.error('API: Error fetching greetings:', error);
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