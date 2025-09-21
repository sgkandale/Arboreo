'use client';

import "./globals.css";
import useAuth from './hooks/useAuth';
import Login from './components/Login';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated, login } = useAuth();

  return (
    <html lang="en">
      <body>
        {!isAuthenticated ? (
          <Login onLogin={login} />
        ) : (
          children
        )}
      </body>
    </html>
  );
}
