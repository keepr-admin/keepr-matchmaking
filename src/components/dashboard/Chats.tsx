
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CircleUserRound, MessageSquare, Search } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import ChatComponent from "@/components/chat/ChatComponent";
import { supabase } from "@/integrations/supabase/client";

const Chats = () => {
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUserAndChats = async () => {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
          console.error('No authenticated user');
          navigate('/');
          return;
        }
        
        setUser(user);
        
        // Fetch all repair requests the user is involved with
        const { data: repairData, error: repairError } = await supabase
          .from('repair_requests')
          .select(`
            repair_id,
            description,
            status,
            created_at,
            user_id,
            product_id,
            products (
              product_id,
              brand,
              model,
              type
            )
          `)
          .or(`user_id.eq.${user.id}`)
          .order('created_at', { ascending: false });
          
        if (repairError) {
          console.error('Error fetching repairs:', repairError);
          return;
        }
        
        if (repairData) {
          // For each repair request, check if there are any messages
          const chatsWithMessages = await Promise.all(
            repairData.map(async (repair) => {
              const { data: messages, error: messagesError } = await supabase
                .from('messages')
                .select('*')
                .eq('repair_id', repair.repair_id)
                .eq('is_public', false)
                .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
                .order('created_at', { ascending: false })
                .limit(1);
                
              if (messagesError) {
                console.error('Error fetching messages:', messagesError);
                return null;
              }
              
              if (messages && messages.length > 0) {
                // Get the other user involved in the chat
                const otherUserId = messages[0].sender_id === user.id 
                  ? messages[0].recipient_id 
                  : messages[0].sender_id;
                  
                if (otherUserId) {
                  // Fetch the profile of the other user
                  const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('id, first_name, last_name')
                    .eq('id', otherUserId)
                    .single();
                    
                  if (profileError) {
                    console.error('Error fetching profile:', profileError);
                  }
                  
                  return {
                    repair,
                    lastMessage: messages[0],
                    otherUser: profile || { id: otherUserId },
                  };
                }
              }
              
              return null;
            })
          );
          
          // Filter out null values and set chats
          setChats(chatsWithMessages.filter(Boolean));
        }
      } catch (error) {
        console.error('Error in fetchUserAndChats:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserAndChats();
  }, [navigate]);
  
  // Filter chats based on search query
  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true;
    
    const otherUserName = chat.otherUser 
      ? `${chat.otherUser.first_name || ''} ${chat.otherUser.last_name || ''}`.trim()
      : '';
      
    const productInfo = chat.repair.products 
      ? `${chat.repair.products.brand || ''} ${chat.repair.products.model || ''} ${chat.repair.products.type || ''}`.trim()
      : '';
      
    const searchLower = searchQuery.toLowerCase();
    
    return (
      otherUserName.toLowerCase().includes(searchLower) ||
      productInfo.toLowerCase().includes(searchLower) ||
      chat.repair.description.toLowerCase().includes(searchLower)
    );
  });
  
  // Format date to display relative time (e.g., "2 days ago")
  const formatRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      // More than a week ago - show date
      return date.toLocaleDateString();
    }
  };
  
  // Get user initials for avatar fallback
  const getUserInitials = (userObj: any) => {
    if (!userObj || (!userObj.first_name && !userObj.last_name)) {
      return "?";
    }
    
    const firstName = userObj.first_name || "";
    const lastName = userObj.last_name || "";
    
    return `${firstName.charAt(0)}${lastName.charAt(0)}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-keepr-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-keepr-green-800">Chats</h1>
        <p className="text-keepr-green-600">
          Communicate with repairers and people seeking repairs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-220px)]">
        {/* Chat List */}
        <div className="md:col-span-1 flex flex-col border rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input 
                className="pl-9"
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {filteredChats.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <MessageSquare className="h-12 w-12 text-keepr-green-300 mb-4" />
              <h3 className="text-lg font-medium text-keepr-green-700">No conversations yet</h3>
              <p className="text-sm text-keepr-green-600 mt-1">
                {searchQuery 
                  ? "No chats matching your search"
                  : "Start chatting with repairers or people needing repairs"}
              </p>
            </div>
          ) : (
            <ScrollArea className="flex-1">
              <div className="divide-y">
                {filteredChats.map((chat) => (
                  <div 
                    key={`${chat.repair.repair_id}-${chat.otherUser?.id}`}
                    className={`
                      p-4 hover:bg-keepr-green-50 cursor-pointer transition-colors
                      ${activeChat === `${chat.repair.repair_id}-${chat.otherUser?.id}` ? 'bg-keepr-green-100' : ''}
                    `}
                    onClick={() => setActiveChat(`${chat.repair.repair_id}-${chat.otherUser?.id}`)}
                  >
                    <div className="flex items-start gap-3">
                      <Avatar>
                        <AvatarImage src={`/avatar/${chat.otherUser?.id}`} />
                        <AvatarFallback className="bg-keepr-green-200 text-keepr-green-800">
                          {getUserInitials(chat.otherUser)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium text-keepr-green-800 truncate">
                            {chat.otherUser?.first_name 
                              ? `${chat.otherUser.first_name} ${chat.otherUser.last_name}`
                              : "Unknown User"}
                          </h4>
                          <span className="text-xs text-keepr-green-600 whitespace-nowrap ml-2">
                            {formatRelativeTime(chat.lastMessage.created_at)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-keepr-green-600 truncate">
                          {chat.repair.products ? (
                            <span className="font-medium">
                              {chat.repair.products.type}: {chat.repair.products.brand} {chat.repair.products.model}
                            </span>
                          ) : (
                            <span className="font-medium">Unknown device</span>
                          )}
                        </p>
                        
                        <p className="text-xs text-keepr-green-500 truncate mt-1">
                          {chat.lastMessage.sender_id === user.id ? 'You: ' : ''}
                          {chat.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
        
        {/* Chat Window */}
        <div className="md:col-span-2 border rounded-lg flex flex-col">
          {activeChat ? (
            (() => {
              const [repairId, otherUserId] = activeChat.split('-');
              return (
                <ChatComponent 
                  key={activeChat}
                  repairId={repairId} 
                  isPublic={false} 
                  recipientId={otherUserId} 
                />
              );
            })()
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <CircleUserRound className="h-16 w-16 text-keepr-green-300 mb-4" />
              <h3 className="text-lg font-medium text-keepr-green-700">Select a conversation</h3>
              <p className="text-sm text-keepr-green-600 max-w-md mt-1">
                Choose a chat from the list to view your conversation history.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chats;
