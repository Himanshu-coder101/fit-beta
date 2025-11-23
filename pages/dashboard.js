import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card";
import Link from "next/link";
import { summarizeFeedback } from "../lib/feedback";

export default function Dashboard() {
  const [plan, setPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const prof = localStorage.getItem("ft_profile");
    const pl = localStorage.getItem("ft_plan_v1");
    
    if (prof) setProfile(JSON.parse(prof));
    if (pl) setPlan(JSON.parse(pl));
    
    setFeedback(summarizeFeedback({ lastN: 20 }));
    setLoading(false);
  }, []);

  async function updatePlan() {
    if (!profile) return alert("Complete onboarding first");
    
    setUpdating(true);
    try {
      const fb = JSON.parse(localStorage.getItem('ft_feedback_v1') || '[]').slice(0, 10);
      
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...profile, previousFeedback: fb })
      });

      const newPlan = await res.json();
      
      if (newPlan.sessions) {
        localStorage.setItem("ft_plan_v1", JSON.stringify(newPlan));
        setPlan(newPlan);
        alert("✅ Plan updated!");
      }
    } catch (e) {
      alert("Update failed");
    }
    setUpdating(false);
  }

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
          <Card title="No Plan Yet">
            <Link href="/onboard/goal" className="btn-primary">Create Plan</Link>
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
          <h1 className="text-4xl font-bold mb-2">Welcome! 💪</h1>
          <p className="text-slate-600 dark:text-slate-300">Your AI training dashboard</p>
        </div>

        <div className="p-8 rounded-3xl bg-gradient-to-br from-ft-blue to-ft-teal text-white shadow-2xl">
          <h2 className="text-2xl font-bold mb-2">Next Workout</h2>
          <p className="text-lg mb-6">{plan.sessions[0].day}</p>
          <Link href="/day/1" className="bg-white text-ft-blue px-6 py-3 rounded-xl font-bold inline-block hover:scale-105 transition">
            Start →
          </Link>
        </div>

        <Card title="This Week">
          <div className="space-y-3">
            {plan.sessions.map((s, i) => (
              <Link
                key={i}
                href={`/day/${i+1}`}
                className="block p-4 rounded-xl bg-white/50 dark:bg-white/5 hover:shadow-lg transition"
              >
                <div className="font-bold">{s.day}</div>
                <div className="text-sm text-slate-600">{s.exercises?.length} exercises</div>
              </Link>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Progress">
            <div className="text-center py-4">
              <div className="text-6xl font-bold text-ft-blue">{feedback?.total || 0}</div>
              <p>Workouts Done</p>
            </div>
          </Card>

          <Card title="Feedback">
            {!feedback?.total ? (
              <p className="text-center py-4">No feedback yet</p>
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Easy:</span>
                  <strong>{feedback.difficulty.Easy}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Moderate:</span>
                  <strong>{feedback.difficulty.Moderate}</strong>
                </div>
                <div className="flex justify-between">
                  <span>Hard:</span>
                  <strong>{feedback.difficulty.Hard}</strong>
                </div>
              </div>
            )}
          </Card>
        </div>

        <Card title="Actions">
          <div className="space-y-3">
            <button 
              className="btn-primary w-full disabled:opacity-50"
              onClick={updatePlan}
              disabled={updating || !feedback || feedback.total < 3}
            >
              {updating ? "Updating..." : "🔄 Update Plan"}
            </button>
            <Link href="/onboard/goal" className="small-btn w-full block text-center">
              ✨ New Plan
            </Link>
          </div>
        </Card>
      </main>
    </>
  );
}