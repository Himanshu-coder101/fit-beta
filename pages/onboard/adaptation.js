import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import ChoiceCard from "../../components/ChoiceCard";

export default function Adaptation() {
  const router = useRouter();
  const { goal, experience, time, days, equipment, style } = router.query;

  const options = [
    {
      id: "conservative",
      icon: "🛡️",
      title: "Conservative",
      desc: "Slow, steady progress. Safer jumps."
    },
    {
      id: "moderate",
      icon: "⚖️",
      title: "Moderate",
      desc: "Balanced progress for most users."
    },
    {
      id: "aggressive",
      icon: "🔥",
      title: "Aggressive",
      desc: "Faster progression for experienced lifters."
    }
  ];

  return (
    <>
      <Navbar />
      <BottomNav />

      <main className="container max-w-3xl mt-6 mb-24">
        <h2 className="text-3xl font-bold mb-4">Progression speed</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">Pick how aggressively the plan should push you each week.</p>

        <div className="grid md:grid-cols-2 gap-4">
          {options.map(o => (
            <Link
              key={o.id}
              href={`/onboard/summary?goal=${encodeURIComponent(goal)}&experience=${encodeURIComponent(experience)}&time=${encodeURIComponent(time)}&days=${days}&equipment=${equipment}&style=${style}&adapt=${o.id}`}
            >
              <ChoiceCard icon={o.icon} title={o.title} desc={o.desc} />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
