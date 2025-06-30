'use server'
import { promises as fs } from 'fs';
import path from 'path';
import FileSelector from '@/components/FileSelector';
import { addEmbeddings, searchEmbeddings } from '@/lib/langchain';
import { AddDocs } from '@/components/add-docs';

export default async function Dashboard() {

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <AddDocs />
    </div>
  );
}
