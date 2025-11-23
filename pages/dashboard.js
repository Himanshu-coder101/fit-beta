// pages/dashboard.js - FIXED VERSION
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";
import Card from "../components/Card";
import Link from "next/link";

import { summarizeFeedback } from "../lib/feedback";
import { adaptExistingPlan } from "../lib/trainingEngine";

export default function Dashboard() {
  const [plan, setPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [feedbackSummary, setFeedbackSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enhancing, setEnhancing] = useState(false);

  useEffect(() => {
    loadDashboardData();
  }, []);

  async function loadDashboardData() {
    try {
      const savedProfile = localStorage.getItem("ft_profile");
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }

      const savedPlan = localStorage.getItem("ft_plan_v1");
      if (savedPlan) {
        setPlan(JSON.parse(savedPlan));
        setLoading(false);
      } else {
        const response = await fetch("/api/plan");
        const planData = await response.json();
        setPlan(planData);
        localStorage.setItem("ft_plan_v1", JSON.stringify(planData));
        setLoading(false);
      }

      const fb = summarizeFeedback({ lastN: 20 });
      setFeedbackSummary(fb);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setLoading(false);
    }
  }

  async function enhanceWithAI() {
    if (!profile) {
      alert("Please complete onboarding first!");
      return;
    }

    setEnhancing(true);

    try {
      const res = await fetch("/api/ai-recs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userInputs: profile })
      });

      const data = await res.json();
      
      if (data.sessions && data.sessions.length > 0) {
        const enhanced = { 
          ...plan, 
          sessions: data.sessions,
          meta: { 
            ...plan?.meta,
            aiEnhanced: true,
            enhancedAt: new Date().toISOString()
          }
        };
        
        setPlan(enhanced);
        localStorage.setItem("ft_plan_v1", JSON.stringify(enhanced));
        alert("✅ AI-enhanced plan generated successfully!");
      } else {
        alert("⚠️ AI enhancement not available. Using rule-based plan.");
      }
    } catch (error) {
      console.error("AI enhancement error:", error);
      alert("❌ AI enhancement failed. Your current plan is still active.");
    } finally {
      setEnhancing(false);
    }
  }

  function regeneratePlan() {
    if (!plan || !profile) {
      alert("No plan found. Please complete onboarding first.");
      return;
    }

    try {
      const summary = summarizeFeedback({ lastN: 20 }) || {};
      const newPlan = adaptExistingPlan(plan, summary, profile);
      localStorage.setItem("ft_plan_v1", JSON.stringify(newPlan));
      setPlan(newPlan);
      alert("✅ Plan updated with adaptive progression!");
    } catch (error) {
      console.error("Error regenerating plan:", error);
      alert("❌ Failed to regenerate plan. Please try again.");
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container p-8">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="text-4xl mb-4">🏋️</div>
              <p className="text-lg">Loading your dashboard…</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (!plan || !plan.sessions || plan.sessions.length === 0) {
    return (
      <>
        <Navbar />
        <BottomNav />
        <main className="container mt-8 mb-20">
          <Card title="No Plan Found">
            <p className="mb-4">You don't have a workout plan yet.</p>
            <Link href="/onboard/goal" className="btn-primary">
              Create Your First Plan
            </Link>
          </Card>
        </main>
      </>
    );
  }

  const nextSession = plan.sessions[0];

  return (
    <>
      <Navbar />
      <BottomNav />

      <main className="container mt-4 mb-20 grid gap-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">
            Welcome back 👋
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Your personalized training dashboard
          </p>
        </div>

        {nextSession && (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-ft-blue to-ft-teal text-white shadow-xl relative overflow-hidden">
            <h3 className="text-xl font-semibold mb-1">Your Next Workout</h3>
            <p className="opacity-90 mb-4">{nextSession.day}</p>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="opacity-90">
                  {nextSession.exercises?.length || 0} exercises •{" "}
                  {profile?.timePerSession || 40} mins
                </p>
              </div>

              <Link
                href="/day/1"
                className="bg-white text-ft-blue px-4 py-2 rounded-xl font-semibold shadow-md hover:scale-105 transition"
              >
                Start →
              </Link>
            </div>

            <div className="absolute right-4 bottom-4 text-6xl opacity-20">
              💪
            </div>
          </div>
        )}

        <Card title="This Week's Plan">
          <div className="grid gap-3">
            {plan.sessions.map((session, idx) => (
              <Link
                href={`/day/${idx + 1}`}
                key={idx}
                className="interactive p-4 rounded-xl border bg-white/50 dark:bg-white/10 hover:shadow-md transition flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{session.day || `Day ${idx + 1}`}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {session.exercises?.length || 0} exercises •{" "}
                    {profile?.timePerSession || 40} mins
                  </p>
                </div>
                <span className="text-xl">➡️</span>
              </Link>
            ))}
          </div>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          <Card title="Activity Streak">
            <div className="text-center">
              <div className="text-5xl font-bold text-ft-blue">
                {feedbackSummary?.total || 0}
              </div>
              <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">
                Total logged sessions
              </p>
            </div>
          </Card>

          <Card title="Adaptive Summary">
            {!feedbackSummary ? (
              <p className="text-slate-600 text-sm">
                No feedback yet. Your plan will adapt once you log sessions.
              </p>
            ) : (
              <div className="text-sm space-y-1">
                <p><strong>Easy:</strong> {feedbackSummary.difficulty.Easy}</p>
                <p><strong>Moderate:</strong> {feedbackSummary.difficulty.Moderate}</p>
                <p><strong>Hard:</strong> {feedbackSummary.difficulty.Hard}</p>
                <p><strong>Missed reps:</strong> {feedbackSummary.missedRepsCount}</p>
              </div>
            )}
          </Card>
        </div>

        <Card title="Actions">
          <div className="flex flex-col gap-3">
            <button 
              className="btn-primary text-center disabled:opacity-50"
              onClick={enhanceWithAI}
              disabled={enhancing}
            >
              {enhancing ? "Enhancing with AI..." : "🤖 Enhance Plan with AI"}
            </button>

            <button 
              className="small-btn text-center w-full"
              onClick={regeneratePlan}
            >
              🔄 Regenerate Adaptive Plan
            </button>

            <Link href="/onboard/goal" className="small-btn text-center">
              ✨ Start a New Plan
            </Link>

            <Link href="/weekly-plan" className="small-btn text-center">
              📅 View Full Plan
            </Link>
          </div>
        </Card>

        {plan?.meta?.aiEnhanced && (
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            ✨ This plan was AI-enhanced on{" "}
            {new Date(plan.meta.enhancedAt).toLocaleDateString()}
          </div>
        )}
      </main>
    </>
  );
}