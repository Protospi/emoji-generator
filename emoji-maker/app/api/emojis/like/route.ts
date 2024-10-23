import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@/utils/supabase-client';

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { emojiId, action } = await req.json();

  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('emojis')
      .update({ likes_count: supabase.rpc('increment_likes', { row_id: emojiId, inc_amount: action === 'like' ? 1 : -1 }) })
      .eq('id', emojiId)
      .select();

    if (error) {
      throw new Error('Failed to update likes count');
    }

    return NextResponse.json({ emoji: data[0] });
  } catch (error) {
    console.error('Error updating likes count:', error);
    return NextResponse.json({ error: 'Failed to update likes count' }, { status: 500 });
  }
}
