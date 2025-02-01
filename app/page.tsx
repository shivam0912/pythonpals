"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Code, Settings, Sparkles } from "lucide-react";
import Link from "next/link";

// app/page.tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Brain className="h-16 w-16 text-purple-600" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            PythonPals: Your Child&apos;s AI Coding Companion
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Welcome to PythonPals, where learning Python becomes an exciting adventure! Our AI-powered tutor adapts to your child&apos;s learning style, making coding fun and engaging through interactive lessons, friendly characters, and real-time feedback.
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            We&apos;ve designed PythonPals with a child-first approach, featuring colorful interfaces, encouraging messages, and bite-sized lessons that build confidence. Our AI tutor can take on different personalities - from a wise wizard to a friendly robot - making the learning journey truly magical.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/learn">
              <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
                Start Learning
                <Sparkles className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/settings">
              <Button size="lg" variant="outline">
                Configure API
                <Settings className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <Brain className="h-8 w-8 text-purple-600" />
              <h3 className="text-xl font-semibold">Adaptive Learning</h3>
            </div>
            <p className="text-gray-600">
              Our AI tutor adjusts to your child&apos;s pace and learning style, ensuring the perfect balance of challenge and support.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <Code className="h-8 w-8 text-blue-600" />
              <h3 className="text-xl font-semibold">Interactive Coding</h3>
            </div>
            <p className="text-gray-600">
              Practice Python with real-time feedback and fun coding challenges that make learning engaging and rewarding.
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-4 mb-4">
              <Sparkles className="h-8 w-8 text-yellow-600" />
              <h3 className="text-xl font-semibold">Custom Characters</h3>
            </div>
            <p className="text-gray-600">
              Choose your favorite AI tutor personality - learn from a wise wizard, friendly robot, or cosmic coder!
            </p>
          </Card>
        </div>
      </div>
    </main>
  );
}