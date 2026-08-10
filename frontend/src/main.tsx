import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { QueryProvider } from './providers/QueryProvider'
import { AuthProvider } from './providers/AuthProvider'
import { routes } from './router'
import { GoogleOAuthProvider } from '@react-oauth/google'

const router = createBrowserRouter(routes)
const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  '606575197535-ebgklfv1hls80g5fccfs8ronpaihcd4h.apps.googleusercontent.com'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <QueryProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
