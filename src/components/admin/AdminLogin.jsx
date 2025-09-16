import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react'

const AdminLogin = ({ onLogin }) => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: 'admin@cometica.com',
    password: 'admin123'
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Basic validation first
      if (!formData.email || !formData.password) {
        setError('Please enter both email and password')
        return
      }

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Simple validation - in real app, this would be server-side
      if (formData.email === 'admin@cometica.com' && formData.password === 'admin123') {
        // Clear any existing errors and show success
        setError('')
        setIsSuccess(true)
        
        // Call onLogin after a brief success feedback
        setTimeout(() => {
          onLogin({
            email: formData.email,
            name: 'Admin User',
            role: 'admin'
          })
          // Show success notification
          toast.success('Successfully logged in!', {
            description: 'Welcome back to Cometica Admin',
            duration: 3000,
          })
          // Redirect to admin dashboard
          navigate('/admin')
        }, 500)
      } else {
        setError('Invalid email or password. Please use the demo credentials below.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4 overflow-hidden">
      <div className="w-full max-w-sm">
        {/* Admin Login Brand Section */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl mb-2">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Cometica Admin</h1>
          <p className="text-gray-600 text-sm">Sign in to your admin account</p>
        </div>

        {/* Login Form Card */}
        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-3">
            <CardTitle className="text-xl font-semibold text-center text-gray-900">
              Welcome Back
            </CardTitle>
            <p className="text-xs text-gray-600 text-center">
              Enter your credentials to access the admin panel
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Input Field */}
              <div className="space-y-1">
                <Label htmlFor="email" className="text-xs font-medium text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="admin@cometica.com"
                    className="pl-10 h-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg text-sm"
                    required
                  />
                </div>
              </div>

              {/* Password Input Field */}
              <div className="space-y-1">
                <Label htmlFor="password" className="text-xs font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="pl-10 pr-10 h-10 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-lg text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-2 rounded-lg">
                  <AlertCircle className="h-3 w-3 flex-shrink-0" />
                  <span className="text-xs">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-10 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Demo Login Credentials */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-xs font-medium text-blue-900 mb-1">Demo Credentials:</h3>
              <div className="text-xs text-blue-700">
                <p><strong>Email:</strong> admin@cometica.com</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminLogin
