import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import ChoiceCard from "../../components/ChoiceCard";

export default function Frequency() {
  const router = useRouter();
  const { goal, experience, time } = router.query;

  const opts = [
    { id: 3, icon: "📅", title: "3 days/week", desc: "Good for beginners" },
    { id: 4, icon: "📅", title: "4 days/week", desc: "Upper/Lower split" },
    { id: 5, icon: "📅", title: "5 days/week", desc: "Balanced training" },
    { id: 6, icon: "📅", title: "6 days/week", desc: "Advanced PPL" },
  ];

  return (
    <>
      <Navbar />
      <BottomNav />

      <main className="container max-w-3xl mt-6 mb-24">
        <h2 className="text-3xl font-bold mb-4">
          How many days a week can you train?
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          {opts.map((o) => (
            <Link
              key={o.id}
              href={`/onboard/equipment?goal=${goal}&experience=${experience}&time=${time}&days=${o.id}`}
            >
              <ChoiceCard icon={o.icon} title={o.title} desc={o.desc} />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
