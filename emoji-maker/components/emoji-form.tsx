import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';

export function EmojiForm({ onGenerate }: { onGenerate: (prompt: string) => void }) {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(prompt);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Enter a prompt to generate an emoji"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <Button type="submit">Generate</Button>
    </form>
  );
}
