import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import ChoiceCard from "../../components/ChoiceCard";

export default function Equipment() {
  const router = useRouter();
  const { goal, experience, time, days } = router.query;

  const options = [
    { id: "gym", icon: "🏋️", title: "Gym (barbell + machines)", desc: "Full equipment access" },
    { id: "home_equips", icon: "🏠", title: "Home (dumbbells + bands)", desc: "Dumbbells, bands, bench" },
    { id: "body_only", icon: "🤸", title: "Bodyweight only", desc: "No equipment" },
    { id: "mixed", icon: "🔀", title: "Mixed", desc: "Access to a bit of both" }
  ];

  return (
    <>
      <Navbar />
      <BottomNav />

      <main className="container max-w-3xl mt-6 mb-24">
        <h2 className="text-3xl font-bold mb-4">Which equipment do you have?</h2>
        <p className="text-slate-600 dark:text-slate-300 mb-4">Pick the option that best matches what you can realistically use.</p>

        <div className="grid md:grid-cols-2 gap-4">
          {options.map(o => (
            <Link
              key={o.id}
              href={`/onboard/style?goal=${encodeURIComponent(goal)}&experience=${encodeURIComponent(experience)}&time=${encodeURIComponent(time)}&days=${days}&equipment=${o.id}`}
            >
              <ChoiceCard icon={o.icon} title={o.title} desc={o.desc} />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
