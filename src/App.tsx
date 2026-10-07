import { Routes, Route } from 'react-router'
import Home from './pages/Home'
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import SearchPage from "./pages/Search"
import PropertyDetail from "./pages/PropertyDetail"
import Dashboard from "./pages/Dashboard"
import Admin from "./pages/Admin"
import Favorites from "./pages/Favorites"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import { Toaster } from "@/components/ui/sonner"

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" richColors />
    </div>
  )
}
