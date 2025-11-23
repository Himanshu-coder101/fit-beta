export default function Card({ title, children, className = "" }) {
  return (
    <div
      className={`
        rounded-xl 
        p-5 
        bg-white/10 
        dark:bg-white/5 
        backdrop-blur-md 
        border 
        border-white/20 
        shadow-lg 
        ${className}
      `}
    >
      {title && (
        <h3 className="text-xl font-semibold mb-4 text-white">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}
