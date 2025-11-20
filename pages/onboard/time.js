import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import ChoiceCard from "../../components/ChoiceCard";

export default function Time() {
  const router = useRouter();
  const { goal, experience } = router.query;

  const opts = [
    { id: "20-30", icon: "⏱", title: "20–30 mins", desc: "Quick efficient sessions" },
    { id: "30-45", icon: "⌛", title: "30–45 mins", desc: "Balanced workouts" },
    { id: "45-60", icon: "🔥", title: "45–60 mins", desc: "Best for muscle gain" },
    { id: "60+", icon: "⚡", title: "60+ mins", desc: "High volume training" },
  ];

  return (
    <>
      <Navbar />
      <BottomNav />

      <main className="container max-w-3xl mt-6 mb-24">
        <h2 className="text-3xl font-bold mb-4">How long are your sessions?</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {opts.map((o) => (
            <Link
              key={o.id}
              href={`/onboard/frequency?goal=${goal}&experience=${experience}&time=${o.id}`}
            >
              <ChoiceCard icon={o.icon} title={o.title} desc={o.desc} />
            </Link>
          ))}
        </div>

      </main>
    </>
  );
}
