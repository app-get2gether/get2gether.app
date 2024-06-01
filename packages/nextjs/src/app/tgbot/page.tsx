import EventsList from "./events/_components/EventsList";

export default function HomePage() {
  return (
    <main className="flex h-full flex-col items-center justify-center">
      <EventsList />
    </main>
  );
}
