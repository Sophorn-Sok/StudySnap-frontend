'use client';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/store';
import {
  Sparkles,
  MessageCircle,
  FileText,
  Zap,
  Users,
  BookOpen,
  Lock,
  Mail,
  Eye,
  EyeOff,
} from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpMessage, setOtpMessage] = useState('');
  const [useOtp, setUseOtp] = useState(false);
  const [isRequestingOtp, setIsRequestingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, requestOtp, isLoading } = useAuthStore();
  const router = useRouter();

  const handleRequestOtp = async () => {
    setError('');
    setOtpMessage('');

    if (!email) {
      setError('Please enter your email first.');
      return;
    }

    setIsRequestingOtp(true);
    try {
      const response = await requestOtp(email, 'login');
      setOtpMessage(response.message);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsRequestingOtp(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (useOtp) {
        if (!email.trim()) {
          setError('Please enter your email first.');
          return;
        }
        const response = await requestOtp(email, 'login');
        setOtpMessage(response.message);
        setError('');
        return;
      } else {
        await login(email.trim(), password);
      }

      router.push('/dashboard');
    } catch (err) {
      const message = (err as Error).message;

      // If password auth fails, offer a smooth fallback to magic-link login.
      if (!useOtp && /invalid email or password/i.test(message) && email.trim()) {
        try {
          const response = await requestOtp(email.trim(), 'login');
          setUseOtp(true);
          setOtpMessage(response.message);
          setError('Password login failed. We sent you a sign-in link to continue.');
          return;
        } catch {
          // Fall through to surface original password error.
        }
      }

      setError(message);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Feature Section */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 p-12 text-white">
        <div>
          <Link href="/" className="flex items-center gap-2 mb-16 hover:opacity-80 transition-opacity">
            <div className="w-10 h-10 bg-blue-400 rounded-lg flex items-center justify-center">
              <Sparkles size={24} />
            </div>
            <span className="text-2xl font-bold">StudySnap</span>
          </Link>

          <h2 className="text-4xl lg:text-5xl font-bold mb-4">AI-Powered Learning Workspace</h2>
          <p className="text-blue-100 mb-12 text-lg">
            Capture meetings, organize knowledge, and study smarter with intelligent flashcards.
          </p>

          {/* Features List */}
          <div className="space-y-6">
            {/* AI Summary */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-400 bg-opacity-20">
                  <Sparkles size={24} className="text-blue-300" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">AI Summary</h3>
                <p className="text-blue-100">Get instant summaries of your notes and meetings</p>
              </div>
            </div>

            {/* AI Meeting Notes */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-400 bg-opacity-20">
                  <MessageCircle size={24} className="text-blue-300" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">AI Meeting Notes</h3>
                <p className="text-blue-100">
                  Automatically transcribe Zoom and Google Meet conversations and generate structured summaries.
                </p>
              </div>
            </div>

            {/* Smart Notes Organization */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-400 bg-opacity-20">
                  <FileText size={24} className="text-blue-300" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Smart Notes Organization</h3>
                <p className="text-blue-100">
                  Create rich-text notes with folders, tags, and powerful search to organize your knowledge.
                </p>
              </div>
            </div>

            {/* Flashcard Learning System */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-400 bg-opacity-20">
                  <Zap size={24} className="text-blue-300" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-1">Flashcard Learning System</h3>
                <p className="text-blue-100">
                  Convert notes and meeting transcripts into flashcards with spaced repetition learning.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Section */}
        <div className="border-t border-blue-400 border-opacity-30 pt-8">
          <p className="text-blue-100 text-sm mb-4">Trusted by students and professionals</p>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <Users size={20} />
              <span className="text-sm">Students</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={20} />
              <span className="text-sm">Study groups</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock size={20} />
              <span className="text-sm">Remote teams</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Sign In Form */}
      <div className="flex flex-col items-center justify-center p-6 lg:p-12 bg-gray-50 lg:bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Sign in to StudySnap</h1>
            <p className="text-gray-600">Access your notes, meetings, and flashcards.</p>
          </div>

          <Card className="shadow-xl">
            <CardContent className="pt-8 pb-8">
              <form onSubmit={handleLogin} className="space-y-5">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Email Input */}
                <div className="relative">
                  <label className="text-sm font-semibold text-gray-700 block mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-gray-400" size={20} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <button
                    type="button"
                    onClick={() => {
                      setUseOtp(!useOtp);
                      setError('');
                      setOtpMessage('');
                    }}
                    className="text-blue-600 hover:underline"
                  >
                    {useOtp ? 'Use password instead' : 'Use email link instead'}
                  </button>
                </div>

                {!useOtp ? (
                  <div className="relative">
                    <label className="text-sm font-semibold text-gray-700 block mb-2">Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 text-gray-400" size={20} />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      Send a confirmation link to your email, then click it to sign in automatically.
                    </p>

                    <Button
                      type="button"
                      onClick={handleRequestOtp}
                      isLoading={isRequestingOtp}
                      className="w-full py-2 px-4 border border-blue-300 bg-white text-blue-700 hover:bg-blue-50 rounded-lg"
                    >
                      Send Sign-In Link
                    </Button>

                    {otpMessage && (
                      <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-2">
                        {otpMessage}
                      </p>
                    )}
                  </div>
                )}

                {/* Remember & Forgot Password */}
                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-gray-700">
                    <input
                      type="checkbox"
                      className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                    Remember me
                  </label>
                  <a href="/forgot-password" className="text-blue-600 hover:underline">
                    Forgot password?
                  </a>
                </div>

                {/* Sign In Button */}
                <Button 
                  type="submit" 
                  isLoading={isLoading}
                  className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
                >
                  {useOtp ? 'Send Sign-In Link' : 'Sign In'}
                </Button>

                {/* Divider */}
                <div className="relative flex items-center my-6">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="px-3 text-gray-500 text-sm">or</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>

                {/* Google Sign In Button */}
                <button
                  type="button"
                  className="w-full py-2 px-4 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </button>
              </form>
            </CardContent>
          </Card>

          {/* Footer */}
          <p className="text-center mt-6 text-sm text-gray-600">
            Don't have an account?{' '}
            <a href="/register" className="text-blue-600 font-semibold hover:underline">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
