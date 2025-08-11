import { Navigate, Route, Routes } from "react-router"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import OnboardingPage from "./pages/OnboardingPage"
import ChatPage from "./pages/ChatPage"
import CallPage from "./pages/CallPage"
import NotificationsPage from "./pages/NotificationsPage"

import { Toaster } from "react-hot-toast"

import PageLoader from "./components/PageLoader.jsx"
import useAuthUser from "./hooks/useAuthUser.js"

const App = () => {

  const {isLoading,authUser} = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if(isLoading) return <PageLoader />

  return (
    <div className="h-screen" data-theme="night">
      <Routes>

        <Route 
          path="/signup" 
          element={
            !isAuthenticated ? <SignUpPage /> : <Navigate to={isOnboarded?'/':'/onboarding'} />
          } 
        />

        <Route 
          path="/login" 
          element={
            !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded?'/':'/onboarding'} />
          } 
        />


        <Route 
          path="/" 
          element={isAuthenticated && isOnboarded?(
              <HomePage />
            ):(
              <Navigate to={isAuthenticated ? '/onboarding' : '/login'}/>
            )
          }
        />
        
        <Route 
          path="/onboarding" 
          element={isAuthenticated?(
              !isOnboarded?(
                <OnboardingPage/>
              ):(
                <Navigate to={'/'} />
              )
            ):(
              <Navigate to={'/login'}/>
            )
          } 
        />

        <Route path="/chat" element={ isAuthenticated ? <ChatPage /> : <Navigate to={'/login'}/>} />
        <Route path="/call" element={ isAuthenticated ? <CallPage /> : <Navigate to={'/login'}/>} />
        <Route path="/notifications" element={ isAuthenticated? <NotificationsPage /> : <Navigate to={'/login'}/>} />
      </Routes>

      <Toaster/>

    </div>
      
  )
}

export default App