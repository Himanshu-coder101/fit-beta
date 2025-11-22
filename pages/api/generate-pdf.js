import PDFDocument from 'pdfkit';
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  try {
    const { plan } = JSON.parse(req.body);
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=workout-plan.pdf');
    doc.pipe(res);
    doc.fontSize(20).text('Personalized Workout Plan', { align: 'center' });
    doc.moveDown();
    plan.sessions.forEach((s) => {
      doc.fontSize(16).text(s.name);
      if (s.focus) doc.fontSize(10).text('Focus: ' + s.focus.join(', '));
      if (s.exercises) {
        s.exercises.forEach((ex) => {
          doc.fontSize(10).text(`- ${ex.name} — ${ex.sets} x ${ex.reps}`);
        });
      }
      doc.moveDown();
    });
    doc.end();
  } catch (e) { console.error(e); res.status(500).json({ error: e.message }); }
}