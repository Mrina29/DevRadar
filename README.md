# ⚓ DevRadar: Your Engineering Radar, Powered by Coral SQL

> **A local-first engineering intelligence console unifying disparate developer tools and local diagnostics into standard SQL relations.**
> Built for the **WeMakeDevs May 2026 Hackathon** in partnership with Coral.

---

## 🏴‍☠️ The Voyage (Overview)

Modern software teams use a fragmented fleet of tools. Pinpointing the root cause of a regression usually requires jumping across GitHub, Sentry, Slack, and local performance files, manually piecing together timelines.

**DevRadar** solves this fragmentation. It uses **Coral** as a unified data retrieval engine, treating third-party APIs and local metrics directories as a single queryable database. 

By mapping GitHub pull requests, Sentry exceptions, and a custom build-performance file tracker into standard SQL schemas, DevRadar allows developers to run complex, cross-source analytical queries entirely on their local machine.

---

## 🛠️ Key Architectural Highlights & Coral Integrations

DevRadar is designed to showcase every core advantage of the Coral ecosystem:

```mermaid
graph TD
    User([Developer / Operator]) -->|Natural Language / SQL| FE[React Frontend]
    FE -->|Post Requests| BE[Express Node.js Server]
    BE -->|Executes Shell Commands| CLI[Coral CLI Engine]
    CLI -->|Queries JSONL| CS[Custom DSL v3 Local Metrics Source]
    CLI -->|Queries APIs| GH[GitHub API Connector]
    CLI -->|Queries APIs| SE[Sentry / Slack Connectors]
    CS -->|Template Evaluation| FileSystem[(Local Filesystem)]
1. Cross-Source Correlated Joins
DevRadar executes high-fidelity SQL statements that join live cloud repositories with local benchmarks. For example, to identify which merged Pull Request is correlated with a performance regression, DevRadar executes:
code
SQL
SELECT 
    b.build_id, 
    b.commit_sha, 
    b.build_time_sec, 
    pr.title AS pr_title, 
    pr.author__name AS pr_author 
FROM local_metrics.perf_benchmarks b 
JOIN github.pull_requests pr ON pr.merge_commit_sha = b.commit_sha 
WHERE b.test_success_rate < 0.95;
2. Custom DSL v3 Source Connector (local_metrics)
To demonstrate Coral's extensibility, we developed a custom source specification (custom-source/local_metrics.yaml) using Coral's DSL Version 3. It points to local JSON-Lines (.jsonl) performance data and dynamically evaluates path parameters using local environment variables:
code
Yaml
source:
  location: "file://{{env.METRICS_DIR_PATH}}/"
  glob: "*.jsonl"
3. Dynamic Schema Discovery
Using Coral's system tables (coral.tables and coral.columns), DevRadar automatically inspects and reflects available databases in the UI without requiring hardcoded configuration updates.
4. Natural Language Copilot (AI-to-SQL Translation)
Our tactical assistant translates simple developer prompts into exact SQL code. Because Coral handles the abstraction, our AI prompt doesn't need complex instructions on fetching REST pagination. It simply outputs clean SQL, which is executed directly via the local coral command-line process.
5. Multi-Mode Demo Switch (Bulletproof Presentation)
Knowing that credentials can sometimes fail during a live presentation, DevRadar includes a Mock Fallback Engine built directly into the backend. By toggling the switch in the UI, you can run the platform in mock mode (using seeded data representing Coral's structures) or live mode (directly orchestrating the local coral binary).
📁 Repository Structure
code
Text
devradar/
├── custom-source/
│   ├── perf_benchmarks.jsonl   # Local seed data representing CI performance metrics
│   └── local_metrics.yaml       # Coral DSL v3 custom source specification
├── backend/
│   ├── server.js               # Node.js backend running the CLI commands & mock routes
│   └── mockData.js             # Fallback datasets matching true SQL outputs
└── frontend/
    ├── src/
    │   ├── api/client.js       # Unified client interface
    │   ├── components/
    │   │   ├── Layout.jsx      # Dark nautical-themed frame
    │   │   └── pages/
    │   │       ├── Dashboard.jsx   # Relational metrics visualization
    │   │       ├── SQLConsole.jsx  # Interactive SQL workspace
    │   │       └── AIAssistant.jsx # Natural Language SQL translation workspace
    │   └── App.jsx
    └── index.html
🚀 Getting Started Locally
Prerequisites
Node.js (v18 or higher recommended)
Coral CLI installed and initialized. Follow the Coral Documentation to set up your credentials for GitHub.
Step 1: Clone & Configure Custom Source
First, configure Coral to read your local performance telemetry metrics.
code
Bash
# Clone the repository
git clone https://github.com/yourusername/devradar.git
cd devradar

# Set the environment variable to your local repository path
export METRICS_DIR_PATH=$(pwd)/custom-source

# Register the custom source schema with Coral
coral source add --file custom-source/local_metrics.yaml

# Test that the custom source compiles and queries successfully
coral source test local_metrics
Step 2: Set up the Backend
code
Bash
cd backend
npm install

# (Optional) Create a .env file if customizing ports or Coral parameters
# Start the server
npm start
The backend should now be running at http://localhost:5001.
Step 3: Set up the Frontend
code
Bash
cd ../frontend
npm install

# Run the Vite server
npm run dev
Open http://localhost:3000 in your browser.
