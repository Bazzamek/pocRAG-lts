RAG POC 
🚀 Demo: https://poc-rag-lts.vercel.app/

Wymagania
Node.js 18+

Konto Supabase

Klucz API OpenAI

Instalacja
bash
git clone <repository-url>
cd rag-poc
npm install
Konfiguracja
Utwórz .env.local:

text
NEXT_PUBLIC_SUPABASE_URL=twoj_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=twoj_service_role_key
NEXT_PUBLIC_OPENAI_API_KEY= twoj_openai_api_key --- !!! na produkcji uzycj OPENAI_API_KEY - unikaj NEXT_PUBLIC
Baza danych
Utwórz projekt w Supabase

Włącz rozszerzenie vector

Uruchom migracje SQL

Skonfiguruj RLS policies

Uruchomienie
bash
npm run dev
Aplikacja dostępna na http://localhost:3000

Deployment
bash
npm run build
vercel deploy
Stos techniczny
Frontend: Next.js 15, React 19, shadcn/ui, Tailwind v4

Backend: LangChain.js, OpenAI API

Baza: Supabase (PostgreSQL + Vector + postgres function)

Deployment: Vercel
