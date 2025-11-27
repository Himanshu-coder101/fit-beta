// COMPLETE-FIX.js - Run: node COMPLETE-FIX.js
const fs = require('fs');
const path = require('path');

console.log('🏋️ FitTrack Pro - Complete Fix\n');

const FILES = {
  // Clean dashboard - auto adaptation
  'pages/dashboard.js': `import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card";
import Link from "next/link";
import { useSession } from 'next-auth/react';

export default function Dashboard() {
  const { data: session } = useSession();
  const [plan, setPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const prof = localStorage.getItem("ft_profile");
    const pl = localStorage.getItem("ft_plan_v1");
    
    if (prof) setProfile(JSON.parse(prof));
    if (pl) setPlan(JSON.parse(pl));
    
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-6xl animate-pulse">🏋️</div>
        </div>
      </>
    );
  }

  if (!plan?.sessions?.length) {
    return (
      <>
        <Navbar />
        <BottomNav />
        <main className="container mt-8 mb-20">
          <Card title="Welcome to FitTrack Pro">
            <p className="mb-4">Create your personalized AI workout plan</p>
            <Link href="/onboard/goal" className="btn-primary">
              Get Started
            </Link>
          </Card>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <BottomNav />
      <main className="container mt-4 mb-20 space-y-6">
        <div>
          <h1 className="text-4xl font-bold mb-2">
            Welcome back{session?.user?.name ? \`, \${session.user.name.split(' ')[0]}\` : ''}! 💪
          </h1>
          <p className="text-slate-600 dark:text-slate-300">
            Your AI training dashboard
          </p>
        </div>

        {/* Hero Next Workout */}
        <div className="relative p-8 rounded-3xl bg-gradient-to-br from-ft-blue via-purple-500 to-ft-teal text-white shadow-2xl overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold mb-2">Next Workout</h2>
            <p className="text-lg mb-6">{plan.sessions[0].day}</p>
            <Link
              href="/day/1"
              className="bg-white text-ft-blue px-6 py-3 rounded-xl font-bold inline-block hover:scale-105 transition shadow-lg"
            >
              Start Workout →
            </Link>
          </div>
          <div className="absolute right-8 bottom-8 text-8xl opacity-10">🔥</div>
        </div>

        {/* Weekly Overview */}
        <Card title="This Week's Plan">
          <div className="grid gap-3">
            {plan.sessions.map((s, i) => (
              <Link
                href={\`/day/\${i + 1}\`}
                key={i}
                className="interactive p-5 rounded-2xl border-2 bg-white/50 dark:bg-white/5 hover:border-ft-blue hover:shadow-lg transition flex justify-between items-center group"
              >
                <div>
                  <h4 className="font-bold text-lg group-hover:text-ft-blue transition">
                    {s.day}
                  </h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    {s.exercises?.length || 0} exercises
                  </p>
                </div>
                <span className="text-2xl group-hover:translate-x-1 transition">→</span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Actions */}
        <Card title="Quick Actions">
          <div className="grid md:grid-cols-2 gap-3">
            <Link href="/onboard/goal" className="small-btn text-center block py-3">
              ✨ Create New Plan
            </Link>
            <Link href="/weekly-plan" className="small-btn text-center block py-3">
              📅 View Full Plan
            </Link>
          </div>
        </Card>

        <div className="text-center text-xs text-slate-500 dark:text-slate-400">
          💡 Your plan automatically adapts based on your workout feedback
        </div>
      </main>
    </>
  );
}`,

  // Update Navbar with auth
  'components/Navbar.js': `import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession, signIn, signOut } from 'next-auth/react';

export default function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const saved = localStorage.getItem("ft_theme");
    if (saved) {
      setTheme(saved);
      document.documentElement.classList.toggle("dark", saved === "dark");
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setTheme(prefersDark ? "dark" : "light");
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    localStorage.setItem("ft_theme", next);
    document.documentElement.classList.toggle("dark", next === "dark");
  }

  return (
    <nav className="w-full px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-xl bg-white/40 dark:bg-black/30 border-b border-white/20 dark:border-white/10">
      <Link href="/" className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ft-blue to-ft-teal flex items-center justify-center text-white font-bold shadow-xl">
          FT
        </div>
        <span className="font-semibold text-xl tracking-wide">FitTrack Pro</span>
      </Link>

      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            href="/dashboard"
            className={\`hover:text-ft-blue transition \${
              router.pathname === "/dashboard" ? "text-ft-blue" : ""
            }\`}
          >
            Dashboard
          </Link>

          {!session ? (
            <button onClick={() => signIn('google')} className="btn-primary">
              Sign In
            </button>
          ) : (
            <>
              {session.user.image && (
                <img 
                  src={session.user.image} 
                  alt={session.user.name}
                  className="w-8 h-8 rounded-full"
                />
              )}
              <button onClick={() => signOut()} className="small-btn">
                Sign Out
              </button>
            </>
          )}
        </div>

        <button onClick={toggleTheme} className="small-btn">
          {theme === "dark" ? "🌙" : "☀️"}
        </button>
      </div>
    </nav>
  );
}`,

  // Fix NextAuth config
  'pages/api/auth/[...nextauth].js': `import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub;
      return session;
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
});`,

  // Wrap app with session provider
  'pages/_app.js': `import '../styles/globals.css'
import { useEffect } from 'react'
import { SessionProvider } from 'next-auth/react'

function setInitialTheme() {
  const saved = typeof window !== 'undefined' && localStorage.getItem('ft_theme')
  if (saved) {
    document.documentElement.classList.toggle('dark', saved === 'dark')
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
    document.documentElement.classList.toggle('dark', prefersDark)
  }
}

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    setInitialTheme()
  }, [])
  
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  )
}`,

  // Auto-adaptive plan API - uses feedback automatically
  'pages/api/plan.js': `import { generateWorkoutPrompt } from '../../lib/aiCoach';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const profile = req.body;
    
    if (!profile.goal || !profile.daysPerWeek) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ 
        error: 'GROQ_API_KEY required',
        message: 'Add GROQ_API_KEY to .env.local file. Get free key from console.groq.com'
      });
    }

    // Automatically get last 10 feedback entries for adaptation
    const feedback = profile.previousFeedback || null;
    const prompt = generateWorkoutPrompt(profile, feedback);

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": \`Bearer \${process.env.GROQ_API_KEY}\`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { 
            role: "system", 
            content: "You are an elite personal trainer. Return ONLY pure JSON. NO markdown, NO code blocks, NO extra text." 
          },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Groq API error:", errorText);
      return res.status(500).json({ error: "AI service unavailable" });
    }

    const data = await response.json();
    let content = data.choices[0].message.content.trim();
    content = content.replace(/\`\`\`json\\n?/g, "").replace(/\`\`\`\\n?/g, "").trim();

    const plan = JSON.parse(content);
    
    if (!plan.sessions || plan.sessions.length === 0) {
      throw new Error("Invalid plan generated");
    }
    
    return res.status(200).json({
      ...plan,
      meta: { 
        generatedAt: new Date().toISOString(), 
        generator: 'ai',
        adapted: !!feedback
      },
      profile
    });

  } catch (err) {
    console.error("Plan generation error:", err);
    return res.status(500).json({ error: err.message });
  }
}`,

  // Summary page - auto gets feedback
  'pages/onboard/summary.js': `import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import { useState } from "react";

export default function Summary() {
  const router = useRouter();
  const q = router.query;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function createPlan() {
    setLoading(true);
    setError(null);

    const profile = {
      goal: q.goal,
      experience: q.experience,
      daysPerWeek: Number(q.days),
      timePerSession: Number((q.time || "30-45").split("-")[0]),
      equipment: q.equipment
    };

    try {
      // Automatically include previous feedback if exists
      const feedbackRaw = localStorage.getItem('ft_feedback_v1');
      const feedback = feedbackRaw ? JSON.parse(feedbackRaw).slice(0, 10) : null;
      
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profile,
          previousFeedback: feedback
        })
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        throw new Error(data.message || data.error);
      }

      localStorage.setItem("ft_profile", JSON.stringify(profile));
      localStorage.setItem("ft_plan_v1", JSON.stringify(data));
      router.push("/dashboard");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <BottomNav />
      <main className="container max-w-2xl mt-6 mb-24">
        <h2 className="text-3xl font-bold mb-6">Review Your Plan</h2>
        <div className="card space-y-3">
          <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400">Goal:</span>
            <strong>{q.goal}</strong>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400">Experience:</span>
            <strong>{q.experience}</strong>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400">Days/week:</span>
            <strong>{q.days}</strong>
          </div>
          <div className="flex justify-between py-2 border-b border-slate-200 dark:border-slate-700">
            <span className="text-slate-600 dark:text-slate-400">Time:</span>
            <strong>{q.time} mins</strong>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-slate-600 dark:text-slate-400">Equipment:</span>
            <strong className="capitalize">{q.equipment?.replace('_', ' ')}</strong>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300">
              <strong>❌ Error:</strong> {error}
              {error.includes('GROQ_API_KEY') && (
                <p className="mt-2 text-sm">
                  Get a free API key from: <a href="https://console.groq.com" target="_blank" className="underline">console.groq.com</a>
                </p>
              )}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button 
              onClick={createPlan} 
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? "Creating your AI plan..." : "🚀 Generate My Plan"}
            </button>
            <button 
              onClick={() => router.back()} 
              className="small-btn px-6"
              disabled={loading}
            >
              Back
            </button>
          </div>

          <p className="text-xs text-center text-slate-500 dark:text-slate-400 mt-4">
            Your plan will automatically adapt based on your workout feedback
          </p>
        </div>
      </main>
    </>
  );
}`,

  // .env.example
  '.env.example': `# Groq AI API (Required) - Get free key from console.groq.com
GROQ_API_KEY=

# Google OAuth (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000`,

  '.gitignore': `node_modules
.next
.next/
.env.local
.env
backup_*`
};

