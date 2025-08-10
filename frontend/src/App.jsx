import { Navigate, Route, Routes } from "react-router"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import OnboardingPage from "./pages/OnboardingPage"
import ChatPage from "./pages/ChatPage"
import CallPage from "./pages/CallPage"
import NotificationsPage from "./pages/NotificationsPage"
import { useQuery } from "@tanstack/react-query"
import { Toaster } from "react-hot-toast"
import {axiosInstance} from "./lib/axios.js"
import PageLoader from "./components/PageLoader.jsx"

const App = () => {

  const {data:authData, isLoading} = useQuery({
      queryKey: ['authUser'],
      queryFn: async ()=>{
        const res = await axiosInstance.get('/auth/me');
        return res.data;
      },
      retry: false
  })

  const authUser = authData?.user;

  if(isLoading) return <PageLoader />

  return (
    <div className="h-screen" data-theme="night">
      <Routes>
        <Route path="/" element={authUser? <HomePage /> : <Navigate to={'/login'}/>} />
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={'/'} />} />
        <Route path="/signup" element={!authUser ? <SignUpPage /> : <Navigate to={'/'} />} />
        <Route path="/onboarding" element={ authUser ? <OnboardingPage /> : <Navigate to={'/'} />} />
        <Route path="/chat" element={ authUser ? <ChatPage /> : <Navigate to={'/login'}/>} />
        <Route path="/call" element={ authUser ? <CallPage /> : <Navigate to={'/login'}/>} />
        <Route path="/notifications" element={ authUser? <NotificationsPage /> : <Navigate to={'/login'}/>} />
      </Routes>

      <Toaster/>

    </div>
      
  )
}

export default App