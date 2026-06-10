import React, { useState } from "react";
import { LibraryState, Book, Member } from "../types";
import { Database, FileText, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";

interface StateVisualizerProps {
  state: LibraryState;
}

export default function StateVisualizer({ state }: StateVisualizerProps) {
  const [activeSubTab, setActiveSubTab] = useState<"tables" | "files">("tables");

  // Formatter matching the Java logic:
  const getBooksFileContent = () => {
    return state.books.map((b) => `${b.id};${b.title};${b.author};${b.isbn};${b.isAvailable};${b.borrowerId};${b.dueDate || "N/A"}`).join("\n");
  };

  const getMembersFileContent = () => {
    return state.members
      .map((m) => {
        const booksStr = m.borrowedBookIds.length > 0 ? m.borrowedBookIds.join(",") : "NONE";
        return `${m.id};${m.name};${booksStr}`;
      })
      .join("\n");
  };

  return (
    <div className="flex flex-col bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-[540px]">
      {/* Sub tabs header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-slate-50/50">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveSubTab("tables")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeSubTab === "tables"
                ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Database size={13} />
            JVM Live Memory States
          </button>
          <button
            onClick={() => setActiveSubTab("files")}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
              activeSubTab === "files"
                ? "bg-white text-indigo-700 shadow-xs border border-slate-200"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText size={13} />
            Disk Storage Files (books.txt / members.txt)
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 text-indigo-800">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse"></span>
            Persistent Sync Active
          </span>
        </div>
      </div>

      {/* Main interactive segment */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeSubTab === "tables" ? (
          <div className="space-y-6">
            {/* Books Segment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Database size={12} className="text-indigo-600" />
                  Books Collection (ArrayList&lt;Book&gt;)
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">Count: {state.books.length}</span>
              </div>
              <div className="border border-slate-100 rounded-md overflow-hidden bg-slate-50/20">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-medium">
                      <th className="p-2 w-12 text-center">ID</th>
                      <th className="p-2">Title / Author</th>
                      <th className="p-2 w-28">ISBN</th>
                      <th className="p-2 w-24">Status</th>
                      <th className="p-2 w-24">Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.books.map((b) => (
                      <tr key={b.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 bg-white transition-colors">
                        <td className="p-2 text-center font-mono text-slate-400 font-medium">{b.id}</td>
                        <td className="p-2">
                          <div className="font-semibold text-slate-800">{b.title}</div>
                          <div className="text-slate-400 text-[10px]">{b.author}</div>
                        </td>
                        <td className="p-2 font-mono text-slate-500 text-[11px]">{b.isbn}</td>
                        <td className="p-2">
                          {b.isAvailable ? (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-green-50 text-green-700 border border-green-100">
                              <CheckCircle size={10} />
                              Available
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
                              <AlertTriangle size={10} />
                              Borrowed ({b.borrowerId})
                            </span>
                          )}
                        </td>
                        <td className="p-2 font-mono text-[11px] text-slate-600">{b.dueDate || "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Members Segment */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Database size={12} className="text-indigo-600" />
                  Members Collection (ArrayList&lt;Member&gt;)
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">Count: {state.members.length}</span>
              </div>
              <div className="border border-slate-100 rounded-md overflow-hidden bg-slate-50/20">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50 text-slate-500 font-medium">
                      <th className="p-2 w-16 text-center">ID</th>
                      <th className="p-2">Full Name</th>
                      <th className="p-2">Active Borrowed Book IDs</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.members.map((m) => (
                      <tr key={m.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50 bg-white transition-colors">
                        <td className="p-2 text-center font-mono text-slate-400 font-medium">{m.id}</td>
                        <td className="p-2 font-semibold text-slate-800">{m.name}</td>
                        <td className="p-2 font-mono text-[11px] text-indigo-600">
                          {m.borrowedBookIds.length > 0 ? (
                            <div className="flex gap-1.5 flex-wrap">
                              {m.borrowedBookIds.map((bid) => (
                                <span key={bid} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-800 border border-slate-200">
                                  ID: {bid}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="text-slate-300 italic text-[11px]">No active checkouts</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-slate-500 text-xs leading-relaxed bg-indigo-50/50 text-indigo-800 p-3 rounded-lg border border-indigo-100/50">
              💡 **Simulation Engine**: In Java, calling `saveData()` serializes in-memory ArrayList elements into clear, semi-colon delimited text files. Opening the simulator automatically performs a simulated BufferedReader file parsing step. Take a look at how the file registers change:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* books.txt visual */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <FileText size={13} className="text-slate-400" />
                  <span className="text-xs font-mono font-bold text-slate-600">books.txt</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-md p-3 font-mono text-xs text-slate-700 h-[280px] overflow-auto select-all cursor-text pre-wrap leading-relaxed whitespace-pre gap-0">
                  {getBooksFileContent() || <span className="text-slate-300 italic">&lt;File empty&gt;</span>}
                </div>
              </div>

              {/* members.txt visual */}
              <div>
                <div className="flex items-center gap-1.5 mb-1.5">
                  <FileText size={13} className="text-slate-400" />
                  <span className="text-xs font-mono font-bold text-slate-600">members.txt</span>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-md p-3 font-mono text-xs text-slate-700 h-[280px] overflow-auto select-all cursor-text pre-wrap leading-relaxed whitespace-pre gap-0">
                  {getMembersFileContent() || <span className="text-slate-300 italic">&lt;File empty&gt;</span>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
