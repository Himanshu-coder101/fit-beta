import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import ChoiceCard from "../../components/ChoiceCard";

export default function Style() {
  const router = useRouter();
  const { goal, experience, time, days, equipment } = router.query;

  const opts = [
    { id: "strength", icon: "🏋️‍♂️", title: "Strength", desc: "Low reps, heavy loads" },
    { id: "hypertrophy", icon: "💪", title: "Hypertrophy", desc: "Build muscle & shape" },
    { id: "endurance", icon: "🏃‍♀️", title: "Endurance", desc: "Higher reps, conditioning" },
    { id: "balanced", icon: "⚖️", title: "Balanced", desc: "Mix of strength & size" }
  ];

  return (
    <>
      <Navbar />
      <BottomNav />

      <main className="container max-w-3xl mt-6 mb-24">
        <h2 className="text-3xl font-bold mb-4">Pick a training style</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">This helps tune rep ranges and progression speed.</p>

        <div className="grid md:grid-cols-2 gap-4">
          {opts.map(o => (
            <Link
              key={o.id}
              href={`/onboard/adaptation?goal=${encodeURIComponent(goal)}&experience=${encodeURIComponent(experience)}&time=${encodeURIComponent(time)}&days=${days}&equipment=${equipment}&style=${o.id}`}
            >
              <ChoiceCard icon={o.icon} title={o.title} desc={o.desc} />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
