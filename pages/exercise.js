import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProfileModal from '../components/ProfileModal';
import { exerciseCatalog, suggestWeight } from "../lib/exerciseLib";

export default function Exercise() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (session) {
      fetch('/api/profile').then(r => r.json()).then(setProfile);
    }
  }, [session]);
  if (!session) return <p className="p-8">Login first</p>;

  if (!profile)
    return <ProfileModal open={true} initialData={{...session.user}} onClose={()=>{}} onSubmit={() =>{}} />;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="font-bold text-2xl mb-3">Exercises</h1>
      <div className="flex flex-col gap-5">
        {exerciseCatalog.map((ex,i)=>(
          <div key={i}
            className="bg-white dark:bg-gray-900 p-4 rounded-md shadow">
            <h2 className="font-semibold">{ex.name}</h2>
            <p>Recommended weight: <b>{suggestWeight(ex.name, profile.gender, profile.experience)}</b></p>
            <a className="text-ft-blue underline" href={ex.video} target="_blank">Watch how</a>
          </div>
        ))}
      </div>
    </div>
  )
}
