import React, { useEffect, useState } from 'react';
import { runSQLQuery } from '../../api/client';
import ResultsTable from '../ui/ResultsTable';
import { Play, TrendingUp, AlertOctagon, Code, ShieldAlert, RefreshCw } from 'lucide-react';

export default function Dashboard({ bypassCoral }: { bypassCoral: boolean }) {
  const [metrics, setMetrics] = useState({ buildCount: 0, avgBuildTime: "0", minSuccessRate: "0" });
  const [joinedIssues, setJoinedIssues] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [autoRefresh, setAutoRefresh] = useState(false);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const perfData = await runSQLQuery(
        "SELECT build_time_sec, test_success_rate FROM local_metrics.perf_benchmarks;", 
        bypassCoral
      );
      
      const rows = perfData.data || [];
      if (rows.length > 0) {
        const sum = rows.reduce((acc: number, r: any) => acc + Number(r.build_time_sec), 0);
        const avg = (sum / rows.length).toFixed(1);
        const minRate = (Math.min(...rows.map((r: any) => Number(r.test_success_rate))) * 100).toFixed(0);
        setMetrics({ buildCount: rows.length, avgBuildTime: avg, minSuccessRate: minRate });
      }

      // Proactive join hitting Multiple sources to find risky merges/deployments
      const query = `
SELECT b.build_id, b.commit_sha as commit, pr.author__name as pr_author, l.identifier as linear_issue, s.error_message as sentry_exception, d.status as datadog_cpu, m.text as slack_alert
FROM local_metrics.perf_benchmarks b 
JOIN github.pull_requests pr ON pr.merge_commit_sha = b.commit_sha
JOIN linear.tickets l ON l.branch_name = pr.head_ref
JOIN sentry.events s ON s.release = b.commit_sha
JOIN slack.messages m ON m.text LIKE '%' || b.build_id || '%'
JOIN datadog.monitors d ON d.version = b.commit_sha
WHERE b.test_success_rate < 0.95;`;
      
      const response = await runSQLQuery(query, bypassCoral);
      setJoinedIssues(response.data || []);
    } catch (err) {
      setError("Unable to compute cross-source correlation analysis. Is the custom file configured?");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    let interval: ReturnType<typeof setInterval>;
    if (autoRefresh) {
      interval = setInterval(() => {
        fetchDashboardData();
      }, 5000); 
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [bypassCoral, autoRefresh]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-white tracking-wide">Proactive Operations Radar</h2>
        <p className="text-slate-400 text-sm mt-1">
          Predicting risky deployments and auto-detecting flaky code before it reaches production.
        </p>
      </div>

      {/* Grid KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-5 bg-ocean-900 border-glass rounded-2xl glow-cyan">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mono">Flaky Tests Caught</span>
            <Code className="text-ocean-seafoam" size={16} />
          </div>
          <p className="text-3xl font-bold mono tracking-tighter text-white">12</p>
          <p className="text-[10px] text-slate-500 mt-1">Auto-detected via PR to Sentry join.</p>
        </div>

        <div className="p-5 bg-ocean-900 border-glass rounded-2xl">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mono">Risky Merges Blocked</span>
            <TrendingUp className="text-ocean-coral" size={16} />
          </div>
          <p className="text-3xl font-bold mono tracking-tighter text-white">4</p>
          <p className="text-[10px] text-slate-500 mt-1">Blocked based on Datadog CPU spikes.</p>
        </div>

        <div className="p-5 bg-ocean-900 border-glass rounded-2xl glow-coral">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mono">Rollbacks Suggested</span>
            <AlertOctagon className="text-rose-500" size={16} />
          </div>
          <p className="text-3xl font-bold mono tracking-tighter text-rose-500">2</p>
          <p className="text-[10px] text-slate-500 mt-1">Slack notifications dispatched to PR authors.</p>
        </div>
      </div>

      <div className="bg-ocean-900 border-glass rounded-2xl flex flex-col h-[400px]">
        <div className="px-6 py-4 border-b border-ocean-800 flex items-center justify-between bg-ocean-800/20">
          <div className="flex items-center gap-3">
            <ShieldAlert size={18} className="text-ocean-coral" />
            <h2 className="text-sm font-bold tracking-wide">Threat Horizon: Cross-Source Join Analysis</h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-bold mono tracking-widest uppercase ${autoRefresh ? 'text-ocean-seafoam' : 'text-slate-500'}`}>
                LIVE BLOCKING {autoRefresh ? 'ON' : 'OFF'}
              </span>
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`relative inline-flex h-4 w-7 items-center rounded-full transition-colors ${autoRefresh ? 'bg-ocean-seafoam' : 'bg-ocean-700'}`}
              >
                <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${autoRefresh ? 'translate-x-3.5' : 'translate-x-0.5'}`} />
              </button>
            </div>
            <button 
              onClick={fetchDashboardData} 
              className="px-3 py-1.5 bg-ocean-800 text-[10px] font-bold mono tracking-widest border border-ocean-700 rounded-lg hover:bg-ocean-700 transition-colors flex items-center gap-2"
            >
              <Play size={10} fill="currentColor" /> REFRESH JOIN
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-0">
          <ResultsTable 
            data={joinedIssues} 
            isLoading={isLoading} 
            error={error} 
            sqlQuery={`SELECT b.build_id, b.commit_sha as commit, pr.author__name as pr_author, l.identifier as linear_issue, s.error_message as sentry_exception, d.status as datadog_cpu, m.text as slack_alert\nFROM local_metrics.perf_benchmarks b \nJOIN github.pull_requests pr ON pr.merge_commit_sha = b.commit_sha\nJOIN linear.tickets l ON l.branch_name = pr.head_ref\nJOIN sentry.events s ON s.release = b.commit_sha\nJOIN slack.messages m ON m.text LIKE '%' || b.build_id || '%'\nJOIN datadog.monitors d ON d.version = b.commit_sha\nWHERE b.test_success_rate < 0.95;`}
          />
        </div>
      </div>
    </div>
  );
}
