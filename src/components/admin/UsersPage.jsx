import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Users, Clock, Wrench, Shield, BarChart3 } from 'lucide-react'

const UsersPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Users Management</h2>
        <p className="text-gray-600 mt-1">User management features coming soon</p>
      </div>

      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
            <Users className="h-10 w-10 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">
            Coming Soon
          </h3>
          <p className="text-gray-500 mb-6 text-center max-w-md">
            We're working hard to bring you comprehensive user management features. 
            This section will include user registration, role management, and account administration.
          </p>
          <div className="flex items-center space-x-2 text-sm text-gray-400">
            <Clock className="h-4 w-4" />
            <span>Expected release: Q2 2024</span>
          </div>
        </CardContent>
      </Card>

      {/* Preview of upcoming features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-indigo-600" />
              <span>User Registration</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Manage user accounts, registration process, and account verification.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-indigo-600" />
              <span>Role Management</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Assign and manage user roles, permissions, and access levels.
            </p>
          </CardContent>
        </Card>

        <Card className="border border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-indigo-600" />
              <span>User Analytics</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">
              Track user activity, engagement metrics, and user behavior insights.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default UsersPage