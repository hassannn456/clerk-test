import { useEffect, useRef } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import { hotjar } from 'react-hotjar';

import Chat from '../pages/Chat';
import LogIn from '../pages/Login';
import Signup from '../pages/Signup';

hotjar.initialize(
  process.env.REACT_APP_HOTJAR_ID,
  process.env.REACT_APP_HOTJAR_VERSION || 6
);
export const useRefresh = () => {
  const refreshedRef = useRef(0); // use const

  useEffect(() => {
    // Timeout to allow Clerk to load its elements
    const timer = setTimeout(() => {
      // Query for a Clerk-specific DOM element or class
      const clerkElement = document.querySelector('.cl-rootBox');

      // If Clerk elements are not found, reload the page
      if (!clerkElement && refreshedRef.current < 1) {
        // use current property
        console.log('Reloading to get Clerk log in to appear');
        window.location.reload();
        refreshedRef.current += 1;
      }
    }, 1000); // 1000 milliseconds = 1 second

    // Cleanup
    return () => clearTimeout(timer);
  }, []);
};

const useClerkRoutes = () => {
  const navigate = useNavigate();

  const clerkPubKey = process.env.REACT_APP_CLERK_PUBLISHABLE_KEY;

  return (
    <ClerkProvider publishableKey={clerkPubKey} navigate={(to) => navigate(to)}>
      <Routes>
      <Route path="/" element={<LogIn />} />
        <Route path="/sign-in/*" element={<LogIn />} />
        <Route path="/sign-up/*" element={<Signup />} />
        <Route
          path="/chat"
          element={
            <RequireAuthentication>
              <Chat />
            </RequireAuthentication>
          }
        />
      </Routes>
    </ClerkProvider>
  );
};

const RequireAuthentication = ({ children }) => {
  useRefresh();
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <Navigate to={'/sign-in'} />
      </SignedOut>
    </>
  );
};

export default useClerkRoutes;
