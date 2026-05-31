import { useState, useEffect, useRef, useCallback } from "react";
import {
  LayoutDashboard, Terminal, Bot, Ship, Compass,
  ToggleLeft, ToggleRight, Play, TrendingUp,
  AlertOctagon, ShieldAlert, Database, Zap,
  Copy, Check, Clock, RefreshCw, Code,
  ChevronRight, Sparkles, Activity
} from "lucide-react";

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const C = {
  bg950:"#060a13", bg900:"#0a0f1d", bg800:"#11192e", bg700:"#1b2644", bg600:"#2c3b63",
  coral:"#ff5a5f", coralBg:"rgba(255,90,95,.13)", coralBorder:"rgba(255,90,95,.28)",
  teal:"#14b8a6",  tealBg:"rgba(20,184,166,.13)",  tealBorder:"rgba(20,184,166,.28)",
  amber:"#f59e0b", amberBg:"rgba(245,158,11,.13)",
  rose:"#f43f5e",  roseBg:"rgba(244,63,94,.13)",
  violet:"#818cf8",
  text:"#f1f5f9", dim:"#94a3b8", muted:"#475569", border:"#1b2644",
};

// ─── CSS INJECTION ───────────────────────────────────────────────────────────
function useStyles() {
  useEffect(() => {
    if (document.getElementById("dr-styles")) return;
    const el = document.createElement("style");
    el.id = "dr-styles";
    el.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=JetBrains+Mono:ital,wght@0,300;0,400;0,500;0,700;1,300&family=Inter:wght@300;400;500;600;700&display=swap');
      #dr *{box-sizing:border-box;margin:0;padding:0;}
      #dr{font-family:'Inter',system-ui,sans-serif;-webkit-font-smoothing:antialiased;}
      #dr ::-webkit-scrollbar{width:5px;height:5px;}
      #dr ::-webkit-scrollbar-track{background:#060a13;}
      #dr ::-webkit-scrollbar-thumb{background:#1b2644;border-radius:3px;}
      #dr ::-webkit-scrollbar-thumb:hover{background:#ff5a5f;}

      @keyframes dr-sweep{from{transform:rotate(0)}to{transform:rotate(360deg)}}
      @keyframes dr-up{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
      @keyframes dr-glow-r{0%,100%{box-shadow:0 0 10px rgba(255,90,95,.18)}50%{box-shadow:0 0 26px rgba(255,90,95,.42)}}
      @keyframes dr-glow-t{0%,100%{box-shadow:0 0 10px rgba(20,184,166,.18)}50%{box-shadow:0 0 26px rgba(20,184,166,.42)}}
      @keyframes dr-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
      @keyframes dr-blink{0%,100%{opacity:1}50%{opacity:.15}}
      @keyframes dr-shimmer{0%{background-position:-200% center}100%{background-position:200% center}}
      @keyframes dr-count{from{opacity:0;transform:scale(.82)}to{opacity:1;transform:scale(1)}}
      @keyframes dr-dot-bounce{0%,80%,100%{transform:scale(0)}40%{transform:scale(1)}}
      @keyframes dr-slide{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}

      .dr-u0{animation:dr-up .45s cubic-bezier(.22,1,.36,1) both}
      .dr-u1{animation:dr-up .45s .07s cubic-bezier(.22,1,.36,1) both}
      .dr-u2{animation:dr-up .45s .14s cubic-bezier(.22,1,.36,1) both}
      .dr-u3{animation:dr-up .45s .21s cubic-bezier(.22,1,.36,1) both}
      .dr-u4{animation:dr-up .45s .28s cubic-bezier(.22,1,.36,1) both}
      .dr-u5{animation:dr-up .45s .35s cubic-bezier(.22,1,.36,1) both}

      .dr-shimmer{background:linear-gradient(90deg,#14b8a6 0%,#ff5a5f 40%,#f59e0b 65%,#14b8a6 100%);background-size:200% auto;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;animation:dr-shimmer 4s linear infinite;}
      .dr-glow-r{animation:dr-glow-r 3s ease-in-out infinite;}
      .dr-glow-t{animation:dr-glow-t 3s ease-in-out infinite;}
      .dr-orbitron{font-family:'Orbitron',sans-serif;}
      .dr-mono{font-family:'JetBrains Mono',monospace;}
      .dr-spin{animation:dr-spin .75s linear infinite;}
      .dr-count{animation:dr-count .65s cubic-bezier(.22,1,.36,1) both;}

      .dr-nav{transition:all .14s ease;cursor:pointer;background:transparent;border:none;width:100%;text-align:left;}
      .dr-nav:hover{background:rgba(27,38,68,.55)!important;}
      .dr-btn{transition:all .14s ease;cursor:pointer;}
      .dr-btn:hover{opacity:.88;transform:translateY(-1px);}
      .dr-btn:active{transform:translateY(0);}
      .dr-preset:hover{border-color:rgba(255,90,95,.4)!important;color:#f1f5f9!important;background:rgba(27,38,68,.6)!important;}
      .dr-row:hover{background:rgba(27,38,68,.45)!important;}
      .dr-card{transition:border-color .18s ease;}
      .dr-card:hover{border-color:rgba(255,90,95,.22)!important;}
      textarea.dr-editor{background:transparent;color:#14b8a6;font-family:'JetBrains Mono',monospace;font-size:13px;line-height:1.85;border:none;outline:none;resize:vertical;caret-color:#ff5a5f;width:100%;}
      input.dr-input:focus{outline:none;border-color:#ff5a5f!important;box-shadow:0 0 0 2px rgba(255,90,95,.16)!important;}
    `;
    document.head.appendChild(el);
    return () => { try { document.head.removeChild(el); } catch(_){} };
  }, []);
}

// ─── MOCK DATA ENGINE ────────────────────────────────────────────────────────
const BENCH = [
  {build_id:"B-101",commit_sha:"a1f2c3d",build_time_sec:42.5,test_success_rate:.98,bundle_size_mb:1.24,timestamp:"2026-05-30T10:00:00Z"},
  {build_id:"B-102",commit_sha:"e4f5g6h",build_time_sec:118.2,test_success_rate:.72,bundle_size_mb:2.51,timestamp:"2026-05-30T11:15:00Z"},
  {build_id:"B-103",commit_sha:"i7j8k9l",build_time_sec:38.1,test_success_rate:1.00,bundle_size_mb:1.21,timestamp:"2026-05-30T14:30:00Z"},
  {build_id:"B-104",commit_sha:"m0n1o2p",build_time_sec:55.4,test_success_rate:.95,bundle_size_mb:1.35,timestamp:"2026-05-31T09:00:00Z"},
];
const GITHUB_PRS = [
  {number:12,title:"Optimised SQL execution plan cache",author__name:"Will Turner",merge_commit_sha:"a1f2c3d",state:"merged"},
  {number:13,title:"Fix connection pool memory leak",author__name:"Capt. Jack Sparrow",merge_commit_sha:"e4f5g6h",state:"merged"},
  {number:14,title:"Add cross-source JOIN index optimiser",author__name:"Elizabeth Swann",merge_commit_sha:"i7j8k9l",state:"merged"},
  {number:15,title:"Refactor core rendering tree",author__name:"Captain Hook",merge_commit_sha:"m0n1o2p",state:"open"},
];
const SENTRY_DATA = [
  {id:"S-001",title:"Uncaught TypeError: Cannot read 'context'",culprit:"render.js:L42",level:"error",count:47},
  {id:"S-002",title:"Network timeout in real-time stream",culprit:"stream.ts:L118",level:"warning",count:12},
];
const CORAL_TABLES = [
  {schema_name:"github",table_name:"pull_requests"},{schema_name:"github",table_name:"issues"},
  {schema_name:"sentry",table_name:"issues"},{schema_name:"slack",table_name:"messages"},
  {schema_name:"local_metrics",table_name:"perf_benchmarks"},
];
const CORAL_COLS = [
  {table_name:"pull_requests",column_name:"number",data_type:"Int64"},
  {table_name:"pull_requests",column_name:"title",data_type:"Utf8"},
  {table_name:"pull_requests",column_name:"author__name",data_type:"Utf8"},
  {table_name:"pull_requests",column_name:"merge_commit_sha",data_type:"Utf8"},
  {table_name:"perf_benchmarks",column_name:"build_id",data_type:"Utf8"},
  {table_name:"perf_benchmarks",column_name:"commit_sha",data_type:"Utf8"},
  {table_name:"perf_benchmarks",column_name:"build_time_sec",data_type:"Float64"},
  {table_name:"perf_benchmarks",column_name:"test_success_rate",data_type:"Float64"},
  {table_name:"perf_benchmarks",column_name:"bundle_size_mb",data_type:"Float64"},
];

function simulateQuery(sql) {
  return new Promise(resolve => setTimeout(() => {
    const n = sql.toLowerCase().replace(/\s+/g," ").trim();
    let data;
    if (n.includes("coral.tables")) data = CORAL_TABLES;
    else if (n.includes("coral.columns")) data = CORAL_COLS;
    else if (n.includes("sentry")) data = SENTRY_DATA;
    else if (n.includes("join") && (n.includes("local_metrics") || n.includes("perf_benchmarks"))) {
      data = BENCH
        .filter(b => n.includes("< 0.95") ? b.test_success_rate < .95 : n.includes("< 0.80") ? b.test_success_rate < .80 : true)
        .map(b => {
          const pr = GITHUB_PRS.find(p => p.merge_commit_sha === b.commit_sha) || {};
          return { build_id:b.build_id, commit_sha:b.commit_sha, build_time_sec:b.build_time_sec,
            test_success_rate:b.test_success_rate, pr_title:pr.title||"N/A", pr_author:pr.author__name||"Unknown" };
        });
    } else if (n.includes("local_metrics") || n.includes("perf_benchmarks")) {
      data = [...BENCH];
      if (n.includes("> 60")) data = data.filter(r => r.build_time_sec > 60);
      if (n.includes("desc")) data.sort((a,b) => b.build_time_sec - a.build_time_sec);
      if (/limit (\d+)/.test(n)) data = data.slice(0, parseInt(n.match(/limit (\d+)/)[1]));
    } else if (n.includes("github") || n.includes("pull_requests")) {
      data = GITHUB_PRS;
      if (n.includes("state = 'open'")) data = data.filter(r => r.state === "open");
    } else {
      data = BENCH.slice(0,3);
    }
    resolve({ source:"mock_fallback", data: data || [] });
  }, 550 + Math.random() * 350));
}

// ─── CLAUDE AI INTEGRATION ───────────────────────────────────────────────────
const SYS = `You are DevRadar's AI SQL Copilot, an expert in Coral — a cross-source SQL engine that JOINs GitHub, Sentry, Slack, and local files in one query.

Schemas:
- github.pull_requests (number INT, title TEXT, author__name TEXT, merge_commit_sha TEXT, state TEXT)
- github.issues (id INT, title TEXT, state TEXT, assignee__name TEXT)
- sentry.issues (id TEXT, title TEXT, culprit TEXT, level TEXT, count INT)
- slack.messages (ts TEXT, text TEXT, user__name TEXT, channel__name TEXT)
- local_metrics.perf_benchmarks (build_id TEXT, commit_sha TEXT, build_time_sec FLOAT, test_success_rate FLOAT, bundle_size_mb FLOAT, timestamp TEXT)
- coral.tables (schema_name TEXT, table_name TEXT)
- coral.columns (table_name TEXT, column_name TEXT, data_type TEXT)

Rules: always use schema.table format; use cross-source JOINs when needed; write readable SQL.
Respond ONLY with JSON (no markdown): {"sql":"SELECT...","explanation":"One concise sentence","sources":["source1"]}`;

async function callClaude(prompt) {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body: JSON.stringify({
      model:"claude-sonnet-4-20250514", max_tokens:800,
      system: SYS,
      messages:[{role:"user",content:prompt}]
    })
  });
  const d = await res.json();
  const txt = d.content?.find(b => b.type==="text")?.text || "{}";
  try { return JSON.parse(txt.replace(/```json\n?|```\n?/g,"").trim()); }
  catch { const m = txt.match(/\{[\s\S]*\}/); return m ? JSON.parse(m[0]) : null; }
}

function fallbackSQL(q) {
  const l = q.toLowerCase();
  if (l.includes("slow") || l.includes("build") || l.includes("time"))
    return { sql:`SELECT b.build_id, b.commit_sha, b.build_time_sec,\n       b.test_success_rate,\n       pr.title AS pr_title,\n       pr.author__name AS pr_author\nFROM local_metrics.perf_benchmarks b\nJOIN github.pull_requests pr\n  ON pr.merge_commit_sha = b.commit_sha\nORDER BY b.build_time_sec DESC;`, explanation:"Joins local CI benchmarks with GitHub PRs, sorted by build duration to surface the slowest runs.", sources:["local_metrics","github"] };
  if (l.includes("fail") || l.includes("error") || l.includes("sentry"))
    return { sql:`SELECT b.build_id, b.commit_sha, b.test_success_rate,\n       b.build_time_sec\nFROM local_metrics.perf_benchmarks b\nWHERE b.test_success_rate < 0.80\nORDER BY b.test_success_rate ASC;`, explanation:"Surfaces the builds with the lowest CI pass rates, flagging potential regressions.", sources:["local_metrics"] };
  if (l.includes("open") || l.includes("pr") || l.includes("pull"))
    return { sql:`SELECT number, title, author__name, state\nFROM github.pull_requests\nWHERE state = 'open'\nORDER BY number DESC\nLIMIT 10;`, explanation:"Retrieves open pull requests directly from the GitHub source connector.", sources:["github"] };
  if (l.includes("table") || l.includes("schema"))
    return { sql:`SELECT schema_name, table_name\nFROM coral.tables\nORDER BY schema_name, table_name;`, explanation:"Queries Coral's native metadata to discover all available schemas and tables.", sources:["coral"] };
  return { sql:`SELECT build_id, commit_sha, build_time_sec,\n       test_success_rate, bundle_size_mb\nFROM local_metrics.perf_benchmarks\nORDER BY timestamp DESC\nLIMIT 10;`, explanation:"Fetches the latest CI build metrics from the custom local source connector.", sources:["local_metrics"] };
}

// ─── ATOM COMPONENTS ────────────────────────────────────────────────────────
function Spinner({size=20}) {
  return <div className="dr-spin" style={{width:size,height:size,border:`2px solid ${C.border}`,borderTopColor:C.coral,borderRadius:"50%",flexShrink:0}} />;
}

function PingDot({color=C.teal,size=8}) {
  return (
    <span style={{position:"relative",display:"inline-flex",width:size,height:size,flexShrink:0}}>
      <span className="dr-blink" style={{position:"absolute",inset:0,borderRadius:"50%",background:color}} />
      <span style={{position:"absolute",inset:1,borderRadius:"50%",background:color}} />
    </span>
  );
}

function SourceBadge({src}) {
  const map = {
    github:{c:"#94a3b8",bg:"rgba(148,163,184,.13)"},
    sentry:{c:C.amber,bg:C.amberBg},
    slack:{c:C.violet,bg:"rgba(129,140,248,.13)"},
    local_metrics:{c:C.teal,bg:C.tealBg},
    coral:{c:C.coral,bg:C.coralBg},
  };
  const s = map[src] || {c:C.dim,bg:"rgba(148,163,184,.1)"};
  return (
    <span className="dr-mono" style={{display:"inline-flex",alignItems:"center",gap:4,padding:"2px 8px",borderRadius:20,background:s.bg,color:s.c,fontSize:10,fontWeight:600,letterSpacing:".05em"}}>
      <span style={{width:4,height:4,borderRadius:"50%",background:s.c,display:"inline-block"}} />{src}
    </span>
  );
}

// ─── RESULTS TABLE ───────────────────────────────────────────────────────────
function ResultsTable({data,loading,error,sqlQuery}) {
  if (loading) return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:140,gap:10}}>
      <Spinner size={22} />
      <span className="dr-mono" style={{fontSize:11,color:C.muted,letterSpacing:".08em"}}>EXECUTING QUERY...</span>
    </div>
  );
  if (error) return (
    <div style={{padding:14,background:"rgba(244,63,94,.08)",border:"1px solid rgba(244,63,94,.22)",borderRadius:10,color:"#f87171"}}>
      <div style={{fontWeight:600,fontSize:12,marginBottom:5}}>Query Error</div>
      <code className="dr-mono" style={{fontSize:11,display:"block",color:"#fca5a5"}}>{error}</code>
    </div>
  );
  if (!data?.length) return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:100,color:C.muted}}>
      <span className="dr-mono" style={{fontSize:12}}>No results. Run a query above.</span>
    </div>
  );
  const cols = Object.keys(data[0]);
  const fmt = (col,val) => {
    if (val === null || val === undefined) return <span style={{color:C.muted}}>null</span>;
    const v = String(val);
    if (col.includes("rate") || col.includes("success")) {
      const pct = (parseFloat(v)*100).toFixed(0);
      const c = parseFloat(v)>=.95 ? C.teal : parseFloat(v)>=.8 ? C.amber : C.coral;
      return <span style={{color:c,fontWeight:600}}>{pct}%</span>;
    }
    if (col.includes("build_time")) return <span style={{color:parseFloat(v)>60?C.coral:C.teal}}>{v}s</span>;
    if (col==="state") {
      const mc = {merged:C.teal,open:C.amber,closed:C.rose};
      const bc = {merged:C.tealBg,open:C.amberBg,closed:C.roseBg};
      return <span style={{padding:"2px 8px",borderRadius:20,fontSize:10,fontWeight:600,background:bc[v]||C.coralBg,color:mc[v]||C.coral}}>{v}</span>;
    }
    if (col==="level") return <span style={{color:v==="error"?C.coral:C.amber,fontWeight:600}}>{v}</span>;
    return <span style={{color:C.dim}}>{v.length>48?v.slice(0,48)+"…":v}</span>;
  };
  return (
    <div>
      {sqlQuery && (
        <div style={{padding:"9px 13px",background:C.bg950,border:`1px solid ${C.border}`,borderRadius:9,marginBottom:10}}>
          <div className="dr-mono" style={{fontSize:9,color:C.muted,fontWeight:700,letterSpacing:".1em",textTransform:"uppercase",marginBottom:4}}>Executed Query</div>
          <code className="dr-mono" style={{fontSize:11,color:C.teal,display:"block",whiteSpace:"pre-wrap"}}>{sqlQuery}</code>
        </div>
      )}
      <div style={{overflowX:"auto",borderRadius:10,border:`1px solid ${C.border}`}}>
        <table style={{width:"100%",borderCollapse:"collapse",background:C.bg900}}>
          <thead>
            <tr style={{background:"rgba(27,38,68,.5)",borderBottom:`1px solid ${C.border}`}}>
              {cols.map(c => <th key={c} className="dr-mono" style={{padding:"10px 15px",textAlign:"left",fontSize:10,fontWeight:700,color:C.dim,textTransform:"uppercase",letterSpacing:".08em",whiteSpace:"nowrap"}}>{c.replace(/__/g," → ")}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.map((row,i) => (
              <tr key={i} className="dr-row" style={{borderBottom:`1px solid ${C.border}22`}}>
                {cols.map(c => <td key={c} className="dr-mono" style={{padding:"10px 15px",fontSize:12,whiteSpace:"nowrap"}}>{fmt(c,row[c])}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="dr-mono" style={{marginTop:6,textAlign:"right",fontSize:10,color:C.muted}}>{data.length} row{data.length!==1?"s":""} returned</div>
    </div>
  );
}

// ─── RADAR VIZ ───────────────────────────────────────────────────────────────
function RadarViz() {
  const dots = [
    {x:50,y:10,color:"#94a3b8",label:"GH"},{x:90,y:45,color:C.amber,label:"ST"},
    {x:72,y:85,color:C.violet,label:"SL"},{x:16,y:50,color:C.teal,label:"LM"},
  ];
  return (
    <div style={{position:"relative",width:110,height:110,margin:"0 auto"}}>
      {[1,.66,.33].map((s,i) => (
        <div key={i} style={{position:"absolute",inset:`${(1-s)*50}%`,borderRadius:"50%",border:`1px solid rgba(20,184,166,${.06+i*.05})`}} />
      ))}
      <div style={{position:"absolute",top:"50%",left:0,right:0,height:1,background:"rgba(20,184,166,.07)",transform:"translateY(-50%)"}} />
      <div style={{position:"absolute",left:"50%",top:0,bottom:0,width:1,background:"rgba(20,184,166,.07)",transform:"translateX(-50%)"}} />
      <div style={{position:"absolute",inset:0,borderRadius:"50%",background:"conic-gradient(from 0deg,transparent 275deg,rgba(20,184,166,.38) 360deg)",animation:"dr-sweep 3s linear infinite"}} />
      <div style={{position:"absolute",top:"50%",left:"50%",width:7,height:7,borderRadius:"50%",background:C.coral,transform:"translate(-50%,-50%)",boxShadow:`0 0 8px ${C.coral}`}} />
      {dots.map((d,i) => (
        <div key={i} style={{position:"absolute",left:`${d.x}%`,top:`${d.y}%`,width:7,height:7,borderRadius:"50%",background:d.color,transform:"translate(-50%,-50%)",boxShadow:`0 0 5px ${d.color}`}} />
      ))}
    </div>
  );
}

// ─── KPI CARD ────────────────────────────────────────────────────────────────
function KPICard({icon:Icon,label,value,sub,color=C.teal,delay=0}) {
  return (
    <div className={`dr-card dr-u${delay}`} style={{background:C.bg900,border:`1px solid ${C.border}`,borderRadius:15,padding:"22px 20px",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",top:-24,right:-24,width:72,height:72,borderRadius:"50%",background:`radial-gradient(circle,${color}20 0%,transparent 70%)`,pointerEvents:"none"}} />
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <span className="dr-mono" style={{fontSize:9.5,fontWeight:700,color:C.dim,textTransform:"uppercase",letterSpacing:".1em"}}>{label}</span>
        <div style={{padding:7,borderRadius:9,background:`${color}18`,color}}><Icon size={15} /></div>
      </div>
      <div className="dr-orbitron dr-count" style={{fontSize:30,fontWeight:700,color:C.text,letterSpacing:"-.02em",lineHeight:1}}>{value}</div>
      {sub && <p style={{fontSize:11,color:C.muted,marginTop:7,lineHeight:1.45}}>{sub}</p>}
    </div>
  );
}

// ─── SOURCE MAP ──────────────────────────────────────────────────────────────
function SourceMap() {
  const nodes = [
    {label:"GitHub",color:"#94a3b8",icon:"⌥",x:"50%",y:"8%"},
    {label:"Sentry",color:C.amber,icon:"⚑",x:"90%",y:"45%"},
    {label:"Slack",color:C.violet,icon:"#",x:"68%",y:"87%"},
    {label:"Local Metrics",color:C.teal,icon:"⊡",x:"12%",y:"45%"},
  ];
  return (
    <div style={{position:"relative",width:"100%",height:150}}>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none"}} viewBox="0 0 100 100" preserveAspectRatio="none">
        {[["50%","8%"],["90%","45%"],["68%","87%"],["12%","45%"]].map(([x,y],i) => (
          <line key={i} x1="50" y1="50" x2={parseFloat(x)} y2={parseFloat(y)}
            stroke={nodes[i].color} strokeWidth=".6" strokeOpacity=".25" strokeDasharray="2 2" />
        ))}
      </svg>
      <div style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:3,zIndex:2}}>
        <div style={{width:44,height:44,borderRadius:"50%",background:C.coralBg,border:`1px solid ${C.coral}`,display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 0 16px rgba(255,90,95,.25)`}}>
          <Database size={18} color={C.coral} />
        </div>
        <span className="dr-orbitron" style={{fontSize:7.5,color:C.coral,fontWeight:700,letterSpacing:".05em"}}>CORAL</span>
      </div>
      {nodes.map((n,i) => (
        <div key={i} style={{position:"absolute",left:n.x,top:n.y,transform:"translate(-50%,-50%)",display:"flex",flexDirection:"column",alignItems:"center",gap:3,zIndex:2}}>
          <div style={{width:32,height:32,borderRadius:8,background:`${n.color}15`,border:`1px solid ${n.color}45`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>{n.icon}</div>
          <span className="dr-mono" style={{fontSize:8,color:n.color,fontWeight:500,whiteSpace:"nowrap"}}>{n.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── PAGE: DASHBOARD ─────────────────────────────────────────────────────────
function Dashboard() {
  const [joinData,setJoinData] = useState([]);
  const [loading,setLoading] = useState(true);
  const [error,setError] = useState(null);
  const [metrics,setMetrics] = useState({count:0,avg:"—",minRate:"—"});

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const p = await simulateQuery("SELECT build_time_sec, test_success_rate FROM local_metrics.perf_benchmarks;");
      const rows = p.data||[];
      if (rows.length) {
        const avg = (rows.reduce((a,r)=>a+r.build_time_sec,0)/rows.length).toFixed(1);
        const minRate = (Math.min(...rows.map(r=>r.test_success_rate))*100).toFixed(0);
        setMetrics({count:rows.length,avg:`${avg}s`,minRate:`${minRate}%`});
      }
      const j = await simulateQuery(
        `SELECT b.build_id, b.commit_sha, b.build_time_sec, b.test_success_rate,\n       pr.title AS pr_title, pr.author__name AS pr_author\nFROM local_metrics.perf_benchmarks b\nJOIN github.pull_requests pr ON pr.merge_commit_sha = b.commit_sha\nWHERE b.test_success_rate < 0.95;`
      );
      setJoinData(j.data||[]);
    } catch(e) { setError("Cross-source correlation failed."); }
    finally { setLoading(false); }
  },[]);

  useEffect(()=>{load();},[load]);

  return (
    <div style={{display:"flex",flexDirection:"column",gap:24}}>
      <div className="dr-u0">
        <h2 className="dr-orbitron" style={{fontSize:20,fontWeight:700,color:C.text,letterSpacing:".02em",marginBottom:5}}>Voyage Log Overview</h2>
        <p style={{fontSize:13,color:C.dim,lineHeight:1.5}}>Cross-referencing local CI benchmarks with live repository and error data via Coral SQL.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
        <KPICard delay={1} icon={Code} label="Build Profiles" value={loading?"…":metrics.count} sub="Records queryable via custom YAML source spec." color={C.teal} />
        <KPICard delay={2} icon={TrendingUp} label="Avg CI Speed" value={loading?"…":metrics.avg} sub="Aggregated from local JSONL array feeds." color={C.coral} />
        <KPICard delay={3} icon={AlertOctagon} label="Lowest CI Pass" value={loading?"…":metrics.minRate} sub="Minimum test threshold in benchmark window." color={C.rose} />
      </div>
      <div className="dr-u4" style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:14}}>
        <div className="dr-card" style={{background:C.bg900,border:`1px solid ${C.border}`,borderRadius:14,padding:18,display:"flex",flexDirection:"column",gap:14}}>
          <div className="dr-mono" style={{fontSize:9.5,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:".1em"}}>Source Network</div>
          <SourceMap />
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {[{label:"GitHub",color:"#94a3b8",status:"Connected"},{label:"Sentry",color:C.amber,status:"Connected"},{label:"local_metrics",color:C.teal,status:"Custom YAML"}].map((s,i)=>(
              <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 6px",background:"rgba(11,15,29,.4)",borderRadius:6}}>
                <span className="dr-mono" style={{fontSize:10,color:s.color,fontWeight:600}}>{s.label}</span>
                <span style={{fontSize:9,color:C.muted}}>{s.status}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="dr-card" style={{background:C.bg900,border:`1px solid ${C.border}`,borderRadius:14,padding:20}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div style={{display:"flex",alignItems:"center",gap:11}}>
              <div style={{padding:7,borderRadius:9,background:C.coralBg,color:C.coral}}><ShieldAlert size={17} /></div>
              <div>
                <div style={{fontWeight:600,color:C.text,fontSize:14}}>CI Failures Cross-Reference</div>
                <div style={{fontSize:11,color:C.dim,marginTop:2,display:"flex",alignItems:"center",gap:4}}>Joining <SourceBadge src="local_metrics" /> × <SourceBadge src="github" /> — test_success_rate &lt; 0.95</div>
              </div>
            </div>
            <button onClick={load} className="dr-btn" style={{display:"flex",alignItems:"center",gap:5,padding:"7px 13px",background:C.bg800,border:`1px solid ${C.border}`,borderRadius:9,cursor:"pointer"}}>
              <RefreshCw size={11} color={C.dim} />
              <span className="dr-mono" style={{fontSize:10,fontWeight:700,color:C.dim,letterSpacing:".06em"}}>REFRESH</span>
            </button>
          </div>
          <ResultsTable data={joinData} loading={loading} error={error}
            sqlQuery={`SELECT b.build_id, b.commit_sha, b.build_time_sec, b.test_success_rate,\n       pr.title AS pr_title, pr.author__name AS pr_author\nFROM local_metrics.perf_benchmarks b\nJOIN github.pull_requests pr ON pr.merge_commit_sha = b.commit_sha\nWHERE b.test_success_rate < 0.95;`}
          />
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: SQL CONSOLE ───────────────────────────────────────────────────────
const PRESETS = [
  {name:"Discover Coral Tables",sql:"SELECT schema_name, table_name\nFROM coral.tables\nORDER BY 1, 2;"},
  {name:"Perf Benchmarks",sql:"SELECT build_id, commit_sha, build_time_sec,\n       test_success_rate, bundle_size_mb\nFROM local_metrics.perf_benchmarks\nORDER BY timestamp DESC\nLIMIT 10;"},
  {name:"Slow Builds (>60s)",sql:"SELECT build_id, commit_sha, build_time_sec,\n       test_success_rate\nFROM local_metrics.perf_benchmarks\nWHERE build_time_sec > 60.0\nORDER BY build_time_sec DESC;"},
  {name:"Cross-Source JOIN",sql:"SELECT b.build_id, b.commit_sha,\n       b.build_time_sec, b.test_success_rate,\n       pr.title AS pr_title,\n       pr.author__name AS pr_author\nFROM local_metrics.perf_benchmarks b\nJOIN github.pull_requests pr\n  ON pr.merge_commit_sha = b.commit_sha\nWHERE b.test_success_rate < 0.95;"},
  {name:"Open GitHub PRs",sql:"SELECT number, title, author__name, state\nFROM github.pull_requests\nWHERE state = 'open'\nORDER BY number DESC;"},
  {name:"Schema Discovery",sql:"SELECT table_name, column_name, data_type\nFROM coral.columns\nORDER BY table_name, column_name;"},
];

function SQLConsole() {
  const [sql,setSql] = useState(PRESETS[0].sql);
  const [data,setData] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(null);
  const [schema,setSchema] = useState([]);
  const [copied,setCopied] = useState(false);
  const [history,setHistory] = useState([]);

  useEffect(()=>{
    simulateQuery("SELECT schema_name, table_name FROM coral.tables ORDER BY 1;").then(r=>setSchema(r.data||[]));
  },[]);

  const run = async () => {
    if (!sql.trim()) return;
    setLoading(true); setError(null); setData(null);
    try {
      const r = await simulateQuery(sql);
      setData(r.data);
      setHistory(h=>[{sql:sql.replace(/\s+/g," ").slice(0,55)+"…",rows:r.data.length,ts:new Date().toLocaleTimeString()},...h.slice(0,4)]);
    } catch(e) { setError(e.message||"Query failed."); }
    finally { setLoading(false); }
  };

  const copy = () => { navigator.clipboard?.writeText(sql); setCopied(true); setTimeout(()=>setCopied(false),1600); };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="dr-u0">
        <h2 className="dr-orbitron" style={{fontSize:20,fontWeight:700,color:C.text,letterSpacing:".02em",marginBottom:5}}>SQL Query Cabin</h2>
        <p style={{fontSize:13,color:C.dim}}>Write and execute cross-source Coral SQL queries against live API schemas and custom file sources.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 210px",gap:14,alignItems:"start"}}>
        <div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div className="dr-u1 dr-card" style={{background:C.bg900,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"11px 16px",borderBottom:`1px solid ${C.border}`,background:"rgba(10,15,29,.7)"}}>
              <div style={{display:"flex",alignItems:"center",gap:7}}>
                <div style={{width:10,height:10,borderRadius:"50%",background:"#ff5f57"}} />
                <div style={{width:10,height:10,borderRadius:"50%",background:"#febc2e"}} />
                <div style={{width:10,height:10,borderRadius:"50%",background:"#28c840"}} />
                <span className="dr-mono" style={{marginLeft:7,fontSize:9.5,fontWeight:700,color:C.muted,letterSpacing:".1em",textTransform:"uppercase"}}>coral-sql-shell</span>
              </div>
              <div style={{display:"flex",gap:7}}>
                <button onClick={copy} className="dr-btn" style={{display:"flex",alignItems:"center",gap:4,padding:"5px 9px",background:C.bg800,border:`1px solid ${C.border}`,borderRadius:7,cursor:"pointer"}}>
                  {copied?<Check size={11} color={C.teal}/>:<Copy size={11} color={C.dim}/>}
                  <span className="dr-mono" style={{fontSize:9.5,color:copied?C.teal:C.dim}}>{copied?"Copied":"Copy"}</span>
                </button>
                <button onClick={()=>setSql("")} className="dr-btn" style={{padding:"5px 9px",background:C.bg800,border:`1px solid ${C.border}`,borderRadius:7,cursor:"pointer"}}>
                  <span className="dr-mono" style={{fontSize:9.5,color:C.dim}}>Clear</span>
                </button>
                <button onClick={run} disabled={loading} className="dr-btn" style={{display:"flex",alignItems:"center",gap:5,padding:"5px 14px",background:loading?C.bg700:`linear-gradient(135deg,${C.coral},#e63946)`,border:"none",borderRadius:7,cursor:loading?"not-allowed":"pointer"}}>
                  {loading?<Spinner size={14}/>:<Play size={11} fill="white" color="white"/>}
                  <span className="dr-mono" style={{fontSize:10,fontWeight:700,color:"white",letterSpacing:".06em"}}>RUN</span>
                </button>
              </div>
            </div>
            <div style={{padding:"16px 18px",minHeight:150}}>
              <textarea className="dr-editor" value={sql} onChange={e=>setSql(e.target.value)} rows={7}
                spellCheck={false} placeholder="SELECT * FROM local_metrics.perf_benchmarks LIMIT 10;"
                onKeyDown={e=>{if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();run();}}}
              />
              <div className="dr-mono" style={{fontSize:9.5,color:C.muted,marginTop:5}}>⌘ + Enter to run</div>
            </div>
          </div>
          <div className="dr-u2 dr-card" style={{background:C.bg900,border:`1px solid ${C.border}`,borderRadius:14,padding:18}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
              <PingDot color={data?C.teal:C.muted} />
              <span style={{fontWeight:600,color:C.text,fontSize:13}}>Query Results</span>
              {data&&<span className="dr-mono" style={{fontSize:10,color:C.muted,marginLeft:"auto"}}>{data.length} rows</span>}
            </div>
            {(data||loading||error)?<ResultsTable data={data} loading={loading} error={error}/>:
              <div style={{display:"flex",alignItems:"center",justifyContent:"center",minHeight:80,color:C.muted}}>
                <span className="dr-mono" style={{fontSize:12}}>Run a query to see results.</span>
              </div>}
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="dr-u2 dr-card" style={{background:C.bg900,border:`1px solid ${C.border}`,borderRadius:13,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <Zap size={12} color={C.coral} /><span style={{fontWeight:600,color:C.text,fontSize:12}}>Quick Presets</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {PRESETS.map((p,i)=>(
                <button key={i} onClick={()=>setSql(p.sql)} className="dr-preset" style={{textAlign:"left",padding:"7px 9px",background:"rgba(11,15,29,.5)",border:`1px solid ${C.border}`,borderRadius:7,cursor:"pointer",transition:"all .14s ease"}}>
                  <span className="dr-mono" style={{fontSize:9.5,color:C.dim}}>{p.name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="dr-u3 dr-card" style={{background:C.bg900,border:`1px solid ${C.border}`,borderRadius:13,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <Database size={12} color={C.teal} /><span style={{fontWeight:600,color:C.text,fontSize:12}}>Live Schema</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:4,maxHeight:180,overflowY:"auto"}}>
              {schema.map((item,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 7px",borderRadius:6,background:"rgba(11,15,29,.4)"}}>
                  <SourceBadge src={item.schema_name} />
                  <span className="dr-mono" style={{fontSize:9.5,color:C.muted}}>{item.table_name}</span>
                </div>
              ))}
            </div>
          </div>
          {history.length>0&&(
            <div className="dr-u4 dr-card" style={{background:C.bg900,border:`1px solid ${C.border}`,borderRadius:13,padding:14}}>
              <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
                <Clock size={12} color={C.amber} /><span style={{fontWeight:600,color:C.text,fontSize:12}}>History</span>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {history.map((h,i)=>(
                  <div key={i} style={{padding:"6px 8px",borderRadius:6,background:"rgba(11,15,29,.4)"}}>
                    <div className="dr-mono" style={{fontSize:9,color:C.dim,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{h.sql}</div>
                    <div style={{display:"flex",justifyContent:"space-between",marginTop:3}}>
                      <span className="dr-mono" style={{fontSize:9,color:C.teal}}>{h.rows} rows</span>
                      <span className="dr-mono" style={{fontSize:9,color:C.muted}}>{h.ts}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: AI ASSISTANT ──────────────────────────────────────────────────────
const EXAMPLE_PROMPTS = [
  "Show me slowest builds with their GitHub PRs",
  "Which commits caused CI failures under 80%?",
  "List all open pull requests",
  "What schemas does Coral have access to?",
  "Cross-reference sentry errors with recent builds",
];

function AIAssistant() {
  const [prompt,setPrompt] = useState("");
  const [messages,setMessages] = useState([{role:"assistant",content:"Ready. Describe what you want to find across your data sources — I'll translate it into precise Coral SQL with cross-source JOINs.",sql:null,sources:null}]);
  const [aiLoading,setAiLoading] = useState(false);
  const [results,setResults] = useState(null);
  const [runLoading,setRunLoading] = useState(false);
  const [runError,setRunError] = useState(null);
  const chatRef = useRef(null);

  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop=chatRef.current.scrollHeight; },[messages,aiLoading]);

  const submit = useCallback(async (text) => {
    const q = (text||prompt).trim();
    if (!q) return;
    setPrompt(""); setAiLoading(true); setResults(null); setRunError(null);
    setMessages(m=>[...m,{role:"user",content:q,sql:null,sources:null}]);
    try {
      let r = await callClaude(q);
      if (!r?.sql) r = fallbackSQL(q);
      setMessages(m=>[...m,{role:"assistant",content:r.explanation||"Here's the Coral SQL for your query.",sql:r.sql,sources:r.sources}]);
    } catch(_) {
      const fb = fallbackSQL(q);
      setMessages(m=>[...m,{role:"assistant",content:fb.explanation,sql:fb.sql,sources:fb.sources}]);
    }
    setAiLoading(false);
  },[prompt]);

  const runSQL = async (sql) => {
    setRunLoading(true); setRunError(null); setResults(null);
    try { const r = await simulateQuery(sql); setResults(r.data); }
    catch(e) { setRunError("Execution failed."); }
    finally { setRunLoading(false); }
  };

  return (
    <div style={{display:"flex",flexDirection:"column",gap:18}}>
      <div className="dr-u0">
        <h2 className="dr-orbitron" style={{fontSize:20,fontWeight:700,color:C.text,letterSpacing:".02em",marginBottom:5}}>AI Tactical Navigator</h2>
        <p style={{fontSize:13,color:C.dim}}>Ask questions in plain English — Claude translates them into precise Coral SQL with cross-source JOINs.</p>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"1fr 240px",gap:14,alignItems:"start"}}>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div ref={chatRef} className="dr-u1 dr-card" style={{background:C.bg900,border:`1px solid ${C.border}`,borderRadius:14,padding:16,display:"flex",flexDirection:"column",gap:12,minHeight:260,maxHeight:380,overflowY:"auto"}}>
            {messages.map((msg,i)=>(
              <div key={i} style={{display:"flex",flexDirection:msg.role==="user"?"row-reverse":"row",gap:9,alignItems:"flex-start"}}>
                <div style={{width:28,height:28,borderRadius:8,flexShrink:0,background:msg.role==="user"?C.coralBg:C.tealBg,border:`1px solid ${msg.role==="user"?C.coralBorder:C.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>
                  {msg.role==="user"?"👤":"🤖"}
                </div>
                <div style={{flex:1,display:"flex",flexDirection:"column",gap:7,alignItems:msg.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{padding:"9px 13px",borderRadius:11,maxWidth:"90%",background:msg.role==="user"?C.coralBg:"rgba(27,38,68,.45)",border:`1px solid ${msg.role==="user"?C.coralBorder:C.border}`,fontSize:13,color:C.text,lineHeight:1.5}}>
                    {msg.content}
                  </div>
                  {msg.sql&&(
                    <div style={{width:"100%",background:C.bg950,border:`1px solid ${C.border}`,borderRadius:10,overflow:"hidden"}}>
                      <div style={{padding:"8px 12px",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                        <div style={{display:"flex",alignItems:"center",gap:5}}>
                          <Code size={10} color={C.teal} />
                          <span className="dr-mono" style={{fontSize:9,fontWeight:700,color:C.teal,letterSpacing:".1em"}}>GENERATED CORAL SQL</span>
                        </div>
                        <div style={{display:"flex",gap:5}}>{msg.sources?.map(s=><SourceBadge key={s} src={s}/>)}</div>
                      </div>
                      <pre className="dr-mono" style={{margin:0,padding:"11px 14px",fontSize:11.5,color:C.teal,lineHeight:1.75,whiteSpace:"pre-wrap",overflowX:"auto"}}>{msg.sql}</pre>
                      <div style={{padding:"8px 12px",borderTop:`1px solid ${C.border}`}}>
                        <button onClick={()=>runSQL(msg.sql)} disabled={runLoading} className="dr-btn" style={{display:"flex",alignItems:"center",gap:5,padding:"6px 14px",background:`linear-gradient(135deg,${C.teal},#0d9488)`,border:"none",borderRadius:7,cursor:"pointer"}}>
                          {runLoading?<Spinner size={13}/>:<Play size={10} fill={C.bg900} color={C.bg900}/>}
                          <span className="dr-mono" style={{fontSize:10,fontWeight:700,color:C.bg900,letterSpacing:".06em"}}>EXECUTE</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {aiLoading&&(
              <div style={{display:"flex",gap:9,alignItems:"center"}}>
                <div style={{width:28,height:28,borderRadius:8,background:C.tealBg,border:`1px solid ${C.tealBorder}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🤖</div>
                <div style={{padding:"9px 16px",borderRadius:11,background:"rgba(27,38,68,.45)",border:`1px solid ${C.border}`,display:"flex",gap:5,alignItems:"center"}}>
                  {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C.teal,animation:`dr-dot-bounce 1.1s ${i*.18}s ease-in-out infinite`}}/>)}
                </div>
              </div>
            )}
          </div>
          {(results||runLoading||runError)&&(
            <div className="dr-u2 dr-card" style={{background:C.bg900,border:`1px solid ${C.tealBorder}`,borderRadius:14,padding:18}} >
              <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}>
                <PingDot color={C.teal} /><span style={{fontWeight:600,color:C.text,fontSize:13}}>Execution Results</span>
              </div>
              <ResultsTable data={results} loading={runLoading} error={runError} />
            </div>
          )}
          <div className="dr-u2 dr-glow-r dr-card" style={{background:C.bg900,border:`1px solid ${C.coralBorder}`,borderRadius:14,padding:14}}>
            <div style={{display:"flex",gap:9}}>
              <div style={{flex:1}}>
                <input className="dr-input" type="text" value={prompt} onChange={e=>setPrompt(e.target.value)}
                  onKeyDown={e=>e.key==="Enter"&&submit()}
                  placeholder='e.g. "Show me failing builds with linked pull requests"'
                  style={{width:"100%",padding:"11px 14px",background:C.bg800,border:`1px solid ${C.border}`,borderRadius:9,fontSize:13,color:C.text,fontFamily:"Inter,sans-serif",transition:"all .15s ease"}}
                />
              </div>
              <button onClick={()=>submit()} disabled={aiLoading||!prompt.trim()} className="dr-btn" style={{display:"flex",alignItems:"center",gap:6,padding:"11px 18px",background:(!prompt.trim()||aiLoading)?C.bg700:`linear-gradient(135deg,${C.coral},#e63946)`,border:"none",borderRadius:9,cursor:(!prompt.trim()||aiLoading)?"not-allowed":"pointer",opacity:(!prompt.trim()||aiLoading)?.5:1}}>
                <Sparkles size={15} color="white" />
                <span style={{fontSize:13,fontWeight:600,color:"white"}}>Analyze</span>
              </button>
            </div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div className="dr-u2 dr-card" style={{background:C.bg900,border:`1px solid ${C.border}`,borderRadius:13,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <Sparkles size={12} color={C.amber} /><span style={{fontWeight:600,color:C.text,fontSize:12}}>Try These</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:5}}>
              {EXAMPLE_PROMPTS.map((p,i)=>(
                <button key={i} onClick={()=>submit(p)} className="dr-preset" style={{textAlign:"left",padding:"8px 9px",background:"rgba(11,15,29,.5)",border:`1px solid ${C.border}`,borderRadius:7,cursor:"pointer",transition:"all .14s ease"}}>
                  <span style={{fontSize:11,color:C.dim,lineHeight:1.4}}>"{p}"</span>
                </button>
              ))}
            </div>
          </div>
          <div className="dr-u3 dr-card" style={{background:C.bg900,border:`1px solid ${C.border}`,borderRadius:13,padding:14}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:10}}>
              <Activity size={12} color={C.teal} /><span style={{fontWeight:600,color:C.text,fontSize:12}}>How It Works</span>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:9}}>
              {[{n:"01",t:"Describe your query in plain English"},{n:"02",t:"Claude generates Coral SQL with cross-source JOINs"},{n:"03",t:"Review query and its data source origins"},{n:"04",t:"Execute against live or mock data"}].map(({n,t})=>(
                <div key={n} style={{display:"flex",gap:9,alignItems:"flex-start"}}>
                  <span className="dr-orbitron" style={{fontSize:9.5,fontWeight:700,color:C.coral,flexShrink:0,marginTop:1}}>{n}</span>
                  <span style={{fontSize:11,color:C.dim,lineHeight:1.5}}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="dr-u4" style={{padding:12,background:C.tealBg,border:`1px solid ${C.tealBorder}`,borderRadius:13}}>
            <div className="dr-mono" style={{fontSize:9,fontWeight:700,color:C.teal,letterSpacing:".1em",marginBottom:6}}>AI COPILOT POWERED BY</div>
            <div className="dr-orbitron" style={{fontSize:13,fontWeight:700,color:C.text}}>Claude Sonnet 4</div>
            <div style={{fontSize:10,color:C.dim,marginTop:4,lineHeight:1.5}}>Real-time NL→SQL translation with Coral schema context</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SIDEBAR ─────────────────────────────────────────────────────────────────
const NAV = [
  {id:"dashboard",label:"Voyage Log",sub:"Overview & Analytics",icon:LayoutDashboard},
  {id:"sql",label:"Query Cabin",sub:"SQL Explorer",icon:Terminal},
  {id:"ai",label:"AI Navigator",sub:"NL → Coral SQL",icon:Bot},
];

function Sidebar({tab,setTab,bypass,setBypass}) {
  const [time,setTime] = useState(new Date());
  useEffect(()=>{ const t=setInterval(()=>setTime(new Date()),1000); return()=>clearInterval(t); },[]);
  return (
    <aside style={{width:228,flexShrink:0,background:`linear-gradient(180deg,${C.bg900} 0%,${C.bg950} 100%)`,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",overflow:"hidden"}}>
      <div style={{padding:"18px 16px 14px",borderBottom:`1px solid ${C.border}`}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{padding:8,borderRadius:10,background:C.coralBg,border:`1px solid ${C.coralBorder}`,animation:"dr-glow-r 3s ease-in-out infinite"}}>
            <Ship size={17} color={C.coral} />
          </div>
          <div>
            <div className="dr-orbitron" style={{fontSize:14,fontWeight:900,color:C.text,letterSpacing:".08em",lineHeight:1}}>DEVRADAR</div>
            <div className="dr-shimmer dr-mono" style={{fontSize:7.5,fontWeight:700,letterSpacing:".15em"}}>CORAL SQL ENGINE</div>
          </div>
        </div>
      </div>
      <div style={{padding:"14px 16px",borderBottom:`1px solid ${C.border}`}}>
        <div className="dr-mono" style={{fontSize:9,color:C.muted,letterSpacing:".1em",textTransform:"uppercase",marginBottom:9}}>Source Network Map</div>
        <RadarViz />
        <div style={{display:"flex",justifyContent:"space-around",marginTop:7}}>
          {[["GH","#94a3b8"],["ST",C.amber],["SL",C.violet],["LM",C.teal]].map(([l,c])=>(
            <div key={l} style={{textAlign:"center"}}>
              <PingDot color={c} size={7} />
              <div className="dr-mono" style={{fontSize:8,color:C.muted,marginTop:3}}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <nav style={{padding:"10px 8px",flex:1,display:"flex",flexDirection:"column",gap:3}}>
        {NAV.map(item=>{
          const Icon=item.icon, active=tab===item.id;
          return (
            <button key={item.id} onClick={()=>setTab(item.id)} className="dr-nav" style={{display:"flex",alignItems:"center",gap:9,padding:"9px 10px",borderRadius:9,background:active?`linear-gradient(135deg,${C.bg700},${C.bg800})`:"transparent",borderLeft:`3px solid ${active?C.coral:"transparent"}`,cursor:"pointer"}}>
              <Icon size={15} color={active?C.coral:C.muted} />
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:active?C.text:C.dim,lineHeight:1}}>{item.label}</div>
                <div className="dr-mono" style={{fontSize:8.5,color:C.muted,marginTop:2}}>{item.sub}</div>
              </div>
              {active&&<ChevronRight size={11} color={C.coral} />}
            </button>
          );
        })}
      </nav>
      <div style={{padding:"10px 12px",borderTop:`1px solid ${C.border}`}}>
        <div style={{padding:"9px 11px",borderRadius:9,background:"rgba(27,38,68,.4)",border:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:9}}>
          <div>
            <div style={{fontSize:10,fontWeight:600,color:C.dim}}>Run Mode</div>
            <div className="dr-mono" style={{fontSize:8.5,color:bypass?C.amber:C.teal,marginTop:2}}>
              {bypass?"⚡ Mock Fallback":"🔌 Coral Live"}
            </div>
          </div>
          <button onClick={()=>setBypass(!bypass)} className="dr-btn" style={{background:"none",border:"none",cursor:"pointer",color:bypass?C.muted:C.teal}}>
            {bypass?<ToggleLeft size={26}/>:<ToggleRight size={26}/>}
          </button>
        </div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:4}}>
            <Compass size={9} color={C.muted} />
            <span className="dr-mono" style={{fontSize:8.5,color:C.muted}}>WeMakeDevs 2026</span>
          </div>
          <span className="dr-mono" style={{fontSize:8.5,color:C.muted}}>{time.toLocaleTimeString()}</span>
        </div>
      </div>
    </aside>
  );
}

// ─── TOP BAR ─────────────────────────────────────────────────────────────────
function TopBar({tab,bypass}) {
  const titles={dashboard:"Voyage Log Overview",sql:"SQL Query Cabin",ai:"AI Tactical Navigator"};
  return (
    <header style={{height:50,flexShrink:0,borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 22px",background:`${C.bg900}cc`}}>
      <div style={{display:"flex",alignItems:"center",gap:9}}>
        <PingDot />
        <span className="dr-mono" style={{fontSize:9.5,fontWeight:700,color:C.teal,letterSpacing:".1em",textTransform:"uppercase"}}>CORAL ENGINE ACTIVE</span>
        <span style={{color:C.border,marginLeft:3}}>|</span>
        <span className="dr-mono" style={{fontSize:9.5,color:C.muted}}>{titles[tab]}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:5,padding:"3px 9px",borderRadius:6,background:bypass?C.amberBg:C.tealBg,border:`1px solid ${bypass?"rgba(245,158,11,.3)":"rgba(20,184,166,.3)"}`}}>
          <span className="dr-mono" style={{fontSize:9,fontWeight:700,color:bypass?C.amber:C.teal}}>{bypass?"⚡ MOCK MODE":"🔌 LIVE MODE"}</span>
        </div>
        <span className="dr-mono" style={{fontSize:9.5,color:C.muted}}>/workspaces/devradar</span>
      </div>
    </header>
  );
}

// ─── ROOT ────────────────────────────────────────────────────────────────────
export default function DevRadar() {
  useStyles();
  const [tab,setTab] = useState("dashboard");
  const [bypass,setBypass] = useState(true);
  const pages = { dashboard:<Dashboard/>, sql:<SQLConsole/>, ai:<AIAssistant/> };
  return (
    <div id="dr" style={{display:"flex",height:"100vh",width:"100%",overflow:"hidden",background:C.bg950,color:C.text}}>
      <Sidebar tab={tab} setTab={setTab} bypass={bypass} setBypass={setBypass} />
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden",minWidth:0}}>
        <TopBar tab={tab} bypass={bypass} />
        <main style={{flex:1,overflowY:"auto",padding:24}}>
          <div key={tab}>{pages[tab]}</div>
        </main>
      </div>
    </div>
  );
}
