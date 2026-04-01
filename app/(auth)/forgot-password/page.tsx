'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import Link from 'next/link';
import { Lock, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Demo: Show success message
    setIsSubmitted(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setEmail('');
      setIsSubmitted(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-md shadow-lg">
        <CardContent className="pt-12 pb-8">
          <div className="text-center">
            {/* Lock Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-full bg-blue-500 flex items-center justify-center">
                <Lock size={32} className="text-white" />
              </div>
            </div>

            {/* Heading */}
            <h1 className="text-2xl font-bold text-gray-900 mb-3">Forgot your password?</h1>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-8">Enter your email to reset it!</p>

            {isSubmitted ? (
              <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg text-sm mb-6">
                <p className="font-semibold mb-1">Check your email!</p>
                <p>We've sent password reset instructions to {email}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <Button 
                  type="submit"
                  className="w-full py-2 px-4 bg-blue-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors"
                >
                  Confirm
                </Button>
              </form>
            )}

            {/* Return to Login Link */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <Link 
                href="/login" 
                className="text-gray-600 hover:text-gray-900 text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <span>←</span>
                Return to the login screen
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
