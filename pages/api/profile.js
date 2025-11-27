import { getSession } from 'next-auth/react';
let userProfiles = {};
export default async function handler(req, res) {
  const session = await getSession({ req });
  const userKey = session ? session.user.email : "guest_profile";
  if (req.method === "GET") {
    res.json(userProfiles[userKey] || null);
  } else if (req.method === "POST") {
    const {name, age, gender, weight} = req.body;
    userProfiles[userKey] = { name, age, gender, weight, email: session?.user?.email || null };
    res.json(userProfiles[userKey]);
  } else {
    res.status(405).end();
  }
}
