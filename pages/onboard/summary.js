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
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile)
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
        <h2 className="text-3xl font-bold mb-6">Review & Create</h2>
        <div className="card space-y-3">
          <div className="flex justify-between">
            <span>Goal:</span>
            <strong>{q.goal}</strong>
          </div>
          <div className="flex justify-between">
            <span>Experience:</span>
            <strong>{q.experience}</strong>
          </div>
          <div className="flex justify-between">
            <span>Days/week:</span>
            <strong>{q.days}</strong>
          </div>
          <div className="flex justify-between">
            <span>Time:</span>
            <strong>{q.time}</strong>
          </div>
          <div className="flex justify-between">
            <span>Equipment:</span>
            <strong>{q.equipment}</strong>
          </div>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-red-100 text-red-700">
              ❌ {error}
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button onClick={createPlan} className="btn-primary flex-1" disabled={loading}>
              {loading ? "Creating..." : "🚀 Generate Plan"}
            </button>
            <button onClick={() => router.back()} className="small-btn">Back</button>
          </div>
        </div>
      </main>
    </>
  );
}