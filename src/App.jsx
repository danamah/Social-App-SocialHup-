import { createBrowserRouter, Outlet, RouterProvider } from "react-router"
import { Bounce, ToastContainer } from "react-toastify"
import AuthLayout from "./components/Layouts/AuthLayOut"
import MainLayout from "./components/Layouts/MainLayOut"
import LoginPage from "./components/pages/Auth/LoginPage/LoginPage"
import SignupPage from "./components/pages/Auth/SignupPage/SignupPage"
import CommunityPage from "./components/pages/Community/CommunityPage"
import DiffUserProfile from "./components/pages/DffUserProfile/DiffUserProfile"
import ExplorePage from "./components/pages/Explore/ExplorePage"
import NewsFeed from "./components/pages/NewsFeed/NewsFeed"
import NotFoundPage from "./components/pages/NotFoundPage/NotFoundPage"
import NotificationsPage from "./components/pages/Notifications/NotificationsPage"
import PostDetailsPage from "./components/pages/PostDetialsPage/PostDetailsPage"
import { default as UserProfile, default as UserProfilePage } from "./components/pages/UserProfile/UserProfilePage"
import AppProtectedRoutes from "./components/ProtectedRoutes/AppProtectedRoute"
import AuthProtectedRoutes from "./components/ProtectedRoutes/AuthProtectedRoute"

function RootLayout() {
  return (
    <>
      <Outlet />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  )
}


const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: "",
        element: <AppProtectedRoutes><MainLayout /></AppProtectedRoutes>,
        children: [
          { path: "/", element: <NewsFeed /> },
          { path: "/profile", element: <UserProfile /> },
          { path: "/post/:id", element: <PostDetailsPage /> },
          { path: "/notifications", element: <NotificationsPage /> },
          { path: "/explore",       element: <ExplorePage />   },
          { path: "/communication", element: <CommunityPage /> },
          { path: "/profile",     element: <UserProfilePage /> },  
          { path: "/profile/:id", element: <DiffUserProfile /> },
        ]
      },
      {
        path: "",
        element: <AuthProtectedRoutes><AuthLayout /></AuthProtectedRoutes>,
        children: [
          { path: "/login", element: <LoginPage /> },
          { path: "/signup", element: <SignupPage /> },
        ]
      },
      { path: "*", element: <NotFoundPage /> },
    ]
  }
])

function App() {
  return <RouterProvider router={router} />
}

export default App