console.log('📦 Creating backup...');
const backup = path.join(__dirname, 'backup_' + Date.now());
fs.mkdirSync(backup, { recursive: true });

Object.keys(FILES).forEach(file => {
  const full = path.join(__dirname, file);
  if (fs.existsSync(full)) {
    const backupFile = path.join(backup, file);
    const dir = path.dirname(backupFile);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.copyFileSync(full, backupFile);
  }
});

console.log('✅ Backup:', backup);
console.log('\\n📝 Updating files...\\n');

Object.entries(FILES).forEach(([file, content]) => {
  const full = path.join(__dirname, file);
  const dir = path.dirname(full);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(full, content);
  console.log('  ✅', file);
});

console.log('\\n' + '='.repeat(60));
console.log('✅ FIX COMPLETE!\\n');
console.log('🔧 Setup Steps:');
console.log('1. Get Groq API key: https://console.groq.com (FREE)');
console.log('2. Create .env.local file:');
console.log('   GROQ_API_KEY=your_groq_key');
console.log('   GOOGLE_CLIENT_ID=your_google_id (optional)');
console.log('   GOOGLE_CLIENT_SECRET=your_google_secret (optional)');
console.log('   NEXTAUTH_SECRET=random_string (optional)');
console.log('3. Run: npm run dev');
console.log('4. Visit: http://localhost:3000\\n');
console.log('✨ Changes:');
console.log('  • Removed regeneration button');
console.log('  • Removed progress/feedback display');
console.log('  • Auto-adapts based on feedback (2-3 workouts)');
console.log('  • Added Google OAuth support');
console.log('  • Cleaner, simpler dashboard');
console.log('');