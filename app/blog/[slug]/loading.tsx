export default function LoadingArticle() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-pulse">
      <div className="h-4 w-28 bg-slate-200 dark:bg-slate-800 rounded"></div>
      <div className="h-10 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
      <div className="h-4 w-1/2 bg-slate-200 dark:bg-slate-800 rounded"></div>
      <div className="h-80 w-full bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      <div className="space-y-3">
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-full bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-2/3 bg-slate-200 dark:bg-slate-800 rounded"></div>
      </div>
    </div>
  );
}