import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Clock, Construction, Rocket } from 'lucide-react'

const ComingSoon = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)] p-4">
      <div className="text-center space-y-6">
        <div className="relative">
          <Construction className="w-24 h-24 text-indigo-500 mx-auto" />
          <Clock className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2" />
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900">Coming Soon!</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          We're working hard to bring you something amazing. This feature is currently under development and will be available soon.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
          <Card className="flex flex-col items-center text-center p-6">
            <Rocket className="w-12 h-12 text-green-500 mb-4" />
            <CardTitle className="text-xl font-semibold mb-2">Innovation</CardTitle>
            <CardContent className="text-gray-600 p-0">
              We're building cutting-edge features to enhance your experience.
            </CardContent>
          </Card>
          
          <Card className="flex flex-col items-center text-center p-6">
            <Construction className="w-12 h-12 text-blue-500 mb-4" />
            <CardTitle className="text-xl font-semibold mb-2">Development</CardTitle>
            <CardContent className="text-gray-600 p-0">
              Our team is working tirelessly to deliver quality solutions.
            </CardContent>
          </Card>
          
          <Card className="flex flex-col items-center text-center p-6">
            <Clock className="w-12 h-12 text-purple-500 mb-4" />
            <CardTitle className="text-xl font-semibold mb-2">Timeline</CardTitle>
            <CardContent className="text-gray-600 p-0">
              Stay tuned for updates on our development progress.
            </CardContent>
          </Card>
        </div>

        <p className="text-md text-gray-500 pt-8">
          Thank you for your patience!
        </p>
      </div>
    </div>
  )
}

export default ComingSoon
