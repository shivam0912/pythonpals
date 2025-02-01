"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save } from "lucide-react";

export default function SettingsPage() {
  const [apiProvider] = useState("gemini");
  const [apiKey, setApiKey] = useState("");

  const handleSave = () => {
    localStorage.setItem("pythonpals_api_key", apiKey);
    localStorage.setItem("pythonpals_provider", apiProvider);
    
    toast.success("Settings saved!", {
      description: "Your API configuration has been updated.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">API Configuration</h2>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>AI Provider</Label>
              <Select value={apiProvider} disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select AI provider" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gemini">Google Gemini</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>API Key</Label>
              <Input
                type="password"
                placeholder="Enter your Gemini API key"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
              />
              <p className="text-sm text-gray-500">
                Your API key is stored locally and never sent to our servers.
              </p>
            </div>

            <Button onClick={handleSave} className="w-full bg-purple-600 hover:bg-purple-700">
              Save Configuration
              <Save className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}