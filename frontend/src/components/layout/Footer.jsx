import { format } from 'date-fns';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>Summer Internship Frontend</p>
        <p>{format(new Date(), 'yyyy')} Production-ready React starter</p>
      </div>
    </footer>
  );
}
