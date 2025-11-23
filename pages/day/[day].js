import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import Card from "../../components/Card";
import { saveSessionFeedback } from "../../lib/feedback";
import { getExerciseWeight, setExerciseWeight } from "../../lib/weights";

export default function DayPage() {
  const router = useRouter();
  const { day } = router.query;
  const [session, setSession] = useState(null);
  const [swapIdx, setSwapIdx] = useState(null);
  const [alts, setAlts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!day) return;
    const plan = JSON.parse(localStorage.getItem("ft_plan_v1") || '{}');
    setSession(plan.sessions?.[Number(day) - 1]);
  }, [day]);

  async function swap(i, ex) {
    setSwapIdx(i);
    setLoading(true);
    const prof = JSON.parse(localStorage.getItem("ft_profile") || '{}');
    
    try {
      const res = await fetch("/api/get-alternatives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseName: ex.name, equipment: prof.equipment })
      });
      const data = await res.json();
      setAlts(Array.isArray(data) ? data : []);
    } catch (e) {
      setAlts([]);
    }
    setLoading(false);
  }

  function apply(i, newEx) {
    const upd = { ...session };
    upd.exercises[i] = newEx;
    setSession(upd);
    
    const plan = JSON.parse(localStorage.getItem("ft_plan_v1"));
    plan.sessions[Number(day) - 1] = upd;
    localStorage.setItem("ft_plan_v1", JSON.stringify(plan));
    
    setSwapIdx(null);
    setAlts([]);
  }

  function save(name, el) {
    if (!el.value) return;
    setExerciseWeight(name, Number(el.value), "kg");
    el.classList.add("ring", "ring-green-500");
    setTimeout(() => el.classList.remove("ring", "ring-green-500"), 500);
  }

  function submit(e) {
    e.preventDefault();
    const f = e.target;
    saveSessionFeedback({
      sessionIndex: Number(day) - 1,
      difficulty: f.difficulty.value,
      soreness: f.soreness.value,
      missedReps: f.missed.checked,
      notes: f.notes.value
    });
    alert("✅ Saved!");
    f.reset();
  }

  if (!session) return <div className="p-20 text-center">Loading...</div>;

  return (
    <>
      <Navbar />
      <BottomNav />
      <main className="container mb-24">
        <h2 className="text-3xl font-bold my-6">{session.day}</h2>

        <div className="space-y-5">
          {session.exercises?.map((ex, i) => {
            const saved = getExerciseWeight(ex.name);
            return (
              <div key={i} className="card">
                <h3 className="text-xl font-bold mb-2">{ex.name}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{ex.notes}</p>
                
                <div className="flex gap-2 text-sm mb-3">
                  <span className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-white/10">
                    {ex.sets} x {ex.reps}
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-blue-200 dark:bg-blue-900/30">
                    {ex.rest_sec}s rest
                  </span>
                </div>

                <div className="flex gap-2 items-center mb-3">
                  <input
                    id={`w${i}`}
                    placeholder="Weight (kg)"
                    defaultValue={saved?.weight || ""}
                    className="px-3 py-2 rounded-xl w-28 bg-white/50 dark:bg-white/10 border"
                  />
                  <button
                    onClick={() => save(ex.name, document.getElementById(`w${i}`))}
                    className="small-btn"
                  >
                    Save
                  </button>
                  {saved && <span className="text-xs">Last: {saved.weight}kg</span>}
                </div>

                <button onClick={() => swap(i, ex)} className="small-btn">
                  Swap Exercise
                </button>

                {swapIdx === i && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-white/10">
                    <h4 className="font-semibold mb-2">Alternatives:</h4>
                    {loading ? (
                      <p>Loading...</p>
                    ) : alts.length === 0 ? (
                      <p className="text-sm">No alternatives found</p>
                    ) : (
                      <div className="space-y-2">
                        {alts.map((alt, ai) => (
                          <button
                            key={ai}
                            onClick={() => apply(i, alt)}
                            className="block w-full p-3 rounded-xl bg-white dark:bg-white/5 text-left hover:bg-ft-blue/10"
                          >
                            <div className="font-semibold">{alt.name}</div>
                            <div className="text-xs opacity-60">{alt.notes}</div>
                          </button>
                        ))}
                      </div>
                    )}
                    <button onClick={() => setSwapIdx(null)} className="mt-2 small-btn">
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <Card title="Session Feedback" className="mt-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="font-semibold">Difficulty</label>
              <select name="difficulty" className="mt-1 p-3 rounded-xl w-full bg-white/60 dark:bg-white/10">
                <option>Easy</option>
                <option>Moderate</option>
                <option>Hard</option>
              </select>
            </div>

            <div>
              <label className="font-semibold">Soreness</label>
              <select name="soreness" className="mt-1 p-3 rounded-xl w-full bg-white/60 dark:bg-white/10">
                <option>None</option>
                <option>Mild</option>
                <option>High</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input type="checkbox" name="missed" id="missed" />
              <label htmlFor="missed">Missed reps?</label>
            </div>

            <div>
              <label className="font-semibold">Notes</label>
              <textarea
                name="notes"
                className="mt-1 p-3 rounded-xl w-full bg-white/60 dark:bg-white/10"
                placeholder="How did it feel?"
              ></textarea>
            </div>

            <button className="btn-primary w-full">Save Feedback</button>
          </form>
        </Card>
      </main>
    </>
  );
}