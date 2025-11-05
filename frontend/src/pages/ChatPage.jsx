import { useChatStore } from "../store/useChatStore";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactsList from "../components/ContactsList";
import ChatContainer from "../components/ChatContainer";
import NoConverstationContainer from "../components/NoConverstationContainer";

const ChatPage = () => {
  const { activeTab, selectedUser } = useChatStore();
  return (
    <div className="flex flex-row w-full h-svh">
      {/* left side */}
      <div className="bg-slate-800/50 w-80 p-3 flex flex-col backdrop-blur-sm">
        <ProfileHeader />
        <ActiveTabSwitch />
        <div>
          {activeTab === "chats" ? <ChatsList /> : <ContactsList />}
        </div>
      </div>

      {/* right side */}
      <div className="flex flex-col bg-slate-900/50 backdrop-blur-sm flex-1">
        { selectedUser ? <ChatContainer /> : <NoConverstationContainer />}
      </div>
    </div>
  )
}

export default ChatPage