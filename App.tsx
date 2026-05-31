import React from 'react';

interface ResultsTableProps {
  data: any[];
  isLoading: boolean;
  error: string | null;
  sqlQuery?: string;
}

export default function ResultsTable({ data, isLoading, error, sqlQuery }: ResultsTableProps) {
  if (isLoading && (!data || data.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-ocean-900/40 border border-ocean-800 rounded-2xl h-64">
        <div className="h-8 w-8 border-4 border-t-ocean-coral border-ocean-800 rounded-full animate-spin"></div>
        <p className="mt-4 text-sm text-slate-400 font-mono tracking-wider">Navigating database streams...</p>
      </div>
    );
  }

  if (error && (!data || data.length === 0)) {
    return (
      <div className="p-6 bg-red-950/20 border border-red-800/40 rounded-2xl text-red-400">
        <h4 className="font-bold text-sm tracking-wide">Voyage Log Interrupted (Error)</h4>
        <p className="text-xs font-mono mt-2 bg-red-950/40 p-4 rounded-xl border border-red-900/40 overflow-x-auto">
          {error}
        </p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-ocean-900/40 border border-ocean-800 rounded-2xl h-64 text-slate-500">
        <p className="text-sm font-mono">The radar search returned blank results.</p>
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="flex flex-col h-full">
      {sqlQuery && (
        <div className="p-3 bg-ocean-950 border-b border-ocean-800 m-4 rounded-xl">
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mb-1">Executed SQL Signature</p>
          <code className="text-[10px] text-ocean-seafoam mono block overflow-x-auto">{sqlQuery}</code>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="mono w-full text-left border-collapse">
          <thead>
            <tr className="text-[10px] text-slate-400 text-left border-b border-ocean-800 uppercase tracking-widest">
              {columns.map((col) => (
                <th key={col} className="px-6 py-4 font-semibold whitespace-nowrap">
                  {col.replace(/__/g, ' ➔ ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs divide-y divide-ocean-800/50">
            {data.map((row, idx) => (
              <tr key={idx} className="hover:bg-ocean-800/30 transition-all">
                {columns.map((col, colIdx) => {
                  const val = row[col];
                  let displayVal = typeof val === 'object' && val !== null ? JSON.stringify(val) : String(val);
                  
                  // Specific styling for demonstration based on the template
                  if (colIdx === 0 && col !== 'status') {
                    return <td key={col} className="px-6 py-4 text-ocean-seafoam">{displayVal}</td>
                  }
                  if (colIdx === 1 && col !== 'status') {
                    return <td key={col} className="px-6 py-4 text-slate-400">{displayVal}</td>
                  }
                  if (col === 'author__name') {
                     return <td key={col} className="px-6 py-4 italic">{displayVal}</td>
                  }

                  let statusClasses = "px-2 py-0.5 rounded border";
                  let statusContent = displayVal;
                  if (val === 'FAILED' || val === 'failed' || val === 'error') {
                      statusClasses += " bg-rose-950 text-rose-400 border-rose-900/50";
                      statusContent = val.toUpperCase();
                      return <td key={col} className="px-6 py-4"><span className={statusClasses}>{statusContent}</span></td>
                  } else if (val === 'SUCCESS' || val === 'success' || val === 'merged') {
                      statusClasses += " bg-emerald-950 text-emerald-400 border-emerald-900/50";
                      statusContent = val.toUpperCase();
                      return <td key={col} className="px-6 py-4"><span className={statusClasses}>{statusContent}</span></td>
                  }

                  return (
                    <td key={col} className="px-6 py-4 text-slate-200">
                      {displayVal}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
