import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './App.css'
import AppLayout from './layouts/appLayout'
import LandingPage from './pages/landingPage'
import Dashboard from './pages/dashboard'
import Auth from './pages/auth'
import Link from './pages/link'
import RedirectLink from './pages/redirectLink'
import UrlProvider from './context'
// This is my database password on superbase PandeyAtul#2002

const router = createBrowserRouter([
  {
    element: <AppLayout/>,
    children: [
      {
        path: '/',
        element: <LandingPage/>
      },
      {
        path: '/dashboard',
        element: <Dashboard/>
      },
      {
        path: '/auth',
        element: <Auth/>
      },
      {
        path: '/link/:id',
        element: <Link/>
      },
      {
        path: '/:id',
        element: <RedirectLink/>
      }
    ]
  }
])

function App() {
 
  return (
    <UrlProvider>
       <RouterProvider router = {router}/>
    </UrlProvider>
    
  )
}

export default App
