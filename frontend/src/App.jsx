import { Navigate, Route, Routes } from "react-router"
import LoginPage from "./pages/LoginPage"
import ChatPage from "./pages/ChatPage"
import SignupPage from "./pages/SignupPage"
import { useAuthStore } from "./store/useAuthStore"
import { useEffect } from "react"
import PageLoader from "./components/PageLoader"
import { Toaster } from "react-hot-toast"

const App = () => {
  const {checkAuth, isCheckingAuth, authUser} = useAuthStore();

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (isCheckingAuth) return <PageLoader />;

  return (
    <>
      <Routes>
        <Route path="/" element={authUser ? <ChatPage /> : <Navigate to={"/login"} />} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/signup" element={!authUser ? <SignupPage /> : <Navigate to={"/"} />} />
      </Routes>

      <Toaster />
    </>
  )
}

export default App