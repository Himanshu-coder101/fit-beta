import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import Card from "../../components/Card";
import Tooltip from "../../components/Tooltip";
import { saveSessionFeedback } from "../../lib/feedback";
import { getExerciseWeight, setExerciseWeight } from "../../lib/weights";
import { getAlternatives } from "../../lib/planGenerator";

// Small icon helper based on exercise name
function getIconForExercise(name) {
  name = name.toLowerCase();
  if (name.includes("squat")) return "🦵";
  if (name.includes("dead")) return "🏋️‍♂️";
  if (name.includes("bench")) return "🏋️‍♀️";
  if (name.includes("press")) return "💪";
  if (name.includes("row")) return "🔄";
  if (name.includes("curl")) return "💪";
  if (name.includes("pull")) return "⬆️";
  if (name.includes("push")) return "➡️";
  if (name.includes("lunge")) return "🦿";
  if (name.includes("raise")) return "✨";
  return "🔥";
}

// Muscle group color accents
function getColorAccent(name) {
  name = name.toLowerCase();
  if (name.includes("squat") || name.includes("lunge")) return "bg-purple-500";
  if (name.includes("bench") || name.includes("press")) return "bg-red-500";
  if (name.includes("row") || name.includes("pull")) return "bg-blue-500";
  if (name.includes("curl") || name.includes("raise")) return "bg-yellow-500";
  return "bg-teal-500";
}

