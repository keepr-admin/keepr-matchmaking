
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaperclipIcon, Send, Smile } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";

type Message = Tables<"messages">;

interface ChatComponentProps {
  repairId: string;
  isPublic: boolean;
  recipientId?: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({ repairId, isPublic, recipientId }) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch current user and initial messages
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        
        if (!user) {
          console.error('No authenticated user');
          return;
        }

        // Fetch initial messages
        let query = supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true });
          
        if (isPublic) {
          query = query.eq('repair_id', repairId).eq('is_public', true);
        } else if (recipientId) {
          query = query.eq('repair_id', repairId)
            .eq('is_public', false)
            .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          console.error('Error fetching messages:', error);
          return;
        }
        
        if (data) {
          setMessages(data);
          
          // Get unique user IDs to fetch profiles
          const userIds = [...new Set(data.map(msg => msg.sender_id))];
          
          // Fetch all relevant profiles
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', userIds);
            
          if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
          } else if (profilesData) {
            // Convert to a map for easier lookup
            const profilesMap: Record<string, any> = {};
            profilesData.forEach(profile => {
              profilesMap[profile.id] = profile;
            });
            setProfiles(profilesMap);
          }
        }
      } catch (error) {
        console.error('Error in fetchInitialData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitialData();
  }, [repairId, isPublic, recipientId]);

  // Subscribe to new messages
  useEffect(() => {
    if (!user) return;
    
    const channel = supabase
      .channel('realtime-messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: isPublic 
          ? `repair_id=eq.${repairId}` 
          : `repair_id=eq.${repairId}`,
      }, async (payload) => {
        const newMessage = payload.new as Message;
        
        // Only add message if it matches our criteria (public/private)
        if (
          (isPublic && newMessage.is_public) || 
          (!isPublic && !newMessage.is_public && 
            (newMessage.sender_id === user.id || newMessage.recipient_id === user.id))
        ) {
          // Check if we already have the sender's profile
          if (!profiles[newMessage.sender_id]) {
            // Fetch the sender's profile
            const { data, error } = await supabase
              .from('profiles')
              .select('id, first_name, last_name')
              .eq('id', newMessage.sender_id)
              .single();
              
            if (!error && data) {
              setProfiles(prev => ({
                ...prev,
                [data.id]: data
              }));
            }
          }
          
          // Add the new message
          setMessages(prevMessages => [...prevMessages, newMessage]);
        }
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [repairId, isPublic, recipientId, user, profiles]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !user) return;
    
    try {
      const message = {
        sender_id: user.id,
        repair_id: repairId,
        recipient_id: isPublic ? null : recipientId,
        is_public: isPublic,
        content: newMessage.trim()
      };
      
      const { error } = await supabase
        .from('messages')
        .insert(message);
        
      if (error) {
        console.error('Error sending message:', error);
        return;
      }
      
      // Clear input
      setNewMessage("");
    } catch (error) {
      console.error('Error in handleSendMessage:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get user initials for avatar fallback
  const getUserInitials = (userId: string) => {
    const profile = profiles[userId];
    if (!profile) return "?";
    
    const firstName = profile.first_name || "";
    const lastName = profile.last_name || "";
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  // Get user name
  const getUserName = (userId: string) => {
    const profile = profiles[userId];
    if (!profile) return "Unknown User";
    
    return `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "User";
  };

  // Check if message is from the current user
  const isOwnMessage = (senderId: string) => {
    return user && senderId === user.id;
  };

  // Format message timestamp
  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-keepr-green-500"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-keepr-green-100 p-4 rounded-full mb-4">
              <Send className="h-8 w-8 text-keepr-green-500" />
            </div>
            <h3 className="text-lg font-medium text-keepr-green-800">No messages yet</h3>
            <p className="text-sm text-keepr-green-600 max-w-md mt-1">
              {isPublic 
                ? "Be the first to send a message in this public thread!"
                : "Start a conversation about this repair request."}
            </p>
          </div>
        ) : (
          messages.map((message) => {
            const own = isOwnMessage(message.sender_id);
            
            return (
              <div 
                key={message.message_id} 
                className={`flex ${own ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex ${own ? 'flex-row-reverse' : 'flex-row'} items-end gap-2 max-w-[80%]`}>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={`/avatar/${message.sender_id}`} />
                    <AvatarFallback className="bg-keepr-green-200 text-keepr-green-800">
                      {getUserInitials(message.sender_id)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className={`flex flex-col ${own ? 'items-end' : 'items-start'}`}>
                    {!own && (
                      <span className="text-xs text-gray-500 ml-2 mb-1">
                        {getUserName(message.sender_id)}
                      </span>
                    )}
                    <div className={`
                      rounded-lg py-2 px-3 inline-block
                      ${own 
                        ? 'bg-keepr-green-500 text-white rounded-tr-none' 
                        : 'bg-gray-100 text-gray-800 rounded-tl-none'}
                    `}>
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 mx-2">
                      {formatMessageTime(message.created_at)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-4">
        <div className="flex items-end gap-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="flex-1 min-h-[80px] max-h-[160px]"
            disabled={!user}
          />
          <div className="flex flex-col gap-2">
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              className="rounded-full text-keepr-green-600 hover:text-keepr-green-800 hover:bg-keepr-green-100"
            >
              <PaperclipIcon className="h-5 w-5" />
              <span className="sr-only">Attach file</span>
            </Button>
            <Button 
              type="button" 
              size="icon" 
              variant="ghost" 
              className="rounded-full text-keepr-green-600 hover:text-keepr-green-800 hover:bg-keepr-green-100"
            >
              <Smile className="h-5 w-5" />
              <span className="sr-only">Add emoji</span>
            </Button>
            <Button 
              type="button" 
              size="icon" 
              onClick={handleSendMessage}
              disabled={!newMessage.trim() || !user}
              className="rounded-full bg-keepr-green-500 hover:bg-keepr-green-600 text-white"
            >
              <Send className="h-5 w-5" />
              <span className="sr-only">Send message</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatComponent;
