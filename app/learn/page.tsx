"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, Send, Wand2, Sparkles, Star, Trophy, BookOpen, CheckCircle2 } from "lucide-react";
import { getChatCompletion } from "@/lib/gemini";
import { toast } from "sonner";
import ReactMarkdown from 'react-markdown';

// Progress tracking interface
interface Progress {
  lessonsCompleted: number;
  currentStreak: number;
  lastPracticeDate: string;
  achievements: string[];
  homeworkCompleted: number;
}

const TUTOR_INTROS = {
  wizard: {
    name: "Merlin",
    intro: "🧙‍♂️ Greetings, young apprentice! I am Merlin, your magical Python tutor. Through the ancient arts of coding, I shall guide you on your journey to becoming a master programmer. What magical concept would you like to explore today?",
    features: [
      "Transform complex code into magical spells",
      "Learn through enchanted coding challenges",
      "Master the mystical arts of Python",
      "Earn magical achievements"
    ]
  },
  robot: {
    name: "Circuit",
    intro: "🤖 *Beep-boop* Initializing friendly mode! I am Circuit, your robotic Python companion. My processors are optimized to help you understand programming through precise and logical steps. What would you like to learn about my fellow human?",
    features: [
      "Process concepts through robot logic",
      "Complete coding missions",
      "Learn debugging protocols",
      "Earn technical achievements"
    ]
  },
  cosmic: {
    name: "Nova",
    intro: "✨ Greetings, cosmic explorer! I am Nova, your guide through the vast universe of Python programming. Together we'll traverse the galaxies of code and discover the wonders of programming. Which constellation of knowledge shall we explore?",
    features: [
      "Explore code through space metaphors",
      "Complete intergalactic missions",
      "Discover programming nebulas",
      "Earn stellar achievements"
    ]
  }
};

