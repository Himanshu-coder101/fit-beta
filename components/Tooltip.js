export default function Tooltip({ label }) {
  return (
    <div className="group relative inline-block">
      <span className="cursor-pointer px-1 text-slate-400 hover:text-slate-200">ⓘ</span>
      <div className="absolute hidden group-hover:block z-30 w-52 p-2 text-sm rounded-lg bg-slate-900 text-white border border-slate-700 shadow-lg -right-2 top-6">
        {label}
      </div>
    </div>
  );
}