export default function DayPage() {
  const router = useRouter();
  const { day } = router.query;

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Swap menu
  const [swapIndex, setSwapIndex] = useState(null);
  const [alts, setAlts] = useState([]);

  useEffect(() => {
    if (!day) return;

    fetch("/api/plan")
      .then((r) => r.json())
      .then((plan) => {
        const index = Number(day) - 1;
        const s = plan.sessions?.[index];
        if (s) setSession(JSON.parse(JSON.stringify(s)));
        setLoading(false);
      });
  }, [day]);

  function saveWeight(name, inputEl) {
    if (!inputEl.value) return;
    setExerciseWeight(name, Number(inputEl.value), "kg");
    inputEl.classList.add("ring", "ring-ft-blue");
    setTimeout(() => inputEl.classList.remove("ring", "ring-ft-blue"), 800);
  }

  function openSwap(i, ex) {
    const eq = ex.equipment?.[0] || "barbell";

    let pool = "gym";
    if (eq === "dumbbell" || eq === "bands") pool = "dumbbell";
    if (eq === "bodyweight") pool = "body";

    const alternatives = getAlternatives(ex.name, pool, 5);
    setSwapIndex(i);
    setAlts(alternatives);
  }

  function applySwap(i, newEx) {
    const updated = { ...session };
    updated.exercises[i] = {
      ...newEx,
      sets: session.exercises[i].sets,
      reps: session.exercises[i].reps,
      intensity_pct: session.exercises[i].intensity_pct,
      rest_sec: session.exercises[i].rest_sec,
      rir: session.exercises[i].rir,
      notes: newEx.notes || session.exercises[i].notes,
    };
    setSession(updated);
    setSwapIndex(null);
    setAlts([]);
  }

  function submitFeedback(e) {
    e.preventDefault();
    const f = e.target;

    saveSessionFeedback({
      sessionIndex: Number(day) - 1,
      difficulty: f.difficulty.value,
      soreness: f.soreness.value,
      missedReps: f.missed.checked,
      notes: f.notes.value,
    });

    alert("Feedback saved. Your plan will adapt.");
    f.reset();
  }

  if (loading)
    return (
      <>
        <Navbar />
        <main className="container p-8">
          <p>Loading session…</p>
        </main>
      </>
    );

  if (!session)
    return (
      <>
        <Navbar />
        <main className="container p-8">
          <p className="text-red-500">Session not found.</p>
        </main>
      </>
    );

  return (
    <>
      <Navbar />
      <BottomNav />

      <main className="container mb-24">
        {/* PAGE HEADER */}
        <h2 className="text-3xl font-bold mt-4 mb-6">{session.day}</h2>

        {/* EXERCISE LIST */}
        <div className="grid gap-5">
          {session.exercises.map((ex, i) => {
            const savedWeight = getExerciseWeight(ex.name);
            const savedDisplay = savedWeight ? `${savedWeight.weight}kg` : null;

            return (
              <div
                key={i}
                className="rounded-3xl p-5 shadow-md bg-white/60 dark:bg-white/10 backdrop-blur-xl border border-white/30 dark:border-white/10 transition"
              >
                {/* TOP ROW — icon + name + tag */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{getIconForExercise(ex.name)}</div>
                    <div>
                      <h3 className="font-bold text-lg">{ex.name}</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm">
                        {ex.notes}
                      </p>
                    </div>
                  </div>

                  <div
                    className={`w-3 h-3 rounded-full ${getColorAccent(
                      ex.name
                    )} shadow`}
                  ></div>
                </div>

                {/* INFO PILLS */}
                <div className="flex flex-wrap gap-2 mt-4 text-sm">
                  <div className="px-3 py-1 rounded-lg bg-slate-200 dark:bg-white/10">
                    {ex.sets} x {ex.reps}
                  </div>

                  <div className="px-3 py-1 rounded-lg bg-blue-200 dark:bg-blue-900/30">
                    {ex.intensity_pct}% 1RM
                  </div>

                  {ex.rir !== undefined && (
                    <div className="px-3 py-1 rounded-lg bg-teal-200 dark:bg-teal-900/30">
                      RIR {ex.rir}
                    </div>
                  )}

                  <div className="px-3 py-1 rounded-lg bg-yellow-200 dark:bg-yellow-900/30">
                    {ex.rest_sec}s rest
                  </div>
                </div>

                <div className="mt-2 flex gap-1">
                  <Tooltip label="Intensity relative to your estimated max" />
                  <Tooltip label="RIR = reps you leave before failure" />
                  <Tooltip label="Rest time between sets" />
                </div>

                {/* WEIGHT INPUT */}
                <div className="mt-4 flex items-center gap-3">
                  <input
                    id={`w${i}`}
                    placeholder="kg"
                    defaultValue={
                      savedDisplay ? savedDisplay.replace("kg", "") : ""
                    }
                    className="px-3 py-2 rounded-xl w-32 bg-white/70 dark:bg-white/5 border border-white/30 dark:border-white/10"
                  />
                  <button
                    className="small-btn"
                    onClick={() =>
                      saveWeight(ex.name, document.getElementById(`w${i}`))
                    }
                  >
                    Save
                  </button>

                  <span className="text-xs text-slate-600 dark:text-slate-400">
                    {savedDisplay || "No saved weight"}
                  </span>
                </div>

                {/* SWAP BUTTON */}
                <div className="mt-4">
                  <button
                    className="small-btn"
                    onClick={() => openSwap(i, ex)}
                  >
                    Swap Exercise
                  </button>
                </div>

                {/* SWAP PANEL */}
                {swapIndex === i && (
                  <div className="mt-4 p-4 rounded-xl bg-slate-100 dark:bg-white/10 border border-white/20">
                    <h4 className="font-semibold mb-2">Choose alternative:</h4>

                    <div className="grid gap-2">
                      {alts.map((alt, ai) => (
                        <button
                          key={ai}
                          className="p-3 rounded-xl bg-white dark:bg-white/5 border border-white/20 text-left hover:bg-ft-blue/10"
                          onClick={() => applySwap(i, alt)}
                        >
                          <div className="font-semibold">{alt.name}</div>
                          <div className="text-xs opacity-60">
                            {(alt.equipment || []).join(", ")}
                          </div>
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => setSwapIndex(null)}
                      className="mt-3 small-btn"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* FEEDBACK FORM */}
        <Card title="Session Feedback" className="mt-6">
          <form onSubmit={submitFeedback} className="grid gap-4">

            <div>
              <label className="font-semibold">Difficulty</label>
              <select
                name="difficulty"
                className="mt-1 p-3 rounded-xl bg-white/60 dark:bg-white/10 w-full"
              >
                <option>Easy</option>
                <option>Moderate</option>
                <option>Hard</option>
              </select>
            </div>

            <div>
              <label className="font-semibold">Soreness</label>
              <select
                name="soreness"
                className="mt-1 p-3 rounded-xl bg-white/60 dark:bg-white/10 w-full"
              >
                <option>None</option>
                <option>Mild</option>
                <option>High</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <input type="checkbox" name="missed" id="missed" />
              <label htmlFor="missed">Missed any reps?</label>
            </div>

            <div>
              <label className="font-semibold">Notes</label>
              <textarea
                name="notes"
                className="mt-1 p-3 rounded-xl bg-white/60 dark:bg-white/10 w-full"
                placeholder="Fatigue, discomfort, performance notes…"
              ></textarea>
            </div>

            <button className="btn-primary w-full mt-2">Save Feedback</button>
          </form>
        </Card>
      </main>
    </>
  );
}