export default function LearnPage() {
  const [message, setMessage] = useState("");
  const [character, setCharacter] = useState("wizard");
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{ role: string; content: string }[]>([]);
  const [hasHomework, setHasHomework] = useState(false);
  
  // Initialize conversation with tutor intro when character changes
  useEffect(() => {
    setConversation([{
      role: "assistant",
      content: TUTOR_INTROS[character as keyof typeof TUTOR_INTROS].intro
    }]);
    setHasHomework(false);
  }, [character]);

  // Progress state
  const [progress, setProgress] = useState<Progress>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pythonpals_progress');
      return saved ? JSON.parse(saved) : {
        lessonsCompleted: 0,
        currentStreak: 0,
        lastPracticeDate: new Date().toISOString().split('T')[0],
        achievements: [],
        homeworkCompleted: 0
      };
    }
    return {
      lessonsCompleted: 0,
      currentStreak: 0,
      lastPracticeDate: new Date().toISOString().split('T')[0],
      achievements: [],
      homeworkCompleted: 0
    };
  });

  const updateProgress = (isHomework: boolean = false) => {
    const today = new Date().toISOString().split('T')[0];
    const newProgress = { ...progress };

    if (progress.lastPracticeDate !== today) {
      const lastDate = new Date(progress.lastPracticeDate);
      const currentDate = new Date(today);
      const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        newProgress.currentStreak += 1;
        if (newProgress.currentStreak === 7) {
          newProgress.achievements.push("Week Warrior");
          toast.success("Achievement Unlocked: Week Warrior! 🏆");
        }
      } else if (diffDays > 1) {
        newProgress.currentStreak = 1;
      }
    }

    if (isHomework) {
      newProgress.homeworkCompleted += 1;
      if (newProgress.homeworkCompleted === 5 && !progress.achievements.includes("Homework Hero")) {
        newProgress.achievements.push("Homework Hero");
        toast.success("Achievement Unlocked: Homework Hero! 📚");
      }
    } else {
      newProgress.lessonsCompleted += 1;
      if (newProgress.lessonsCompleted === 10 && !progress.achievements.includes("Quick Learner")) {
        newProgress.achievements.push("Quick Learner");
        toast.success("Achievement Unlocked: Quick Learner! 🌟");
      }
    }

    newProgress.lastPracticeDate = today;
    setProgress(newProgress);
    localStorage.setItem('pythonpals_progress', JSON.stringify(newProgress));
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      setIsLoading(true);
      
      const newMessage = { role: "user", content: message };
      setConversation(prev => [...prev, newMessage]);
      setMessage("");

      const response = await getChatCompletion(
        conversation.concat(newMessage),
        character
      );

      if (response) {
        setConversation(prev => [...prev, { role: "assistant", content: response.content }]);
        updateProgress();
        setHasHomework(true);
      }
    } catch (error) {
      toast.error("Oops! The tutor needs a quick break. Please try again!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const requestHomework = async () => {
    try {
      setIsLoading(true);
      const response = await getChatCompletion(conversation, character, true);
      
      if (response) {
        setConversation(prev => [...prev, { 
          role: "assistant", 
          content: "🎯 **Homework Challenge!**\n\n" + response.content 
        }]);
        setHasHomework(false);
        updateProgress(true);
      }
    } catch (error) {
      toast.error("Oops! Couldn't generate homework right now. Please try again!");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const currentTutor = TUTOR_INTROS[character as keyof typeof TUTOR_INTROS];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card className="mb-4 p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Select value={character} onValueChange={setCharacter}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Choose your tutor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="wizard">Merlin the Wizard</SelectItem>
                  <SelectItem value="robot">Circuit the Robot</SelectItem>
                  <SelectItem value="cosmic">Nova the Cosmic</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                <span className="text-sm font-medium">Streak: {progress.currentStreak} days</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-purple-500" />
                <span className="text-sm font-medium">Lessons: {progress.lessonsCompleted}</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                <span className="text-sm font-medium">Homework: {progress.homeworkCompleted}</span>
              </div>
            </div>
          </div>
          
          {/* Tutor Features */}
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
            {currentTutor.features.map((feature, index) => (
              <div key={index} className="bg-white/50 rounded-lg p-2 text-sm text-gray-700">
                {feature}
              </div>
            ))}
          </div>
        </Card>

        <Card className="mb-4 p-4 min-h-[500px] flex flex-col">
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
            {conversation.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center">
                    {character === "wizard" ? (
                      <Wand2 className="h-5 w-5 text-purple-600" />
                    ) : character === "robot" ? (
                      <Bot className="h-5 w-5 text-purple-600" />
                    ) : (
                      <Sparkles className="h-5 w-5 text-purple-600" />
                    )}
                  </div>
                )}
                <div
                  className={`rounded-lg p-4 max-w-[80%] ${
                    msg.role === "user"
                      ? "bg-purple-600 text-white"
                      : "bg-white border border-gray-200"
                  }`}
                >
                  <ReactMarkdown
                    components={{
                      code({ node, inline, className, children, ...props }) {
                          const match = /language-(\w+)/.exec(className || '');
                          return !inline && match ? (
                          <pre className="bg-gray-800 text-white p-2 rounded-md overflow-x-auto">
                            <code className={className} {...props}>
                              {children}
                            </code>
                          </pre>
                        ) : (
                          <code className="bg-gray-800 text-white px-1 rounded" {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {msg.content}
                  </ReactMarkdown>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Textarea
              placeholder={`Ask ${currentTutor.name} a Python question...`}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              disabled={isLoading}
            />
            <Button 
              onClick={handleSend} 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={isLoading}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>

          {hasHomework && (
            <div className="mt-4 flex justify-center">
              <Button
                onClick={requestHomework}
                className="bg-green-600 hover:bg-green-700 gap-2"
                disabled={isLoading}
              >
                <CheckCircle2 className="h-5 w-5" />
                Get Homework Challenge
              </Button>
            </div>
          )}
        </Card>

        {progress.achievements.length > 0 && (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Achievements
            </h3>
            <div className="flex flex-wrap gap-2">
              {progress.achievements.map((achievement, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium"
                >
                  {achievement}
                </span>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}