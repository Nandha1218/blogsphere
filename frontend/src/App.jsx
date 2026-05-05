import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import PostDetail from './pages/PostDetail'
import CreatePost from './pages/CreatePost'
import MyPosts from './pages/MyPosts'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'

/**
 * App.jsx — Root component
 * Sets up React Router with all page routes.
 * ProtectedRoute wraps pages that require authentication.
 */
function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/post/:id" element={<PostDetail />} />

        {/* Protected routes — require login */}
        <Route path="/create" element={
          <ProtectedRoute><CreatePost /></ProtectedRoute>
        } />
        <Route path="/edit/:id" element={
          <ProtectedRoute><CreatePost editMode /></ProtectedRoute>
        } />
        <Route path="/my-posts" element={
          <ProtectedRoute><MyPosts /></ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute><Profile /></ProtectedRoute>
        } />

        {/* Catch-all redirect */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
