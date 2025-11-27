import { useRouter } from "next/router";
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
}