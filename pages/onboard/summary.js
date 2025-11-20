import { useRouter } from "next/router";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import { useState } from "react";

export default function Summary() {
  const router = useRouter();
  const q = router.query;
  const [loading, setLoading] = useState(false);

  async function createPlan() {
    setLoading(true);

    const profile = {
      goal: q.goal,
      experience: q.experience,
      daysPerWeek: Number(q.days),
      timePerSession: Number((q.time || "").split("-")[0]) || 30,
      equipment:
        q.equipment === "gym"
          ? ["barbell", "dumbbell"]
          : q.equipment === "home_equips"
          ? ["dumbbell", "bands"]
          : ["bodyweight"],
      style: q.style,
      adaptationStyle: q.adapt || "moderate"
    };

    localStorage.setItem("ft_profile", JSON.stringify(profile));

    await fetch("/api/plan", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(profile)
    });

    setLoading(false);
    router.push("/dashboard");
  }

  return (
    <>
      <Navbar />
      <BottomNav />

      <main className="container max-w-2xl mt-6 mb-24">
        <h2 className="text-3xl font-bold mb-4">Summary</h2>
        <div className="card">
          <p><strong>Goal:</strong> {q.goal}</p>
          <p><strong>Experience:</strong> {q.experience}</p>
          <p><strong>Days / week:</strong> {q.days}</p>
          <p><strong>Time per session:</strong> {q.time} mins</p>
          <p><strong>Equipment:</strong> {q.equipment}</p>
          <p><strong>Training Style:</strong> {q.style}</p>
          <p><strong>Adaptation:</strong> {q.adapt}</p>

          <div className="mt-4 flex gap-3">
            <button onClick={createPlan} className="btn-primary">
              {loading ? "Creating…" : "Create my plan"}
            </button>
            <button onClick={() => router.back()} className="small-btn">Back</button>
          </div>
        </div>
      </main>
    </>
  );
}
