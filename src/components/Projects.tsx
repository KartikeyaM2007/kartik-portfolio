"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaGithub } from "react-icons/fa";
import InteractiveProjectCard from "./InteractiveProjectCard";
import ProjectModal from "./ProjectModal";
import { projectReadmes } from "../data/readmes";

export default function Projects() {
  const [selectedProject, setSelectedProject] = useState<{title: string, markdownContent: string} | null>(null);

  const handleOpenDetails = (title: string) => {
    setSelectedProject({
      title,
      markdownContent: projectReadmes[title] || "*No README available for this project.*"
    });
  };
  const projects = [
    { 
      title: "Anomaly Detection Vision Transformer", 
      stack: ["PyTorch", "VideoMAE", "OpenCV", "PySide6"], 
      stat: "97.2% Acc | 0.98 AUROC", 
      appCode: "https://github.com/KartikeyaM2007/Anomaly_Detection_Vision_Transformer-AVT-AppVersion-2.0",
      webCode: "https://github.com/KartikeyaM2007/Anomaly_Detection_Vision_Transformer-AVT",
      live: "https://huggingface.co/spaces/Kartikeym2007/Anomaly_Detection_Vision_Transformer-AVT",
      app: "https://github.com/KartikeyaM2007/Anomaly_Detection_Vision_Transformer-AVT-AppVersion-2.0/releases/tag/v2.0.0",
      image: "https://raw.githubusercontent.com/KartikeyaM2007/Anomaly_Detection_Vision_Transformer-AVT-AppVersion-2.0/main/docs/screenshots/localhost-results.png",
      desc: "Trained a 9M parameter VideoMAE + AnomalyTransformer on 250GB+ video data. Windows app features live camera alerts, timelines, and summaries." 
    },
    { 
      title: "Federated Hospital System", 
      stack: ["TensorFlow.js", "Django", "Federated Learning", "RBAC"], 
      stat: "92.69% Acc | 140K+ Samples", 
      github: "https://github.com/KartikeyaM2007/Federated-System-V2",
      live: "https://federated-system-v2-production.up.railway.app/",
      workflow: "Hospitals Connect → Local Model Training (TF.js) → Encrypted Weight Exchange → Global Model Aggregation",
      desc: "Privacy-preserving hospital training platform utilizing browser-based TensorFlow.js client training, Django backend, and secure RBAC." 
    },
    { 
      title: "GetFlowDone AI Agent Builder", 
      stack: ["Next.js", "React Flow", "Convex", "Gemini", "Clerk"], 
      stat: "WebSocket Autosave | 11 Pages", 
      github: "https://github.com/KartikeyaM2007/GetFlowDone",
      live: "https://get-flow-done.vercel.app/",
      workflow: "User Enters Playground → Connect Nodes (Agent, API, Logic) → Compile Schema Payload → Real-Time DB Sync → Chat Simulator",
      desc: "Visual agent builder canvas with REST nodes, loops, parameter extraction, Convex db integration, Clerk authentication, and agent playground." 
    },
    { 
      title: "RAG Recommendation Engine", 
      stack: ["FastAPI Async", "Gemini", "TF-IDF", "RAG"], 
      stat: "Recall@10: 0.373 -> 0.65+", 
      github: "https://github.com/KartikeyaM2007/Rag_Based_SHL_Test_Recommedation",
      live: "https://rag-based-shl-test-recommedation-lemon.vercel.app/",
      workflow: "User Query → Key Rotation → LLM Rewrite → Hybrid Search (Vector + Keyword) → LLM Rerank → Ranked Response",
      desc: "Hybrid retrieval pipeline combining FastAPI Async, Gemini embeddings, TF-IDF cosine search, query expansion, and LLM reranking." 
    },
    { 
      title: "Crux – Local Synthetic Data Engine", 
      stack: ["FastAPI", "PySide6", "CTGAN", "Ollama", "Pandas"], 
      stat: "CTGAN local synthesis", 
      appCode: "https://github.com/KartikeyaM2007/CRUX-AppVersion",
      webCode: "https://github.com/KartikeyaM2007/CRUX-WebVersion",
      live: "https://crux-web-version.vercel.app/",
      app: "https://github.com/KartikeyaM2007/CRUX-AppVersion/releases/tag/v1.0.0",
      workflow: "Local CSV Input → CTGAN Generation → LLM-Assisted Cleaning (Local LLaMA) → Fidelity Checks → Export Clean Data",
      desc: "Local-first CSV cleaning, repair, and synthetic data generation tool with separate desktop and web versions utilizing local Ollama/Llama 3." 
    },
    { 
      title: "LeLo_InterView – AI Interviewer", 
      stack: ["Next.js", "TypeScript", "Firebase", "Vapi AI"], 
      stat: "ATS scoring & Vapi voice", 
      github: "https://github.com/KartikeyaM2007/ViewIN_ai_2",
      live: "https://view-in-ai-2.vercel.app/",
      desc: "Full-stack AI interview platform with resume-based interview generation, ATS scoring, candidate dashboards, and dynamic voice agents." 
    },
    { 
      title: "HiringSpree AI – Resume Screener", 
      stack: ["LangGraph", "Gemini", "FAISS", "BM25"], 
      stat: "5D Candidate Evaluation", 
      github: "https://github.com/KartikeyaM2007/HiringSpree",
      live: "https://hiringspree.onrender.com",
      image: "https://raw.githubusercontent.com/Kartikeya26/hiring-spree/main/assets/1_dashboard.png",
      workflow: "Analyze Input → Parse Resumes → Hybrid Search → 5D Rubric Score → Human-in-Loop Review → Generate Report",
      desc: "Agentic AI recruitment system using LangGraph workflows, FAISS + BM25 hybrid retrieval, Reciprocal Rank Fusion, and PII masking." 
    },
  ];


  return (
    <section id="projects" className="w-full bg-black py-32 px-6 relative z-20">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 80 }}
          className="mb-16 flex items-center gap-6"
        >
          <h3 className="text-4xl md:text-5xl font-bold tracking-tighter text-white shrink-0">
            Selected Work
          </h3>
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: 0.3, duration: 0.8, ease: "easeOut" }}
            style={{ originX: 0 }}
            className="flex-1 h-[1px] bg-gradient-to-r from-white/20 to-transparent mt-2"
          />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.1, duration: 0.6, type: "spring", stiffness: 80, damping: 20 }}
            >
              <InteractiveProjectCard 
                {...project} 
                onViewDetails={() => handleOpenDetails(project.title)} 
              />
            </motion.div>
          ))}
        </div>
      </div>

      <ProjectModal 
        isOpen={!!selectedProject} 
        onClose={() => setSelectedProject(null)} 
        title={selectedProject?.title || ""} 
        markdownContent={selectedProject?.markdownContent || ""} 
      />
    </section>
  );
}
