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

const publicAssetsDir = path.join(__dirname, '../public/project_assets');

// Ensure base public assets directory exists
if (!fs.existsSync(publicAssetsDir)) {
  fs.mkdirSync(publicAssetsDir, { recursive: true });
}

for (const [title, p] of Object.entries(readmes)) {
  if (fs.existsSync(p)) {
    let content = fs.readFileSync(p, 'utf-8');
    const readmeDir = path.dirname(p);

    // Sanitize title for folder name
    const safeTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const projectAssetDir = path.join(publicAssetsDir, safeTitle);

    // Find all markdown images: ![alt](url)
    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;

    content = content.replace(imageRegex, (match, alt, imgPath) => {
      // Skip absolute URLs
      if (imgPath.startsWith('http://') || imgPath.startsWith('https://') || imgPath.startsWith('data:')) {
        return match;
      }

      // It's a relative path. Resolve it locally.
      const localImagePath = path.join(readmeDir, imgPath);

      if (fs.existsSync(localImagePath)) {
        // Create destination directory if it doesn't exist
        const destImagePath = path.join(projectAssetDir, imgPath);
        const destImageDir = path.dirname(destImagePath);
        if (!fs.existsSync(destImageDir)) {
          fs.mkdirSync(destImageDir, { recursive: true });
        }

        // Copy file
        fs.copyFileSync(localImagePath, destImagePath);

        // Replace with new public path
        // In next.js/vite, files in `public/project_assets/...` are served at `/project_assets/...`
        // Ensure forward slashes for web URLs
        let webPath = `/project_assets/${safeTitle}/${imgPath}`.replace(/\\/g, '/');
        // Clean up any double slashes just in case
        webPath = webPath.replace(/\/\//g, '/');

        return `![${alt}](${webPath})`;
      } else {
        console.warn(`[WARN] Image not found: ${localImagePath}`);
        return match;
      }
    });

    output[title] = content;
  } else {
    output[title] = "README not found.";
  }
}

const tsContent = `// Automatically generated from local README files\n\nexport const projectReadmes: Record<string, string> = ${JSON.stringify(output, null, 2)};\n`;

fs.mkdirSync(path.join(__dirname, '../src/data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../src/data/readmes.ts'), tsContent);

console.log("Generated readmes.ts successfully. Copied assets to public/project_assets");
