import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/utils/supabase-client';

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { url, prompt } = await req.json();

  const supabase = createClient();

  try {
    // Add the image URL to the 'emojis' data table
    const { data: emojiData, error: emojiError } = await supabase
      .from('emojis')
      .insert({
        image_url: url,
        prompt: prompt,
        creator_user_id: userId
      })
      .select();

    if (emojiError) {
      throw new Error('Failed to add emoji to database');
    }

    return NextResponse.json({ emoji: emojiData[0] });
  } catch (error) {
    console.error('Error saving emoji:', error);
    return NextResponse.json({ error: 'Failed to save emoji' }, { status: 500 });
  }
}
