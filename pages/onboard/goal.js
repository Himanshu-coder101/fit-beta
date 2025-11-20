import Link from "next/link";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import ChoiceCard from "../../components/ChoiceCard";

export default function Goal() {
  const goals = [
    { id: "Fat Loss", icon: "🔥", desc: "Lose fat sustainably" },
    { id: "Muscle Gain", icon: "💪", desc: "Build muscle & size" },
    { id: "Strength", icon: "🏋️‍♂️", desc: "Get stronger fast" },
    { id: "Endurance", icon: "🏃‍♂️", desc: "Improve stamina" },
    { id: "Recomp", icon: "⚖️", desc: "Lose fat & gain muscle" },
  ];

  return (
    <>
      <Navbar />
      <BottomNav />

      <main className="container max-w-3xl mt-6 mb-24">
        <h2 className="text-3xl font-bold mb-4">What's your main goal?</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-6">
          Select your primary objective. Your plan will adjust accordingly.
        </p>

        <div className="grid md:grid-cols-2 gap-4">
          {goals.map((g) => (
            <Link
              key={g.id}
              href={`/onboard/experience?goal=${encodeURIComponent(g.id)}`}
            >
              <ChoiceCard icon={g.icon} title={g.id} desc={g.desc} />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
