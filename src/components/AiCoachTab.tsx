import React, { useState } from "react";
import { Send, GraduationCap, Sparkles, MessageSquare } from "lucide-react";
import { javaCodeFiles } from "../javaCodeTemplates";

export default function AiCoachTab() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "coach"; text: string }>>([
    {
      role: "coach",
      text: "Hello! I am your Java Programming Coach. 🎓 I've analyzed your Console-Based Library Management System. I can explain any part of the Java syntax, help you understand how files write to disk, show you how ArrayLists index, or prepare you for an academic code defense. What would you like to discuss?",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);

  const predefinedQuestions = [
    { text: "Explain Encapsulation inside Book.java", query: "Can you explain how Encapsulation is used in Book.java, and why private properties with public getters/setters are important?" },
    { text: "How does File I/O save books to disk?", query: "How does File I/O operate in LibraryManager.java? Explain BufferedWriter and semi-colon serialization." },
    { text: "Explain fine calculation in returnBook", query: "Explain how calculateOverdueFine parses state dates and processes late returns at $0.50 per day." },
    { text: "What are the OOP principles demonstrated?", query: "Can you summarize the major OOP Principles demonstrated in this library management system architecture?" },
  ];

  const handleSendMessage = async (queryText: string) => {
    if (!queryText.trim() || loading) return;

    const userMessage = { role: "user" as const, text: queryText };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: queryText,
          currentCodeContext: javaCodeFiles.map((f) => ({ name: f.name, content: f.content })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response from server.");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "coach", text: data.text }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: "coach", text: `⚠️ Coach connection error: ${err.message || "Please make sure your GEMINI_API_KEY is configured in Secrets panel."}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm flex flex-col h-[540px]">
      {/* Title bar */}
      <div className="px-4 py-3 bg-slate-50 border-b border-slate-150 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-indigo-600" size={18} />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Java Coding Coach & Grading TA
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 flex items-center gap-1">
          <Sparkles size={10} className="text-indigo-600 animate-pulse" />
          Powered by Gemini
        </span>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Left pane: chat conversation */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-50/30">
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.map((m, index) => (
              <div
                key={index}
                className={`flex gap-3 max-w-[85%] ${
                  m.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                <div
                  className={`p-1.5 rounded-full h-8 w-8 flex items-center justify-center border shrink-0 ${
                    m.role === "user"
                      ? "bg-slate-100 text-slate-700 border-slate-300"
                      : "bg-indigo-50 text-indigo-700 border-indigo-200"
                  }`}
                >
                  {m.role === "user" ? "👤" : "🎓"}
                </div>
                <div
                  className={`p-3 rounded-xl border text-xs leading-relaxed space-y-2 prose prose-xs ${
                    m.role === "user"
                      ? "bg-indigo-600 border-indigo-700 text-white rounded-tr-none prose-headings:text-white prose-p:text-white"
                      : "bg-white border-slate-200 text-slate-800 rounded-tl-none prose-headings:text-slate-800"
                  }`}
                >
                  {m.text.split("\n\n").map((para, i) => {
                    // Primitive bold parsing for simplicity
                    let processed = para;
                    const matches = para.match(/\*\*(.*?)\*\*/g);
                    if (matches) {
                      matches.forEach((m) => {
                        const word = m.replace(/\*\*/g, "");
                        processed = processed.replace(m, `<strong>${word}</strong>`);
                      });
                    }
                    return (
                      <p key={i} dangerouslySetInnerHTML={{ __html: processed.replace(/\n/g, "<br/>") }} />
                    );
                  })}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 mr-auto items-center">
                <div className="p-1.5 rounded-full h-8 w-8 flex items-center justify-center border bg-indigo-50 text-indigo-700 border-indigo-200 animate-pulse">
                  🎓
                </div>
                <div className="p-3 bg-white border border-slate-200 rounded-xl rounded-tl-none text-xs text-slate-400 italic">
                  Coach is analyzing code logic...
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputValue);
            }}
            className="p-3 bg-white border-t border-slate-150 flex gap-2"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask about Encapsulation, File I/O buffers, or ArrayList code segments..."
              className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs leading-none text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-shadow placeholder-slate-400"
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-40 transition-shadow shadow-md flex items-center justify-center w-9 h-9"
            >
              <Send size={14} />
            </button>
          </form>
        </div>

        {/* Right sidebar: recommended questions */}
        <div className="hidden lg:block w-72 border-l border-slate-150 p-4 space-y-4 bg-white shrink-0">
          <div>
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1">
              <MessageSquare size={13} className="text-indigo-600" />
              Interactive Study Guide
            </h4>
            <p className="text-[11px] text-slate-500 leading-normal">
              Click any recommended topic below to query the Java Coach regarding coding implementations!
            </p>
          </div>

          <div className="space-y-2">
            {predefinedQuestions.map((q, index) => (
              <button
                key={index}
                onClick={() => handleSendMessage(q.query)}
                className="w-full text-left p-2.5 rounded-xl border border-slate-150 hover:border-indigo-300 hover:bg-indigo-50/20 text-slate-700 hover:text-indigo-900 transition-all text-xs font-medium space-y-1 block"
              >
                <span>{q.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
