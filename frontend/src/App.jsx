import { Navigate, Route, Routes } from "react-router"

import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import SignUpPage from "./pages/SignUpPage"
import OnboardingPage from "./pages/OnboardingPage"
import ChatPage from "./pages/ChatPage"
import CallPage from "./pages/CallPage"
import NotificationsPage from "./pages/NotificationsPage"
import FriendsPage from "./pages/FriendsPage"

import { Toaster } from "react-hot-toast"

import PageLoader from "./components/PageLoader.jsx"
import useAuthUser from "./hooks/useAuthUser.js"
import Layout from "./components/Layout.jsx"
import { useThemeStore } from "./store/useThemeStore.js"

const App = () => {

  const {isLoading,authUser} = useAuthUser();

  const {theme} = useThemeStore();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  if(isLoading) return <PageLoader />

  return (
    <div className="h-screen" data-theme={theme}>
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
              <Layout showSidebar>
                <HomePage />
              </Layout>
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

        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        
        <Route 
          path="/notifications" 
          element={ isAuthenticated && isOnboarded ? (
              <Layout  showSidebar>
                <NotificationsPage/>
              </Layout>
            ):(
              <Navigate to={!isAuthenticated?"/login":"/onboarding"}/>
            )
          }
        />

        <Route 
          path="/friends" 
          element={ isAuthenticated && isOnboarded ? (
              <Layout  showSidebar>
                <FriendsPage/>
              </Layout>
            ):(
              <Navigate to={!isAuthenticated?"/login":"/onboarding"}/>
            )
          }
        />
      </Routes>

      <Toaster/>

    </div>
      
  )
}

export default App