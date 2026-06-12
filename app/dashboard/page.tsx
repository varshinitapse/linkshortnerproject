import { redirect } from 'next/navigation';
import { currentUser } from '@clerk/nextjs/server';

export default async function DashboardPage() {
  const user = await currentUser();
  if (!user) redirect('/');

  return <h1>dashboardh1</h1>;
}
