export default function ChoiceCard({ icon, title, desc }) {
  return (
    <div className="
      p-6 rounded-2xl shadow-lg bg-white/60 dark:bg-white/10 
      backdrop-blur-xl border border-white/30 dark:border-white/10
      hover:scale-[1.03] transition cursor-pointer
    ">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="font-semibold text-lg">{title}</h3>
      {desc && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{desc}</p>
      )}
    </div>
  );
}
