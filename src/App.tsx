import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AppProvider } from './contexts/AppContext'
import { ThemeProvider } from './contexts/ThemeContext'
import { Dashboard } from './pages/Dashboard'
import { Projects } from './pages/Projects'
import { Generate } from './pages/Generate'
import { Users } from './pages/Users'
import { Settings } from './pages/Settings'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/users" element={<Users />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </BrowserRouter>
        </AppProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
