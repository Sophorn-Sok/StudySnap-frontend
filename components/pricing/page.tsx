import React from 'react';
import { Check, Lock, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export default function PricingPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-5xl mx-auto font-sans pb-20">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 tracking-tight">Choose Your Plan</h1>
        <p className="text-[#64748B] mt-2 text-[15px]">Upgrade to unlock full AI-powered learning features</p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-stretch">
        {/* Starter Plan */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col hover:shadow-lg transition-all">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Starter</h3>
          <div className="mb-8">
            <span className="text-[32px] font-extrabold text-gray-900">Free</span>
          </div>
          
          <ul className="space-y-4 flex-1 mb-8">
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
              <span className="text-[14px] text-gray-600 leading-relaxed font-medium">Limited notes and flashcards</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
              <span className="text-[14px] text-gray-600 leading-relaxed font-medium">3 meeting transcriptions per month</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
              <span className="text-[14px] text-gray-600 leading-relaxed font-medium">Basic AI features</span>
            </li>
          </ul>

          <button className="w-full py-3 px-4 bg-[#F1F5F9] text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-200 transition-colors">
            Select Plan
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white rounded-2xl p-8 border-2 border-blue-500 shadow-xl shadow-blue-500/10 flex flex-col relative transform hover:scale-[1.02] transition-transform z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white px-4 py-1.5 rounded-full text-xs font-bold tracking-wide">
            Most Popular
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Pro</h3>
          <div className="mb-8 flex items-end">
            <span className="text-[32px] font-extrabold text-gray-900 leading-none">$9</span>
            <span className="text-gray-500 font-medium ml-1.5 pb-1">/month</span>
          </div>
          
          <ul className="space-y-4 flex-1 mb-8">
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
              <span className="text-[14px] text-gray-600 leading-relaxed font-medium">Unlimited notes and flashcards</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
              <span className="text-[14px] text-gray-600 leading-relaxed font-medium">Unlimited meeting transcription</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
              <span className="text-[14px] text-gray-600 leading-relaxed font-medium">AI flashcard generation</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
              <span className="text-[14px] text-gray-600 leading-relaxed font-medium">Advanced analytics</span>
            </li>
          </ul>

          <Button variant="primary" className="w-full h-[46px] rounded-xl text-[15px] shadow-lg shadow-blue-500/30">
            Selected
          </Button>
        </div>

        {/* Team Plan */}
        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] flex flex-col hover:shadow-lg transition-all">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Team</h3>
          <div className="mb-8 flex items-end">
            <span className="text-[32px] font-extrabold text-gray-900 leading-none">$49</span>
            <span className="text-gray-500 font-medium ml-1.5 pb-1">/month</span>
          </div>
          
          <ul className="space-y-4 flex-1 mb-8">
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
              <span className="text-[14px] text-gray-600 leading-relaxed font-medium">All Pro features</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
              <span className="text-[14px] text-gray-600 leading-relaxed font-medium">Collaboration tools</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
              <span className="text-[14px] text-gray-600 leading-relaxed font-medium">Shared workspaces</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="w-4 h-4 text-blue-500 mt-1 shrink-0" />
              <span className="text-[14px] text-gray-600 leading-relaxed font-medium">Priority support</span>
            </li>
          </ul>

          <button className="w-full py-3 px-4 bg-[#F1F5F9] text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-200 transition-colors">
            Select Plan
          </button>
        </div>
      </div>

      {/* Payment Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        
        {/* Payment Details */}
        <div className="lg:col-span-3 bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] h-full">
          <h2 className="text-[17px] font-bold text-gray-900 mb-6">Payment Details</h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-gray-600 mb-2">Name on Card</label>
              <input 
                type="text" 
                placeholder="John Doe" 
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 font-medium"
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-semibold text-gray-600 mb-2">Card Number</label>
              <input 
                type="text" 
                placeholder="4242 4242 4242 4242" 
                className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 font-medium tracking-wide"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-gray-600 mb-2">Expiry Date</label>
                <input 
                  type="text" 
                  placeholder="MM / YY" 
                  className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 font-medium"
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-gray-600 mb-2">CVC</label>
                <input 
                  type="text" 
                  placeholder="123" 
                  className="w-full bg-[#f8fafc] border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 font-medium"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-5 sm:p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.05)] h-full flex flex-col">
          <h2 className="text-[17px] font-bold text-gray-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4 flex-1">
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-500">Pro Plan</span>
              <span className="text-gray-900">$9.00</span>
            </div>
            <div className="flex justify-between text-sm font-medium">
              <span className="text-gray-500">Tax</span>
              <span className="text-gray-900">$0.00</span>
            </div>
            
            <div className="pt-4 border-t border-gray-100 mt-2">
              <div className="flex justify-between text-[15px]">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-extrabold text-gray-900">$9.00/mo</span>
              </div>
            </div>
          </div>
          
          <div className="mt-8">
            <Button variant="primary" className="w-full h-12 rounded-xl text-[15px] shadow-lg shadow-blue-500/20">
              Subscribe Now
            </Button>
            <p className="text-center text-[13px] text-gray-400 font-medium mt-4">Cancel anytime</p>
          </div>
        </div>

      </div>

      {/* Footer Assurances */}
      <div className="mt-10 flex flex-wrap justify-center gap-8 text-gray-400 text-xs font-semibold">
        <div className="flex items-center gap-2 border border-gray-100 bg-white shadow-sm px-4 py-2 rounded-full">
          <Lock className="w-4 h-4 text-gray-400" />
          <span>Secure payment</span>
        </div>
        <div className="flex items-center gap-2 border border-gray-100 bg-white shadow-sm px-4 py-2 rounded-full">
          <CheckCircle2 className="w-4 h-4 text-gray-400" />
          <span>No hidden fees</span>
        </div>
        <div className="flex items-center gap-2 border border-gray-100 bg-white shadow-sm px-4 py-2 rounded-full">
          <XCircle className="w-4 h-4 text-gray-400" />
          <span>Cancel anytime</span>
        </div>
      </div>
    </div>
  );
}
