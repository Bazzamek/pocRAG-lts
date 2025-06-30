Zadanie Rekrutacyjne: AI dla Firmy Doradczej - POC
Rozwiązanie zadania rekrutacyjnego polegającego na stworzeniu wewnętrznego narzędzia AI dla firmy doradczej (prawo/podatki) do przeszukiwania rozproszonej wiedzy i generowania odpowiedzi na podstawie historycznych dokumentów.

🚀 Demo aplikacji: https://poc-rag-lts.vercel.app/

Opis problemu
Firma doradcza ma problem z rozproszoną wiedzą - tysiące porad, analiz i maili są trudne do przeszukania. Doradcy marnują czas na ręczne wyszukiwanie informacji w archiwach. Potrzebne jest narzędzie, gdzie doradca wpisuje pytanie (np. "Jakie są ryzyka podatkowe przy transakcji X?"), a system przeszukuje bazę i generuje odpowiedź wskazując źródła.

Rozwiązanie
🔍 Wyszukiwanie Semantyczne
Podobieństwo cosinusowe dla wektorów 1536-wymiarowych

Inteligentne dzielenie dokumentów na fragmenty (1024 znaki z 256-znakowym nakładaniem)

Progi relewantności: 65% (wysoka pewność) i 40% (średnia pewność)

💬 Interfejs Chatbota
Konwersacyjne zapytania z cytowaniem źródeł

Walidacja kontekstu i ocena trafności odpowiedzi

Obsługa złożonych pytań odwołujących się do wielu dokumentów

📊 Dashboard Zarządzania
Statystyki użytkowania w czasie rzeczywistym

Interfejs zarządzania dokumentami

Monitorowanie wydajności systemu

📁 Obsługa Różnych Formatów
Przetwarzanie plików PDF, DOCX, TXT

Rozszerzalna architektura dla maili i innych źródeł

Automatyczne indeksowanie i wektoryzacja dokumentów

Stos Technologiczny
Frontend: Next.js 15, React, shadcn/ui

Backend: LangChain.js, OpenAI API

Baza danych: Supabase (PostgreSQL + Vector Storage)

Deployment: Vercel

Stylowanie: Tailwind CSS

Architektura RAG
Ingestion dokumentów: Przetwarzanie różnych formatów plików

Baza wektorowa: Przechowywanie embeddingów w Supabase

Wyszukiwanie semantyczne: Podobieństwo cosinusowe dla znajdowania relevantnych fragmentów

Generowanie AI: Wykorzystanie modeli OpenAI do tworzenia kontekstowych odpowiedzi

Interfejs webowy: Dashboard i chat dla użytkowników

Wyniki Testów
Testowane na syntetycznym zbiorze danych z imponującymi rezultatami:

Pytania oczywiste: 100% trafności

Pytania nieoczywiste: 100% trafności

Pytania podchwytliwe: 92% trafności

Złożone zapytania wielodokumentowe: 94% trafności

Instalacja i Uruchomienie
Wymagania
Node.js 18+

Konto Supabase

Klucz API OpenAI

Instalacja
bash
git clone <repository-url>
cd rag-poc
npm install
Konfiguracja środowiska
Utwórz plik .env.local:

text
NEXT_PUBLIC_SUPABASE_URL=twoj_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj_supabase_anon_key
NEXT_PUBLIC_OPENAI_API_KEY=twoj_openai_api_key
Konfiguracja bazy danych
Utwórz nowy projekt w Supabase

Włącz rozszerzenie vector

Uruchom dostarczone migracje SQL

Skonfiguruj polityki bezpieczeństwa na poziomie wierszy

Rozwój
bash
npm run dev
Odwiedź http://localhost:3000 aby zobaczyć aplikację.

Użytkowanie
Dodawanie Dokumentów
Przejdź do dashboardu

Użyj interfejsu przesyłania plików

Obsługiwane formaty: PDF, DOCX, TXT

Dokumenty są automatycznie przetwarzane i wektoryzowane

Przeszukiwanie Bazy Wiedzy
Użyj interfejsu chatu

Zadawaj pytania w języku naturalnym

Otrzymuj odpowiedzi AI z cytowaniem źródeł

Przeglądaj oceny trafności i walidację kontekstu

Monitorowanie Wydajności
Dostęp do statystyk w czasie rzeczywistym

Śledzenie zapytań i jakości odpowiedzi

Monitorowanie statusu przetwarzania dokumentów

Konfiguracja Systemu
Strategia Fragmentacji
Rozmiar fragmentu: 1024 znaki

Nakładanie: 256 znaków

Model embeddingów: text-embedding-3-small (1536 wymiarów)

Progi Relewantności
Wysoka pewność: 65% podobieństwa

Średnia pewność: 40% podobieństwa

Niska pewność: Poniżej 40% (system wskazuje niepewność)

Odpowiedź na Wymagania Zadania
✅ Analiza problemu i pytania do klienta
Przygotowano szczegółową listę pytań discovery

Otrzymano odpowiedzi definiujące wymagania biznesowe

✅ Koncepcja i architektura
Przedstawiono kompletny user flow

Stworzono schemat architektury z przepływem danych

Zaznaczono kluczowe komponenty (baza wektorowa, LLM)

✅ Proof of Concept - Działający kod
Przygotowano syntetyczne dane testowe

Zrealizowano wszystkie kluczowe elementy:

✅ Zasilanie chatbota wiedzą

✅ Zadawanie pytań przez interfejs

✅ Wyszukiwanie semantyczne

✅ Generowanie odpowiedzi przez LLM

✅ Cytowanie źródeł w odpowiedziach

Wartość Biznesowa
Rozwiązanie adresuje kluczowe potrzeby firmy doradczej:

Oszczędność czasu - Automatyczne wyszukiwanie zamiast ręcznego

Powtarzalna jakość - Konsystentne odpowiedzi oparte na sprawdzonej wiedzy

Skalowanie - Łatwe wprowadzanie nowych pracowników

Analityka - Dashboard do monitorowania wykorzystania

Stworzone z ❤️ jako rozwiązanie zadania rekrutacyjnego dla firm doradczych.