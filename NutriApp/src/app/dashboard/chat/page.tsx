'use client';

import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  'How many calories did I eat yesterday?',
  'Am I hitting my protein goals?',
  'Suggest a high-protein lunch.',
  'Why is my weight stalling?',
  'Analyze my recent eating habits.'
];

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm NutriAI. I've analyzed your profile and recent logs. Ask me anything about your diet, progress, or what to eat next!"
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { role: 'user', content: text };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Send the entire conversation history context, but maybe limit it if it gets too long
      // For now, sending all messages (except the initial greeting if we want strictness, but greeting is fine)
      const conversation = [...messages, userMsg].filter(
        (m) =>
          m.role !== 'assistant' ||
          m.content !== messages[0].content ||
          messages.length > 1
      );
      // Actually, passing the full history is better for context.

      const payload = [...messages, userMsg];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: payload })
      });

      if (!res.ok) throw new Error('Failed to fetch response');

      const data = await res.json();

      const botMsg: Message = { role: 'assistant', content: data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      toast('Something went wrong. Please try again.');
      // Ideally remove the user message or show error state, but toast is okay for now.
    } finally {
      setIsLoading(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className='flex h-full flex-col space-y-4 p-4 pt-6 md:p-8'>
      <div className='flex items-center space-x-2'>
        <Sparkles className='text-primary h-6 w-6' />
        <h2 className='text-3xl font-bold tracking-tight'>NutriAI Chat</h2>
      </div>
      <p className='text-muted-foreground'>
        Chat with your personal AI nutritionist. It knows your stats and logs!
      </p>

      <Card className='border-muted bg-background/50 flex flex-1 flex-col overflow-hidden backdrop-blur-sm'>
        <ScrollArea className='flex-1 p-4'>
          <div className='space-y-4'>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex w-full ${
                  m.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`flex max-w-[80%] items-start gap-4 rounded-2xl p-4 ${
                    m.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-sm'
                      : 'bg-muted text-foreground rounded-tl-sm'
                  }`}
                >
                  {m.role === 'assistant' && (
                    <Bot className='mt-1 h-5 w-5 shrink-0' />
                  )}
                  <div className='prose dark:prose-invert max-w-none break-words'>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.content}</ReactMarkdown>
                  </div>
                  {m.role === 'user' && (
                    <User className='mt-1 h-5 w-5 shrink-0' />
                  )}
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className='flex justify-start'>
                <div className='bg-muted text-muted-foreground flex items-center gap-2 rounded-2xl rounded-tl-sm p-4'>
                  <Bot className='h-5 w-5' />
                  <div className='flex items-center gap-1'>
                    <span className='h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.32s]'></span>
                    <span className='h-1.5 w-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.16s]'></span>
                    <span className='h-1.5 w-1.5 animate-bounce rounded-full bg-current'></span>
                  </div>
                </div>
              </div>
            )}

            <div ref={scrollRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className='bg-background/50 border-t p-4'>
          {/* Suggested Questions */}
          {messages.length < 3 && !isLoading && (
            <div className='scrollbar-none mb-4 flex gap-2 overflow-x-auto pb-2'>
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <Button
                  key={i}
                  variant='outline'
                  size='sm'
                  className='border-primary/20 hover:bg-primary/10 hover:text-primary rounded-full whitespace-nowrap transition-colors'
                  onClick={() => handleSend(q)}
                >
                  {q}
                </Button>
              ))}
            </div>
          )}

          <div className='flex gap-2'>
            <Input
              placeholder='Ask about your nutrition...'
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={isLoading}
              className='flex-1'
            />
            <Button
              onClick={() => handleSend(input)}
              disabled={isLoading || !input.trim()}
              size='icon'
            >
              {isLoading ? (
                <Loader2 className='h-4 w-4 animate-spin' />
              ) : (
                <Send className='h-4 w-4' />
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
