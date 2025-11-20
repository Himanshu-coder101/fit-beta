import Navbar from '../components/Navbar'
import Link from 'next/link'

export default function Home(){
  return (
    <>
      <Navbar />
      <main className="container p-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">FitTrack Pro — Coach-guided plans</h1>
            <p className="text-slate-700 dark:text-slate-300 mb-6">Personalized, professional training programs that adapt to your experience, time and equipment.</p>
            <div className="flex gap-3">
              <Link href="/onboard/goal" className="btn-primary">Create my plan</Link>
              <Link href="/dashboard" className="small-btn">Open dashboard</Link>
            </div>
          </div>
          <div className="card">
            <h3 className="text-xl font-semibold mb-3">How it works</h3>
            <ol className="list-decimal pl-5 text-slate-700 dark:text-slate-300">
              <li>Choose goal → experience → time & equipment</li>
              <li>Get a 100% coach-like weekly plan</li>
              <li>Log workouts and give feedback — plan adapts weekly</li>
            </ol>
          </div>
        </div>
      </main>
    </>
  )
}
