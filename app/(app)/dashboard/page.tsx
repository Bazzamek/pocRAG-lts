'use server'
import { AddDocs } from '@/components/add-docs';
import Charts from '@/components/dashboard/Charts';

export default async function Dashboard() {

  return (
    <div className="p-6">
      <div className='w-full p-4 bg-gray-200 flex flex-row gap-4'>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <AddDocs />
      </div>
      <Charts />
    </div>
  );
}
