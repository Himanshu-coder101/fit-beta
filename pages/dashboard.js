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

  useEffect(() => {
    const savedProfile = localStorage.getItem("ft_profile");
    if (savedProfile) setProfile(JSON.parse(savedProfile));

    fetch("/api/plan")
      .then((r) => r.json())
      .then((p) => {
        setPlan(p);
        setLoading(false);
      });

    const fb = summarizeFeedback({ lastN: 20 });
    setFeedbackSummary(fb);
  }, []);

  function regeneratePlan() {
    if (!plan || !profile) {
      alert("No plan found.");
      return;
    }
    const summary = summarizeFeedback({ lastN: 20 }) || {};
    const newPlan = adaptExistingPlan(plan, summary, profile);
    localStorage.setItem("ft_plan", JSON.stringify(newPlan));
    setPlan(newPlan);
    alert("Plan updated with adaptive progression!");
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="container p-8">
          <p>Loading your dashboard…</p>
        </main>
      </>
    );
  }

  const nextSession = plan?.sessions?.[0];

  return (
    <>
      <Navbar />
      <BottomNav />

      <main className="container mt-4 mb-20 grid gap-6">

        {/* ------------------------- */}
        {/* HEADER — Welcome message */}
        {/* ------------------------- */}
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-1">
            Welcome back 👋
          </h2>
          <p className="text-slate-600 dark:text-slate-300">
            Your personalized training dashboard
          </p>
        </div>

        {/* ----------------------------------- */}
        {/* NEXT WORKOUT — Premium hero widget */}
        {/* ----------------------------------- */}
        {nextSession && (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-ft-blue to-ft-teal text-white shadow-xl relative overflow-hidden">
            <h3 className="text-xl font-semibold mb-1">Your Next Workout</h3>
            <p className="opacity-90 mb-4">{nextSession.day}</p>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <p className="opacity-90">
                  {nextSession.exercises.length} exercises •{" "}
                  {profile?.timePerSession || 40} mins
                </p>
              </div>

              <Link
                href="/day/1"
                className="bg-white text-ft-blue px-4 py-2 rounded-xl font-semibold shadow-md"
              >
                Start →
              </Link>
            </div>

            <div className="absolute right-4 bottom-4 text-6xl opacity-20">
              💪
            </div>
          </div>
        )}

        {/* ------------------------------ */}
        {/* WEEKLY PLAN LIST (New layout) */}
        {/* ------------------------------ */}
        <Card title="This Week’s Plan">
          <div className="grid gap-3">
            {plan.sessions.map((session, idx) => (
              <Link
                href={`/day/${idx + 1}`}
                key={idx}
                className="interactive p-4 rounded-xl border bg-white/50 dark:bg-white/10 hover:shadow-md transition flex justify-between items-center"
              >
                <div>
                  <h4 className="font-semibold">{session.day}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-300">
                    {session.exercises.length} exercises •{" "}
                    {profile?.timePerSession || 40} mins
                  </p>
                </div>

                <span className="text-xl">➡️</span>
              </Link>
            ))}
          </div>
        </Card>

        {/* ---------------------------- */}
        {/* STREAK + FEEDBACK SUMMARY    */}
        {/* ---------------------------- */}
        <div className="grid md:grid-cols-2 gap-6">

          {/* STREAK CARD */}
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

          {/* ADAPTIVE SUMMARY */}
          <Card title="Adaptive Summary">
            {!feedbackSummary ? (
              <p className="text-slate-600">
                No feedback yet — your plan will adapt once you log sessions.
              </p>
            ) : (
              <div className="text-sm">
                <p>
                  <strong>Easy:</strong> {feedbackSummary.difficulty.Easy}
                </p>
                <p>
                  <strong>Moderate:</strong> {feedbackSummary.difficulty.Moderate}
                </p>
                <p>
                  <strong>Hard:</strong> {feedbackSummary.difficulty.Hard}
                </p>
                <p>
                  <strong>Missed reps:</strong> {feedbackSummary.missedRepsCount}
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* ------------------- */}
        {/* ACTION BUTTONS      */}
        {/* ------------------- */}
        <Card title="Actions">
          <div className="flex flex-col gap-3">
            <button className="btn-primary text-center" onClick={regeneratePlan}>
              Regenerate Adaptive Plan
            </button>

            <Link href="/onboard/goal" className="small-btn text-center">
              Start a New Plan
            </Link>

            <Link href="/weekly-plan" className="small-btn text-center">
              View Full Plan
            </Link>
          </div>
        </Card>

      </main>
    </>
  );
}
