import React, { useState } from "react";
import { Book, Member, LibraryState } from "./types";
import { javaCodeFiles } from "./javaCodeTemplates";
import { downloadProjectZip } from "./utils/zipGenerator";
import TerminalSimulator from "./components/TerminalSimulator";
import StateVisualizer from "./components/StateVisualizer";
import DocumentationTab from "./components/DocumentationTab";
import AiCoachTab from "./components/AiCoachTab";
import {
  Terminal,
  Code2,
  FileSpreadsheet,
  GraduationCap,
  Download,
  Copy,
  Check,
  Github,
  Award,
} from "lucide-react";

const INITIAL_BOOKS: Book[] = [
  { id: 101, title: "Effective Java", author: "Joshua Bloch", isbn: "9780134685991", isAvailable: true, borrowerId: -1, dueDate: null },
  { id: 102, title: "Clean Code", author: "Robert C. Martin", isbn: "9780132350884", isAvailable: false, borrowerId: 1002, dueDate: "2026-06-24" },
  { id: 103, title: "Head First Java", author: "Kathy Sierra", isbn: "9780596009205", isAvailable: true, borrowerId: -1, dueDate: null },
];

const INITIAL_MEMBERS: Member[] = [
  { id: 1001, name: "Alice Johnson", borrowedBookIds: [] },
  { id: 1002, name: "Bob Smith", borrowedBookIds: [102] },
];

const INITIAL_STATE: LibraryState = {
  books: INITIAL_BOOKS,
  members: INITIAL_MEMBERS,
  borrowings: [
    { bookId: 102, memberId: 1002, borrowDate: "2026-06-10", dueDate: "2026-06-24" }
  ],
  collectedFines: 0.0,
};

