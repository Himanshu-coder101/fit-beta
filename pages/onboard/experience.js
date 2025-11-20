import { useRouter } from "next/router";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import BottomNav from "../../components/BottomNav";
import ChoiceCard from "../../components/ChoiceCard";

export default function Experience() {
  const router = useRouter();
  const { goal } = router.query;

  const opts = [
    { id: "beginner", icon: "🌱", title: "Beginner", desc: "0–6 months lifting" },
    { id: "intermediate", icon: "📈", title: "Intermediate", desc: "6–24 months" },
    { id: "advanced", icon: "🦾", title: "Advanced", desc: "2+ years experience" },
  ];

  return (
    <>
      <Navbar />
      <BottomNav />

      <main className="container max-w-3xl mt-6 mb-24">
        <h2 className="text-3xl font-bold mb-4">Your training experience</h2>

        <div className="grid md:grid-cols-2 gap-4">
          {opts.map((o) => (
            <Link
              key={o.id}
              href={`/onboard/time?goal=${goal}&experience=${o.id}`}
            >
              <ChoiceCard icon={o.icon} title={o.title} desc={o.desc} />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
