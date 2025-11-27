import { useState, useEffect } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import ProfileModal from '../components/ProfileModal';

export default function Home() {
  const { data: session, status } = useSession();
  const [authChoice, setAuthChoice] = useState(false); // Google or Guest
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [profile, setProfile] = useState(null);
  const [guest, setGuest] = useState(false);
  const [starting, setStarting] = useState(true);

  // Only run on mount
  useEffect(() => {
    setStarting(false);
    // If profile_complete is yes, double check backend profile and auto route to dashboard if valid
    if (localStorage.getItem('profile_complete') === 'yes') {
      fetch('/api/profile').then(r=>r.json()).then(data => {
        if (data && data.name && data.gender && data.age && data.weight) {
          window.location.href = '/dashboard';
        } else {
          localStorage.removeItem('profile_complete');
        }
      });
    }
  }, []);

  // After Google login or guest selection, check for profile
  useEffect(() => {
    if ((session || guest) && !profile) {
      fetch('/api/profile').then(r => r.json()).then(data => {
        if (data && data.name && data.gender && data.age && data.weight) {
          localStorage.setItem('profile_complete', 'yes');
          setProfile(data);
          setShowProfileModal(false);
          window.location.href = '/dashboard';
        } else {
          setShowProfileModal(true);
        }
      });
    }
  }, [session, guest]);

  async function handleProfileSubmit(form) {
    await fetch('/api/profile', {
      method: 'POST',
      body: JSON.stringify(form),
      headers: { 'Content-Type': 'application/json' }
    }).then(r => r.json())
      .then(data => {
        localStorage.setItem('profile_complete', 'yes');
        setProfile(data);
        setShowProfileModal(false);
        window.location.href = '/dashboard';
      });
  }

  const handleGuest = () => {
    setGuest(true);
    setAuthChoice(true);
    signOut({ redirect: false });
    localStorage.removeItem('profile_complete');
    setProfile(null);
  };

  // After Google login, set authChoice to trigger profile check
  useEffect(() => {
    if (session && !authChoice) setAuthChoice(true);
  }, [session]);

  if (starting || status === "loading") return <div />;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center relative bg-gradient-to-tr from-blue-100 via-blue-50 to-pink-100 dark:from-slate-900 dark:via-slate-950 dark:to-gray-900">
      <div className="bg-white/70 dark:bg-slate-900/80 shadow-2xl p-8 rounded-3xl max-w-xl w-full mt-16 flex flex-col items-center border-blue-50 border">
        <img src="/logo.png" alt="Logo" className="mb-4 w-20 h-20" />
        <h1 className="text-3xl font-extrabold text-blue-700 dark:text-blue-300 mb-2 tracking-tight">Fit Beta</h1>
        <div className="text-gray-700 dark:text-gray-100 mb-4 text-lg text-center">Your Personal Fitness Transformation Platform</div>
        {(!session && !guest) ? (
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button className="btn-primary flex items-center justify-center gap-2" onClick={()=>signIn('google')}>
              <img src="/google.svg" alt="" className="w-6 h-6" />
              Continue with Google
            </button>
            <button className="btn-outline" onClick={handleGuest}>Continue as Guest</button>
          </div>
        ) : null}
        {/* TEMP: Reset for dev/demo */}
        <button className="mt-6 text-xs text-blue-400 underline" onClick={() => { localStorage.removeItem('profile_complete'); fetch('/api/profile', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({}) }); window.location.reload(); }}>
          Reset Demo (For Testing)
        </button>
      </div>
      <ProfileModal
        open={showProfileModal}
        onSubmit={handleProfileSubmit}
        initialData={session ? { name: session.user.name } : undefined}
      />
    </div>
  );
}