export default function App() {
  const [activeTab, setActiveTab] = useState<"simulator" | "code" | "docs" | "coach">("simulator");
  const [studentProfile, setStudentProfile] = useState({
    studentName: "Siddhi Padwal",
    githubUrl: "https://github.com/siddhipadwal2005/week3-library-system",
    docsUrl: "https://docs.google.com/document/d/1X_Z_week3_library_grade",
  });

  const [selectedFileIdx, setSelectedFileIdx] = useState(0);
  const [copiedFile, setCopiedFile] = useState(false);
  
  // Visual Library Database States
  const [libState, setLibState] = useState<LibraryState>(INITIAL_STATE);

  const handleUpdateProfile = (field: string, value: string) => {
    setStudentProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdateState = (newState: LibraryState) => {
    setLibState(newState);
  };

  const handleResetState = () => {
    setLibState(INITIAL_STATE);
  };

  const copySelectedFileCode = () => {
    navigator.clipboard.writeText(javaCodeFiles[selectedFileIdx].content);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  const handleDownloadZip = () => {
    const filesToCompress = javaCodeFiles.map((f) => ({
      path: f.path,
      content: f.content,
    }));
    downloadProjectZip(filesToCompress);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col antialiased">
      {/* Dynamic Student Header status strip */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-4 text-xs font-mono flex flex-wrap justify-between items-center gap-2 border-b border-slate-950">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Assignment Workspace Active :: Task 3 Grade-Scope</span>
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span>Student: <strong className="text-white">{studentProfile.studentName || "Siddhi Padwal"}</strong></span>
          <span className="hidden md:inline">|</span>
          <a
            href={studentProfile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-300 hover:text-white flex items-center gap-1 transition-colors"
          >
            <Github size={12} />
            GitHub Codebase
          </a>
        </div>
      </div>

      {/* Main Core Navigation Bar */}
      <header className="sticky top-0 z-50 bg-indigo-900 text-white border-b border-indigo-950 shadow-md px-5 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-700 p-2 rounded-lg text-white shadow-inner hidden sm:block">
            <Award size={20} className="text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2 py-0.5 rounded bg-amber-400 text-amber-950 font-black text-[10px] tracking-wider uppercase">
                JP-2023-W3
              </span>
              <h1 className="text-base font-bold text-white tracking-tight leading-none">
                Console Library System Builder & Simulator
              </h1>
            </div>
            <p className="text-xs text-indigo-200 mt-1">
              Week 3 Submission Checklist & Interactive JVM Simulator • Java Programming Basics HW
            </p>
          </div>
        </div>

        {/* Workspace tabs navigator */}
        <nav className="flex items-center border border-indigo-950 bg-indigo-950/50 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("simulator")}
            style={{ contentVisibility: "auto" }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "simulator"
                ? "bg-white text-indigo-900 shadow-md"
                : "text-indigo-200 hover:text-white"
            }`}
          >
            <Terminal size={14} />
            Interactive Simulator
          </button>
          <button
            onClick={() => setActiveTab("code")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "code"
                ? "bg-white text-indigo-900 shadow-md"
                : "text-indigo-200 hover:text-white"
            }`}
          >
            <Code2 size={14} />
            Java Code Explorer
          </button>
          <button
            onClick={() => setActiveTab("docs")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "docs"
                ? "bg-white text-indigo-900 shadow-md"
                : "text-indigo-200 hover:text-white"
            }`}
          >
            <FileSpreadsheet size={14} />
            Submission Docs Hub
          </button>
          <button
            onClick={() => setActiveTab("coach")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeTab === "coach"
                ? "bg-white text-indigo-900 shadow-md"
                : "text-indigo-200 hover:text-white"
            }`}
          >
            <GraduationCap size={14} />
            AI Study Coach
          </button>
        </nav>
      </header>

      {/* Main Workspace Frame */}
      <main className="flex-1 p-5 max-w-7xl w-full mx-auto space-y-6">
        {activeTab === "simulator" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <Terminal size={15} className="text-indigo-600" />
                  JVM CLI Driver Sandbox (Scanner Menu)
                </h2>
                <span className="text-[11px] text-slate-500 italic">Simulated in TypeScript 1:1 with Main.java</span>
              </div>
              <TerminalSimulator
                state={libState}
                onUpdateState={handleUpdateState}
                onResetState={handleResetState}
              />
            </div>

            <div className="flex flex-col space-y-2">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                  <FileSpreadsheet size={15} className="text-indigo-600" />
                  Live Databases & Storage Log Files
                </h2>
                <span className="text-[11px] text-slate-500 italic">Dynamic simulation tracking</span>
              </div>
              <StateVisualizer state={libState} />
            </div>
          </div>
        )}

        {activeTab === "code" && (
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col lg:flex-row h-[540px]">
            {/* Source Tree navigation */}
            <div className="w-full lg:w-72 border-b lg:border-b-0 lg:border-r border-slate-150 p-4 bg-slate-50/50 flex flex-col shrink-0">
              <div className="mb-4">
                <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Package library;</span>
                <h3 className="text-xs font-bold text-indigo-900 uppercase mt-0.5"> week3-library-system</h3>
              </div>

              {/* List of files */}
              <div className="flex-1 space-y-1 overflow-y-auto">
                {javaCodeFiles.map((file, idx) => (
                  <button
                    key={file.name}
                    onClick={() => setSelectedFileIdx(idx)}
                    className={`w-full text-left p-2 rounded-lg flex flex-col transition-all text-xs font-mono border ${
                      selectedFileIdx === idx
                        ? "bg-indigo-50 border-indigo-200 text-indigo-900 font-bold shadow-sm"
                        : "bg-transparent border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    <span>{file.name}</span>
                    <span className="text-[10px] font-sans text-slate-400 font-normal truncate max-w-full">
                      {file.path.split("/").slice(-2).join("/")}
                    </span>
                  </button>
                ))}
              </div>

              {/* Exporters and compilers footer */}
              <div className="pt-4 mt-4 border-t border-slate-200">
                <button
                  onClick={handleDownloadZip}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 font-bold text-white text-xs rounded-lg transition-all shadow-md shadow-indigo-100"
                >
                  <Download size={13} />
                  Download week3-library-system ZIP
                </button>
                <div className="text-[10px] text-slate-400 text-center mt-2 leading-tight">
                  Packages exact required structure with full OOP compliant class codes.
                </div>
              </div>
            </div>

            {/* Code presentation console */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-950 font-mono text-xs text-slate-300">
              {/* Header inside presenter */}
              <div className="px-5 py-2.5 bg-slate-900 border-b border-slate-950 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 font-bold">{javaCodeFiles[selectedFileIdx].path}</span>
                  <p className="text-[10px] text-indigo-400 italic max-w-xl truncate mt-0.5">
                    {javaCodeFiles[selectedFileIdx].description}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copySelectedFileCode}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-bold transition"
                  >
                    {copiedFile ? <Check size={11} /> : <Copy size={11} />}
                    {copiedFile ? "Copied!" : "Copy Code"}
                  </button>
                </div>
              </div>

              {/* Pre form text view */}
              <pre className="flex-1 p-5 overflow-auto select-all cursor-text text-[11.5px] leading-relaxed pre-wrap whitespace-pre text-slate-300 select-text">
                <code>{javaCodeFiles[selectedFileIdx].content}</code>
              </pre>
            </div>
          </div>
        )}

        {activeTab === "docs" && (
          <DocumentationTab
            studentName={studentProfile.studentName}
            githubUrl={studentProfile.githubUrl}
            docsUrl={studentProfile.docsUrl}
            onUpdateProfile={handleUpdateProfile}
          />
        )}

        {activeTab === "coach" && <AiCoachTab />}
      </main>

      {/* Persistent App footer branding */}
      <footer className="bg-white border-t border-slate-200 py-4 px-5 text-center mt-auto">
        <p className="text-[11px] text-slate-400">
          Java Basics Companion Applet & Virtual Compiler Simulator. Handcrafted for comprehensive study guidelines and submission preparations.
        </p>
      </footer>
    </div>
  );
}
