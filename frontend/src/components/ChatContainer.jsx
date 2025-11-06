import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore"
import { useChatStore } from "../store/useChatStore"
import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";

const ChatContainer = () => {
  const {selectedUser, getMessagesByUserId, messages, isMessagesLoading, subscribeToMessages, unSubscribeFromMessages} = useChatStore();
  const {authUser} = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    subscribeToMessages()

    return () => unSubscribeFromMessages()
  }, [selectedUser, getMessagesByUserId, subscribeToMessages, unSubscribeFromMessages]);

  useEffect(() => {
    if(messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth"});
    }
  })

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map(msg => (
              <div key={msg._id}
                className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}
              >
                <div className={`chat-bubble rounded-t-3xl ${msg.senderId === authUser._id ? "bg-cyan-600 text-white rounded-bl-3xl" : "bg-slate-800 text-slate-200 rounded-br-3xl"}`}>
                  {msg.image && (
                    <img src={msg.image} alt="image" className="rounded-lg h-48 object-cover" />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? <MessagesLoadingSkeleton /> : (
          <NoChatHistoryPlaceholder name={selectedUser.username} />
        )}
      </div>

      <MessageInput />
    </>
  )
}

export default ChatContainer