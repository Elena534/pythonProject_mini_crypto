// app/layout.js
import { AuthProvider } from '@/context/AuthContext'
import Navbar from './Navbar'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}