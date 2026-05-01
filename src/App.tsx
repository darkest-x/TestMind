import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AppProvider } from './contexts/AppContext'
import { Header } from './components/layout/Header'
import { Dashboard } from './pages/Dashboard'
import { Projects } from './pages/Projects'
import { Generate } from './pages/Generate'
import { Search } from './pages/Search'
import { Settings } from './pages/Settings'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-gray-50">
            <Header />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/generate" element={<Generate />} />
              <Route path="/search" element={<Search />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AppProvider>
    </QueryClientProvider>
  )
}

export default App
