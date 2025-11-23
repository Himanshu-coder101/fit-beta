import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import ChoiceCard from "../../components/ChoiceCard";

export default function Equipment() {
  const router = useRouter();
  const { goal, experience, time, days } = router.query;

  const options = [
    { id: "gym", icon: "🏋️", title: "Full Gym", desc: "All equipment" },
    { id: "home_equips", icon: "🏠", title: "Home Gym", desc: "Dumbbells & bands" },
    { id: "body_only", icon: "🤸", title: "Bodyweight", desc: "No equipment" },
  ];

  return (
    <>
      <Navbar />
      <BottomNav />
      <main className="container max-w-3xl mt-6 mb-24">
        <h2 className="text-3xl font-bold mb-4">Equipment available?</h2>
        <div className="grid md:grid-cols-2 gap-4">
          {options.map(o => (
            <Link
              key={o.id}
              href={`/onboard/summary?goal=${goal}&experience=${experience}&time=${time}&days=${days}&equipment=${o.id}`}
            >
              <ChoiceCard icon={o.icon} title={o.title} desc={o.desc} />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}