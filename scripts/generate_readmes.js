const fs = require('fs');
const path = require('path');

const readmes = {
  "Anomaly Detection Vision Transformer": "e:/PROJECTS/AVT/3/vad_project_app/README.md",
  "Federated Hospital System": "e:/PROJECTS/Federated-Hospital-System/README.md",
  "GetFlowDone AI Agent Builder": "e:/PROJECTS/AgentFlow/README.md",
  "RAG Recommendation Engine": "e:/PROJECTS/RagTestAssesment/README.md",
  "Crux – Local Synthetic Data Engine": "e:/PROJECTS/CRUX - data processing/README.md",
  "LeLo_InterView – AI Interviewer": "e:/PROJECTS/ViewInAi/Rag_Interview_Ai_2/README.md",
  "HiringSpree AI – Resume Screener": "e:/PROJECTS/HIreLen/README.md"
};

const output = {};

for (const [title, p] of Object.entries(readmes)) {
  if (fs.existsSync(p)) {
    // Read content and handle possible backticks or issues by stringifying
    output[title] = fs.readFileSync(p, 'utf-8');
  } else {
    output[title] = "README not found.";
  }
}

const tsContent = `// Automatically generated from local README files\n\nexport const projectReadmes: Record<string, string> = ${JSON.stringify(output, null, 2)};\n`;

fs.mkdirSync(path.join(__dirname, '../src/data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../src/data/readmes.ts'), tsContent);

console.log("Generated readmes.ts successfully.");
