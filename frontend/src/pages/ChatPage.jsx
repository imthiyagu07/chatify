import { useChatStore } from "../store/ueChatStore";
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
      <div className="bg-slate-900 w-[20%] p-5">
        <ProfileHeader />
        <ActiveTabSwitch />
        <div>
          {activeTab === "chats" ? <ChatsList /> : <ContactsList />}
        </div>
      </div>

      {/* right side */}
      <div className="bg-slate-950 w-[80%] p-5">
        { selectedUser ? <ChatContainer /> : <NoConverstationContainer />}
      </div>
    </div>
  )
}

export default ChatPage