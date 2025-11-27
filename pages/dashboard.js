import { useEffect, useState } from "react";
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
            Welcome back{session?.user?.name ? `, ${session.user.name.split(' ')[0]}` : ''}! 💪
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
                href={`/day/${i + 1}`}
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
}