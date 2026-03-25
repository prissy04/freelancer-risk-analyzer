import { useState } from "react";

const ANTHROPIC_API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

function getRateLimit() {
  const today = new Date().toDateString();
  try {
    const s = JSON.parse(localStorage.getItem("rla_rl") || "{}");
    if (s.date !== today) return { count: 0, date: today };
    return s;
  } catch { return { count: 0, date: today }; }
}

function bumpRate() {
  const r = getRateLimit();
  const u = { date: r.date, count: r.count + 1 };
  try { localStorage.setItem("rla_rl", JSON.stringify(u)); } catch {}
  return u.count;
}

const QUESTIONS = [
  { id: "q1", label: "Active clients", q: "How many active clients do you currently have?", opts: ["1", "2-3", "4-6", "7+"] },
  { id: "q2", label: "Income concentration", q: "What % of your income comes from your single biggest client?", opts: ["Under 25%", "25-49%", "50-74%", "75-100%"] },
  { id: "q3", label: "Active projects", q: "How many active projects are you currently juggling?", opts: ["1-2", "3-4", "5-6", "7+"] },
  { id: "q4", label: "Upcoming deadlines", q: "How many project deadlines do you have in the next 2 weeks?", opts: ["0-1", "2-3", "4-5", "6+"] },
  { id: "q5", label: "Payment terms", q: "What payment terms do most clients use?", opts: ["Upfront (100%)", "50/50 split", "Net-30", "Net-60 or longer"] },
  { id: "q6", label: "Scope changes", q: "Have clients changed requirements mid-project in the last 3 months?", opts: ["Never", "Once or twice", "Frequently", "Almost every project"] },
  { id: "q7", label: "Skill confidence", q: "How confident are you in your skills for ALL current projects?", opts: ["Very confident", "Mostly confident", "Somewhat unsure", "Struggling"] },
  { id: "q8", label: "New leads", q: "Do you have new leads or prospects in your pipeline right now?", opts: ["Strong pipeline (3+)", "A couple of leads", "One maybe", "Nothing"] },
  { id: "q9", label: "Weekly hours", q: "How many hours per week are you currently working?", opts: ["Under 20", "20-40", "40-50", "50+"] },
  { id: "q10", label: "Last day off", q: "When did you last take a full day completely off from client work?", opts: ["This week", "Last week", "Last month", "Cannot remember"] }
];

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --bg: #0d0f14; --surface: #13161e; --surface2: #1a1e2a;
    --border: #252836; --border-light: #2e3348;
    --text: #e8eaf2; --text-muted: #7a7f96; --text-dim: #4a4f66;
    --accent: #e8c97e; --accent-dim: rgba(232,201,126,0.12);
    --red: #e05555; --red-bg: rgba(224,85,85,0.1); --red-border: rgba(224,85,85,0.3);
    --amber: #e09040; --amber-bg: rgba(224,144,64,0.1); --amber-border: rgba(224,144,64,0.3);
    --green: #4caf82; --green-bg: rgba(76,175,130,0.1); --green-border: rgba(76,175,130,0.3);
    --radius: 12px; --radius-sm: 8px;
  }
  body { background: var(--bg); color: var(--text); font-family: 'DM Sans', sans-serif; min-height: 100vh; line-height: 1.6; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .header { border-bottom: 1px solid var(--border); padding: 20px 28px; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: rgba(13,15,20,0.97); backdrop-filter: blur(12px); z-index: 100; }
  .hb { display: flex; align-items: center; gap: 12px; }
  .hi { width: 34px; height: 34px; background: var(--accent-dim); border: 1px solid rgba(232,201,126,0.3); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 16px; }
  .ht { font-family: 'Playfair Display', serif; font-size: 16px; font-weight: 700; color: var(--text); }
  .hbadge { font-size: 10px; font-weight: 600; color: var(--accent); background: var(--accent-dim); border: 1px solid rgba(232,201,126,0.2); padding: 3px 10px; border-radius: 20px; letter-spacing: .5px; text-transform: uppercase; }
  .main { flex: 1; max-width: 720px; margin: 0 auto; width: 100%; padding: 48px 20px 72px; }
  .hero { margin-bottom: 48px; animation: fadeUp .5s ease both; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
  .eyebrow { font-size: 10px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; color: var(--accent); margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
  .eyebrow::before { content: ''; display: inline-block; width: 20px; height: 1px; background: var(--accent); }
  .h1 { font-family: 'Playfair Display', serif; font-size: clamp(28px,5vw,46px); font-weight: 900; line-height: 1.1; letter-spacing: -1.2px; color: var(--text); margin-bottom: 18px; }
  .h1 em { font-style: italic; color: var(--accent); }
  .sub { font-size: 15px; color: var(--text-muted); max-width: 500px; line-height: 1.7; font-weight: 300; }
  .story { margin-top: 24px; padding: 18px 22px; background: var(--surface); border: 1px solid var(--border-light); border-left: 3px solid var(--accent); border-radius: var(--radius); font-size: 13px; color: var(--text-muted); line-height: 1.7; font-style: italic; }
  .story strong { color: var(--text); font-style: normal; }
  .prog-wrap { margin-bottom: 32px; }
  .prog-labels { display: flex; justify-content: space-between; margin-bottom: 8px; }
  .prog-text { font-size: 11px; font-weight: 600; color: var(--text-dim); text-transform: uppercase; letter-spacing: 1px; }
  .prog-count { font-size: 11px; color: var(--accent); font-weight: 600; }
  .prog-bg { height: 3px; background: var(--border); border-radius: 2px; overflow: hidden; }
  .prog-fill { height: 100%; background: var(--accent); border-radius: 2px; transition: width .4s ease; }
  .qcard { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; margin-bottom: 14px; transition: border-color .2s; }
  .qcard:hover { border-color: var(--border-light); }
  .qcard.answered { border-color: rgba(232,201,126,0.2); }
  .qheader { display: flex; align-items: flex-start; gap: 14px; margin-bottom: 16px; }
  .qnum { width: 26px; height: 26px; min-width: 26px; background: var(--surface2); border: 1px solid var(--border-light); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 600; color: var(--text-muted); transition: all .2s; }
  .qcard.answered .qnum { background: var(--accent-dim); border-color: rgba(232,201,126,0.4); color: var(--accent); }
  .qcat { font-size: 9px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; color: var(--text-dim); margin-bottom: 3px; }
  .qtxt { font-size: 15px; font-weight: 500; color: var(--text); line-height: 1.4; }
  .opts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-left: 40px; }
  .opt { background: var(--surface2); border: 1px solid var(--border); color: var(--text-muted); border-radius: var(--radius-sm); padding: 9px 13px; font-size: 13px; font-family: 'DM Sans', sans-serif; text-align: left; cursor: pointer; transition: all .15s; line-height: 1.3; }
  .opt:hover { border-color: var(--border-light); color: var(--text); background: #1e2230; }
  .opt.sel { background: var(--accent-dim); border-color: rgba(232,201,126,0.5); color: var(--accent); font-weight: 500; }
  .submit-area { margin-top: 28px; }
  .rate-note { font-size: 11px; color: var(--text-dim); margin-bottom: 14px; text-align: center; }
  .sbtn { width: 100%; padding: 17px; background: var(--accent); color: #0d0f14; border: none; border-radius: var(--radius); font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: 600; cursor: pointer; transition: all .2s; }
  .sbtn:hover:not(:disabled) { background: #f0d898; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(232,201,126,0.2); }
  .sbtn:disabled { opacity: .4; cursor: not-allowed; transform: none; }
  .loading { text-align: center; padding: 72px 24px; animation: fadeUp .4s ease both; }
  .spinner { width: 40px; height: 40px; border: 2px solid var(--border-light); border-top-color: var(--accent); border-radius: 50%; animation: spin .8s linear infinite; margin: 0 auto 20px; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .ltitle { font-family: 'Playfair Display', serif; font-size: 22px; color: var(--text); margin-bottom: 8px; }
  .lsub { font-size: 13px; color: var(--text-muted); }
  .results { animation: fadeUp .5s ease both; }
  .rtitle { font-family: 'Playfair Display', serif; font-size: 36px; font-weight: 900; letter-spacing: -1px; color: var(--text); margin-bottom: 6px; }
  .rsub { font-size: 14px; color: var(--text-muted); font-weight: 300; margin-bottom: 32px; }
  .summary { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 36px; }
  .scard { background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); padding: 18px; text-align: center; }
  .snum { font-family: 'Playfair Display', serif; font-size: 34px; font-weight: 900; margin-bottom: 4px; }
  .snum.r { color: var(--red); } .snum.a { color: var(--amber); } .snum.g { color: var(--green); }
  .slabel { font-size: 11px; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; font-weight: 600; }
  .rcard { background: var(--surface); border-radius: var(--radius); padding: 24px; margin-bottom: 14px; border: 1px solid var(--border); border-left: 3px solid transparent; }
  .rcard.high { border-left-color: var(--red); }
  .rcard.medium { border-left-color: var(--amber); }
  .rcard.low { border-left-color: var(--green); }
  .rheader { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; gap: 12px; }
  .rname { font-size: 15px; font-weight: 600; color: var(--text); }
  .rbadge { padding: 3px 11px; border-radius: 20px; font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; }
  .rbadge.high { background: var(--red-bg); color: var(--red); border: 1px solid var(--red-border); }
  .rbadge.medium { background: var(--amber-bg); color: var(--amber); border: 1px solid var(--amber-border); }
  .rbadge.low { background: var(--green-bg); color: var(--green); border: 1px solid var(--green-border); }
  .rexpl { font-size: 13px; color: var(--text-muted); line-height: 1.7; margin-bottom: 14px; }
  .raction { display: flex; align-items: flex-start; gap: 10px; background: var(--surface2); border: 1px solid var(--border-light); border-radius: var(--radius-sm); padding: 12px 14px; }
  .aicon { font-size: 13px; margin-top: 1px; flex-shrink: 0; color: var(--accent); }
  .atxt { font-size: 12px; color: var(--text); font-weight: 500; line-height: 1.5; }
  .err { background: var(--red-bg); border: 1px solid var(--red-border); border-radius: var(--radius); padding: 18px 22px; margin-bottom: 22px; color: var(--red); font-size: 13px; line-height: 1.6; }
  .rbtn { background: transparent; border: 1px solid var(--border-light); color: var(--text-muted); padding: 12px 24px; border-radius: var(--radius-sm); font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all .2s; margin-top: 28px; display: block; width: 100%; text-align: center; }
  .rbtn:hover { border-color: var(--accent); color: var(--accent); }
  .footer { border-top: 1px solid var(--border); padding: 20px 28px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; }
  .fl { font-size: 12px; color: var(--text-dim); } .fl strong { color: var(--text-muted); }
  .fr { font-size: 11px; color: var(--text-dim); }
  @media(max-width:560px) { .opts { grid-template-columns: 1fr; margin-left: 0; } .summary { grid-template-columns: 1fr; } }
`;

function buildPrompt(answers) {
  const lines = QUESTIONS.map(q => q.q + ": " + answers[q.id]).join("\n");
  return "You are a senior business advisor for freelancers. Analyze these self-assessment answers and return ONLY valid JSON with no markdown, no explanation, no preamble.\n\nAnswers:\n" + lines + "\n\nReturn exactly this structure:\n{\"risks\":[{\"category\":\"Income Concentration Risk\",\"level\":\"High\",\"explanation\":\"2 sentences.\",\"action\":\"One action step.\"},{\"category\":\"Overcommitment & Burnout Risk\",\"level\":\"Medium\",\"explanation\":\"2 sentences.\",\"action\":\"One action step.\"},{\"category\":\"Cash Flow Gap Risk\",\"level\":\"Low\",\"explanation\":\"2 sentences.\",\"action\":\"One action step.\"},{\"category\":\"Skill Mismatch Risk\",\"level\":\"High\",\"explanation\":\"2 sentences.\",\"action\":\"One action step.\"},{\"category\":\"Pipeline Health Risk\",\"level\":\"Medium\",\"explanation\":\"2 sentences.\",\"action\":\"One action step.\"}]}\n\nReplace the level values with High, Medium or Low based on the answers. Be specific and reference their actual answers.";
}

export default function App() {
  const [answers, setAnswers] = useState({});
  const [stage, setStage] = useState("form");
  const [results, setResults] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const answered = Object.keys(answers).length;
  const allAnswered = answered === QUESTIONS.length;
  const progress = (answered / QUESTIONS.length) * 100;

  function selectOption(qId, val) {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  }

  async function analyze() {
    const rl = getRateLimit();
    if (rl.count >= 3) {
      setErrorMsg("You have used all 3 free analyses for today. Come back tomorrow.");
      setStage("error");
      return;
    }
    if (!ANTHROPIC_API_KEY) {
      setErrorMsg("API key not configured. Add VITE_ANTHROPIC_API_KEY to your .env file.");
      setStage("error");
      return;
    }
    setStage("loading");
    bumpRate();
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "anthropic-dangerous-direct-browser-access": "true"
        },
        body: JSON.stringify({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt(answers) }]
        })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error?.message || "API error " + response.status);
      }
      const data = await response.json();
      const text = data.content[0].text.trim().replace(/```json|```/g, "").trim();
      setResults(JSON.parse(text));
      setStage("results");
    } catch (e) {
      setErrorMsg("Something went wrong: " + e.message);
      setStage("error");
    }
  }

  function reset() {
    setAnswers({});
    setStage("form");
    setResults(null);
    setErrorMsg("");
  }

  const riskCounts = results ? {
    high: results.risks.filter(r => r.level === "High").length,
    medium: results.risks.filter(r => r.level === "Medium").length,
    low: results.risks.filter(r => r.level === "Low").length,
  } : null;

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="hb">
            <div className="hi">📊</div>
            <div className="ht">Business Risk Analyzer</div>
          </div>
          <div className="hbadge">Free Tool</div>
        </header>
        <main className="main">
          {(stage === "form" || stage === "error") && (
            <>
              <div className="hero">
                <div className="eyebrow">AI-Powered Business Health Check</div>
                <h1 className="h1">Know your risks<br /><em>before they know you.</em></h1>
                <p className="sub">Answer 10 questions about your freelance business. Claude AI identifies real risks across 5 dimensions.</p>
                <div className="story">
                  <strong>Why this exists:</strong> I watched my son burn out managing high school freelance design work. I searched everywhere for a tool to help. Nothing existed. So I built it. — Prisca M
                </div>
              </div>
              {stage === "error" && <div className="err">{errorMsg}</div>}
              <div className="prog-wrap">
                <div className="prog-labels">
                  <span className="prog-text">Questions answered</span>
                  <span className="prog-count">{answered} / {QUESTIONS.length}</span>
                </div>
                <div className="prog-bg">
                  <div className="prog-fill" style={{ width: progress + "%" }} />
                </div>
              </div>
              {QUESTIONS.map((q, i) => (
                <div key={q.id} className={"qcard " + (answers[q.id] ? "answered" : "")}>
                  <div className="qheader">
                    <div className="qnum">{i + 1}</div>
                    <div>
                      <div className="qcat">{q.label}</div>
                      <div className="qtxt">{q.q}</div>
                    </div>
                  </div>
                  <div className="opts">
                    {q.opts.map(opt => (
                      <button key={opt} className={"opt " + (answers[q.id] === opt ? "sel" : "")} onClick={() => selectOption(q.id, opt)}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <div className="submit-area">
                <div className="rate-note">3 free analyses per day · No account required · No data stored</div>
                <button className="sbtn" disabled={!allAnswered} onClick={analyze}>
                  {allAnswered ? "Analyze My Business Risk →" : "Answer all " + (QUESTIONS.length - answered) + " remaining questions to continue"}
                </button>
              </div>
            </>
          )}
          {stage === "loading" && (
            <div className="loading">
              <div className="spinner" />
              <div className="ltitle">Analyzing your business...</div>
              <div className="lsub">Claude AI is reviewing your answers across all 5 risk dimensions</div>
            </div>
          )}
          {stage === "results" && results && (
            <div className="results">
              <div className="rtitle">Your Risk Report</div>
              <div className="rsub">Based on your answers across 5 business dimensions</div>
              <div className="summary">
                <div className="scard"><div className="snum r">{riskCounts.high}</div><div className="slabel">High Risk</div></div>
                <div className="scard"><div className="snum a">{riskCounts.medium}</div><div className="slabel">Medium Risk</div></div>
                <div className="scard"><div className="snum g">{riskCounts.low}</div><div className="slabel">Low Risk</div></div>
              </div>
              {[...results.risks].sort((a, b) => ({ High: 0, Medium: 1, Low: 2 }[a.level] - { High: 0, Medium: 1, Low: 2 }[b.level])).map((risk, i) => (
                <div key={i} className={"rcard " + risk.level.toLowerCase()}>
                  <div className="rheader">
                    <div className="rname">{risk.category}</div>
                    <div className={"rbadge " + risk.level.toLowerCase()}>{risk.level} Risk</div>
                  </div>
                  <p className="rexpl">{risk.explanation}</p>
                  <div className="raction">
                    <span className="aicon">→</span>
                    <span className="atxt">{risk.action}</span>
                  </div>
                </div>
              ))}
              <button className="rbtn" onClick={reset}>↺ Start a new analysis</button>
            </div>
          )}
        </main>
        <footer className="footer">
          <div className="fl">Built by <strong>Prisca M</strong> · AI Freelancer Business Risk Analyzer</div>
          <div className="fr">Powered by Anthropic Claude · Free · No data stored</div>
        </footer>
      </div>
    </>
  );
}
