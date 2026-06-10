import React, { useState } from "react";
import { Copy, Check, FileText, Globe, Github } from "lucide-react";

interface DocumentationTabProps {
  studentName: string;
  githubUrl: string;
  docsUrl: string;
  onUpdateProfile: (field: string, value: string) => void;
}

export default function DocumentationTab({
  studentName,
  githubUrl,
  docsUrl,
  onUpdateProfile,
}: DocumentationTabProps) {
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedDocs, setCopiedDocs] = useState(false);

  const getMarkdownContent = () => {
    return `# Console-Based Library Management System

## Project Description
A comprehensive Java console-based software suite built to manage library resource inventories, keep registries of active library members, and track complex borrow and return transaction workflows with secure text-file data storage. Implemented strictly in compliance with foundational Object-Oriented Programming (OOP) concepts, rigorous data structures, and persistent streams.

## Features
- **Strict OOP Modeling**: Structured encapsulation model holding private properties, strict accessors, and custom parameterized constructor.
- **Dynamic Collection Management**: Built using dynamic \`ArrayList\` lists to handle active borrowings, catalog expansions, and registry edits on-the-fly.
- **Robust IO Persistence**: Custom file reader and writer modules parsing colon-delimited text data in \`books.txt\` and \`members.txt\` files.
- **Due Date and Fine System**: Processes borrower accounts using standard 14-day cycle equations and calculates overdue penalties dynamically at $0.50/day.
- **Safe Input Scanner Loop**: Clean driver console checking user prompt ranges, parsing numerical IDs securely, and handling inputs safely.

---

## Setup and Installation

### Prerequisites
- Java Development Kit (JDK) 8 or higher
- Git (optional)

### Compile and Run
Follow these steps to compile and execute the application directly from your system terminal:

\`\`\`bash
# 1. Clone or download the directory structure
# Ensure your directory contains:
# week3-library-system/src/main/java/library/Main.java etc.

# 2. Compile the source code files compiling directly to a "bin" folder
javac -d bin src/main/java/library/*.java

# 3. Launch the library driver console using class path bindings
java -cp bin library.Main
\`/
\`\`\`

## Code Folder Structure
\`\`\`text
week3-library-system/
├── src/
│   └── main/
│       └── java/
│           └── library/
│               ├── Book.java
│               ├── Member.java
│               ├── LibraryManager.java
│               └── Main.java
├── books.txt        # Virtual file database storing books
├── members.txt      # Virtual file database storing members
└── README.md        # Project documentation
\`\`\`

---

## Technical Specifications & Requirements Checklist

| Requirement | Implementation Detail & Encapsulation Reference | Status |
| :--- | :--- | :---: |
| **Proper Encapsulation** | All models (\`Book\` & \`Member\`) define state using private properties. Public accessors (\`getters\`) and mutators (\`setters\`) execute secure internal edits. | **Fully Met** |
| **ArrayList Storage** | Dynamic \`ArrayList<Book>\` and \`ArrayList<Member>\` structures execute catalog traversals, indexing, searching, and reference bindings safely. | **Fully Met** |
| **Custom File I/O** | Leverages \`BufferedReader\`, \`FileReader\`, \`BufferedWriter\`, and \`FileWriter\` packages to load/save state on boot/session-exit. | **Fully Met** |
| **Overdue Fine Engine** | Integrates Temporal packages (\`java.time.LocalDate\`, \`ChronoUnit.DAYS\`) calculating overdue late fines at $0.50/day past due. | **Fully Met** |
| **Driver Console loop** | Infinite running option menus using integer code routing with full sanitizers catching \`NumberFormatException\`. | **Fully Met** |

---

## Submissions Info
- **Student Full Name**: ${studentName || "[Add Name in Profile]"}
- **GitHub Repository**: ${githubUrl || "[Add GitHub URL in Profile]"}
- **Google Documentation Room**: ${docsUrl || "[Add Docs URL in Profile]"}
- **Project Grade Scope**: Week 3 Programming Basics Homework

---
*Created dynamically using Console Library System Builder & Simulator*
`;
  };

  const copyToClipboardMarkdown = () => {
    navigator.clipboard.writeText(getMarkdownContent());
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const copyToClipboardRichText = () => {
    // Generate simple readable HTML of the documentation
    const textHtml = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: auto;">
        <h1 style="color: #0f766e; border-bottom: 2px solid #0f766e; padding-bottom: 8px;">Console-Based Library Management System</h1>
        <p><strong>Prepared by:</strong> ${studentName || "Student Name"}</p>
        <p><strong>GitHub Link:</strong> <a href="${githubUrl || '#'}" style="color: #0f766e;">${githubUrl || "Not Provided"}</a></p>
        <p><strong>Documentation Link:</strong> <a href="${docsUrl || '#'}" style="color: #0f766e;">${docsUrl || "Not Provided"}</a></p>
        
        <h2 style="color: #0f766e; margin-top: 24px;">1. Project Overview & Objectives</h2>
        <p>A Java console application designed for complete library operations, featuring book inventory tracking, registered member management, borrow/return transaction records, active fine equations, and file-based data persistence across sessions.</p>
        
        <h2 style="color: #0f766e; margin-top: 24px;">2. Features</h2>
        <ul>
          <li><strong>Encapsulated Models:</strong> Secure getters, setters, and constructors tracking state safely.</li>
          <li><strong>ArrayList Collections:</strong> Dynamic indexing and reference storage.</li>
          <li><strong>Buffered IO Persistence:</strong> Automatic saving/restoration inside books.txt and members.txt.</li>
          <li><strong>Overdue Fines:</strong> ChronoUnit calculations tracking overdue return dates at $0.50/day.</li>
        </ul>
        
        <h2 style="color: #0f766e; margin-top: 24px;">3. Folder Structure Requirements</h2>
        <pre style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-family: monospace;">
week3-library-system/
├── src/
│   └── main/
│       └── java/
│           └── library/
│               ├── Book.java
│               ├── Member.java
│               ├── LibraryManager.java
│               └── Main.java
        </pre>

        <h2 style="color: #0f766e; margin-top: 24px;">4. Compiling Instructions</h2>
        <pre style="background: #f1f5f9; padding: 12px; border-radius: 6px; font-family: monospace;">
javac -d bin src/main/java/library/*.java
java -cp bin library.Main
        </pre>
      </div>
    `;

    const blob = new Blob([textHtml], { type: "text/html" });
    const data = [new ClipboardItem({ "text/html": blob })];
    navigator.clipboard.write(data);
    setCopiedDocs(true);
    setTimeout(() => setCopiedDocs(false), 2000);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col md:flex-row h-[545px]">
      {/* Left panel: student configurations */}
      <div className="w-full md:w-80 border-b md:border-b-0 md:border-r border-slate-100 p-5 bg-slate-50/50 space-y-5">
        <div>
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-1.5 mb-1">
            <Globe size={15} className="text-indigo-600" />
            Submission Properties
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Personalize these inputs. Your credentials will compile instantly into the README output and documentation templates on the right panel!
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Full Student Name
            </label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => onUpdateProfile("studentName", e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-shadow shadow-sm"
              placeholder="e.g. Alice Cooper"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              GitHub Repository URL
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400">
                <Github size={14} />
              </span>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => onUpdateProfile("githubUrl", e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-shadow shadow-sm"
                placeholder="https://github.com/username/week3"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wide mb-1.5">
              Google Docs URL
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-indigo-600 font-bold text-xs">
                Doc
              </span>
              <input
                type="url"
                value={docsUrl}
                onChange={(e) => onUpdateProfile("docsUrl", e.target.value)}
                className="w-full pl-11 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-805 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-shadow shadow-sm"
                placeholder="https://docs.google.com/document/d/..."
              />
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-200">
          <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-3 leading-relaxed text-indigo-850 space-y-2">
            <h4 className="text-xs font-bold flex items-center gap-1 text-indigo-900">
              🎉 Submission Checklist
            </h4>
            <ul className="text-[11px] space-y-1 list-disc pl-4 text-indigo-900 leading-normal">
              <li>Java Code passes standards</li>
              <li>Encapsulated getters/setters verified</li>
              <li>Text database files initialized</li>
              <li>Compile binaries checklist complete</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Right panel: compiled final document */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="px-5 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/20">
          <span className="text-xs font-bold tracking-wider uppercase text-slate-400">
            Submission Document Pre-Compiler
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={copyToClipboardMarkdown}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 font-bold hover:bg-indigo-700 text-white text-xs transition shadow-md shadow-indigo-100"
            >
              {copiedMd ? <Check size={12} /> : <Copy size={12} />}
              {copiedMd ? "Copied!" : "Copy Markdown README"}
            </button>
            <button
              onClick={copyToClipboardRichText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 border border-slate-200 hover:bg-slate-250 text-slate-700 text-xs font-medium transition"
            >
              {copiedDocs ? <Check size={12} /> : <FileText size={12} />}
              {copiedDocs ? "Copied!" : "Copy Rich Text (for GDocs)"}
            </button>
          </div>
        </div>

        {/* Formatted Markdown viewer */}
        <div className="flex-1 p-6 overflow-y-auto prose prose-slate prose-xs max-w-none prose-headings:text-slate-800 prose-headings:font-bold prose-h1:text-xl prose-h2:text-sm prose-h3:text-xs prose-p:text-xs prose-thead:bg-slate-50 prose-td:text-xs">
          <h1 className="text-slate-800 text-lg border-b pb-1 font-bold">Console-Based Library Management System</h1>
          <p className="text-slate-500 italic text-xs">Dynamic homework compile document prepared for grading guidelines.</p>

          <div className="border border-indigo-100 bg-indigo-50/30 rounded-lg p-3 my-4 space-y-1 text-slate-700">
            <div className="text-xs font-bold text-indigo-900">Dynamic Links Active:</div>
            <div className="text-[11px] grid grid-cols-1 sm:grid-cols-2 gap-x-4">
              <div><strong>Author:</strong> {studentName || "Siddhi Padwal"}</div>
              <div><strong>Repo:</strong> <span className="text-indigo-600 font-mono text-[10px] break-all">{githubUrl || "Pending..."}</span></div>
              <div className="sm:col-span-2"><strong>Docs Shared Room:</strong> <span className="text-indigo-600 font-mono text-[10px] break-all">{docsUrl || "Pending..."}</span></div>
            </div>
          </div>

          <h2 className="text-slate-800 font-bold text-sm mt-4">1. Project Description</h2>
          <p>This Java application encapsulates state variables inside of robust records representation while storing catalog entries into plain files database on system disk. It operates standard array queries and calculations.</p>

          <h2 className="text-slate-800 font-bold text-sm mt-4">2. Setup and Execution Procedures</h2>
          <pre className="bg-slate-50 border border-slate-200 p-3 rounded font-mono text-xs text-slate-700 whitespace-pre scroll-x">
{`# Compilation command compiling directly into target class binaries folder
javac -d bin src/main/java/library/*.java

# Run command
java -cp bin library.Main`}
          </pre>

          <h2 className="text-slate-800 font-bold text-sm mt-4">3. Class Definitions & Design Concepts Included</h2>
          <ul className="list-disc pl-5 text-slate-600 space-y-1 text-xs">
            <li><strong>Encapsulation Models:</strong> Complete privacy scopes on all identifiers and parameters. Getters & setters shield manipulation logic.</li>
            <li><strong>File Serialization Pipelines:</strong> Formats structural data tables instantly using buffered streams loading data on program boot.</li>
            <li><strong>ArrayList Operations:</strong> Dynamically loads library references matching index arrays.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
