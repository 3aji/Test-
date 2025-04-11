'use client';

import {useState, useEffect, useRef} from 'react';
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Textarea} from '@/components/ui/textarea';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from '@/components/ui/card';
import {cn} from '@/lib/utils';
import {getSmartReplySuggestions} from '@/ai/flows/smart-reply-suggestions';
import {moderateContent} from '@/ai/flows/content-moderation';
import {useToast} from '@/hooks/use-toast';
import {Icons} from './icons';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const {toast} = useToast();

  useEffect(() => {
    // Scroll to bottom on new messages
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;

    // Content moderation check
    const moderationResult = await moderateContent({text: newMessage});
    if (!moderationResult.isSafe) {
      toast({
        variant: 'destructive',
        title: 'Message blocked',
        description: moderationResult.reason || 'Inappropriate content detected.',
      });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: newMessage,
    };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setNewMessage('');

    // Generate smart replies
    const messageHistory = messages.map(msg => msg.text);
    const replySuggestions = await getSmartReplySuggestions({
      messageHistory: [...messageHistory, newMessage],
      currentMessage: newMessage,
    });
    setSuggestions(replySuggestions.suggestions);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setNewMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-full w-full">
      <Card className="flex-1 overflow-hidden">
        <CardHeader>
          <CardTitle>YoloMAMEN</CardTitle>
        </CardHeader>
        <CardContent className="overflow-y-auto h-full" ref={chatContainerRef}>
          <div className="flex flex-col space-y-4 p-4">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex items-start ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'ai' && (
                  <Avatar className="mr-2">
                    <AvatarImage src="https://picsum.photos/50/50" alt="AI Avatar" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'rounded-lg p-3 text-sm',
                    message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                  )}
                >
                  {message.text}
                </div>
                {message.sender === 'user' && (
                  <Avatar className="ml-2">
                    <AvatarImage src="https://picsum.photos/50/50" alt="User Avatar" />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="flex gap-2 overflow-x-auto">
            {suggestions.map((suggestion, index) => (
              <Button key={index} variant="outline" size="sm" onClick={() => handleSuggestionClick(suggestion)}>
                {suggestion}
              </Button>
            ))}
          </div>
          <div className="flex items-center space-x-2">
            <Textarea
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 resize-none"
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button onClick={handleSendMessage} aria-label="Send message">
              <Icons.arrowRight />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ChatInterface;
