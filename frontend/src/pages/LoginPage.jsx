import { useState } from "react"
import { useAuthStore } from "../store/useAuthStore";
import { MessageCircleIcon, UserIcon, Mail, LoaderIcon, LockIcon } from "lucide-react";
import { Link } from "react-router";

const LoginPage = () => {
  const [formData, setFormData] = useState({email: "", password: ""});
  const {login, isLoggingIn} = useAuthStore()
  
  const handleSubmit = (e) => {
    e.preventDefault();
      
    login(formData);
  };

  return (
    <div className="bg-slate-900 flex flex-row items-center justify-center">
      <div className="flex flex-col items-center justify-center h-screen lg:w-[50%]">

        <div className="flex flex-col items-center space-y-3">
          <MessageCircleIcon className="w-12 h-12" />
          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p>Login to access your account</p>
        </div>
        
        <form onSubmit={handleSubmit} className="mt-6 space-y-5 lg:w-[400px]">

          <div className="flex flex-col">

            <label className="text-sm mb-2">Email</label>

            <div className="flex flex-row items-center justify-start w-full space-x-2 border border-solid border-slate-600 p-3 rounded-sm outline-none">

              <Mail />

              <input type="email" value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="outline-none border-none text-md w-full" placeholder="Enter your email" />

            </div>

          </div>

          <div className="flex flex-col">

            <label className="text-sm mb-2">Password</label>

            <div className="flex flex-row items-center justify-start w-full space-x-2 border border-solid border-slate-600 p-3 rounded-sm outline-none">

              <LockIcon />

              <input type="password" value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="outline-none border-none text-md w-full" placeholder="Enter your password" />

            </div>

          </div>

          <button className="bg-slate-600 p-3 rounded w-full mt-3 cursor-pointer" type="submit" disabled={isLoggingIn}>
            {isLoggingIn ? (
              <LoaderIcon className="w-full h-5 animate-spin text-center" />
            ): "Login"}
          </button>

        </form>

        <div className="mt-6 text-center">
          <Link to="/signup" className="text-sm">
            Don't have an account? Sign up
          </Link>
        </div>

      </div>

      <div className="lg:w-[50%] hidden lg:block">
        <img src="/login.png" alt="signup image" className="w-[700px]" />
      </div>
    </div>
  )
}

export default LoginPage