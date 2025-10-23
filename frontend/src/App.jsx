import { Route, Routes } from "react-router"
import LoginPage from "./pages/LoginPage"
import ChatPage from "./pages/ChatPage"
import SignupPage from "./pages/SignupPage"

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<ChatPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  )
}

export default App