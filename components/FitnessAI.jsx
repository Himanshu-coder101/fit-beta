import { useSession, signIn, signOut } from 'next-auth/react';
import { supabase } from '@/lib/supabaseClient';

export default function FitnessAIPro() {
  const { data: session } = useSession();
  const [inputs, setInputs] = useState({});
  const [workout, setWorkout] = useState(null);
  const [nutrition, setNutrition] = useState(null);
  const [supplements, setSupplements] = useState(null);
  const [sleepPlan, setSleepPlan] = useState(null);
  const [progression, setProgression] = useState(null);

  const generateAll = async () => {
    const body = { userInputs: inputs };
    const [wResp, nResp, sResp, slResp, pResp] = await Promise.all([
      fetch('/api/ai-recs', { method: 'POST', body: JSON.stringify(body) }).then(r=>r.json()),
      fetch('/api/ai-nutrition', { method: 'POST', body: JSON.stringify(body) }).then(r=>r.json()),
      fetch('/api/ai-supplements', { method: 'POST', body: JSON.stringify(body) }).then(r=>r.json()),
      fetch('/api/ai-sleep', { method: 'POST', body: JSON.stringify(body) }).then(r=>r.json()),
      fetch('/api/ai-progression', { method: 'POST', body: JSON.stringify(body) }).then(r=>r.json()),
    ]);

    setWorkout(wResp);
    setNutrition(nResp);
    setSupplements(sResp);
    setSleepPlan(slResp);
    setProgression(pResp);

    // Save to Supabase if logged in, else localStorage
    const record = { user_id: session?.user?.id || null, created_at: new Date().toISOString(), inputs, workout: wResp, nutrition: nResp };
    if (session) {
      await supabase.from('fitness_history').insert(record);
    } else {
      const existing = JSON.parse(localStorage.getItem('fitness_history') || '[]');
      existing.unshift(record);
      localStorage.setItem('fitness_history', JSON.stringify(existing));
    }
  };

  const downloadPDF = async () => {
    const resp = await fetch('/api/generate-pdf', { method: 'POST', body: JSON.stringify({ plan: workout }) });
    const blob = await resp.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'workout-plan.pdf'; a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {!session ? <button onClick={() => signIn('google')}>Sign in</button> : <button onClick={() => signOut()}>Sign out</button>}
      {/* inputs and UI omitted here - refer to previous component in canvas */}
      <button onClick={generateAll}>Generate Full Program</button>
      <button onClick={downloadPDF} disabled={!workout}>Download PDF</button>
    </div>
  );
}