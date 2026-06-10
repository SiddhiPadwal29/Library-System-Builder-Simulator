import React, { useState, useRef, useEffect } from "react";
import { Book, Member, LibraryState } from "../types";
import { Play, RotateCcw, HelpCircle, Terminal } from "lucide-react";

interface TerminalSimulatorProps {
  state: LibraryState;
  onUpdateState: (newState: LibraryState) => void;
  onResetState: () => void;
}

type MenuState =
  | "MENU"
  | "ADD_BOOK_TITLE"
  | "ADD_BOOK_AUTHOR"
  | "ADD_BOOK_ISBN"
  | "SEARCH_BOOK"
  | "REGISTER_NAME"
  | "BORROW_MID"
  | "BORROW_BID"
  | "RETURN_BID"
  | "RETURN_DATE";

interface LogLine {
  text: string;
  type: "input" | "output" | "error" | "success" | "banner";
}

export default function TerminalSimulator({
  state,
  onUpdateState,
  onResetState,
}: TerminalSimulatorProps) {
  const [terminalLogs, setTerminalLogs] = useState<LogLine[]>([
    { text: "=================================================", type: "banner" },
    { text: "  WELCOME TO CONSOLE LIBRARY MANAGEMENT SYSTEM   ", type: "banner" },
    { text: "        Week 3: Java Programming Basics          ", type: "banner" },
    { text: "=================================================", type: "banner" },
    { text: "Data loaded successfully from books.txt and members.txt.", type: "success" },
    { text: "", type: "output" },
    { text: "=== LIBRARY MANAGEMENT SYSTEM ===", type: "output" },
    { text: "1. Add New Book", type: "output" },
    { text: "2. View All Books", type: "output" },
    { text: "3. Search Books", type: "output" },
    { text: "4. Register Member", type: "output" },
    { text: "5. Borrow Book", type: "output" },
    { text: "6. Return Book", type: "output" },
    { text: "7. View Library Statistics", type: "output" },
    { text: "8. Exit", type: "output" },
  ]);

  const [currentInput, setCurrentInput] = useState("");
  const [commandState, setCommandState] = useState<MenuState>("MENU");

  // Temporary buffers for multi-step prompts
  const [tempBookTitle, setTempBookTitle] = useState("");
  const [tempBookAuthor, setTempBookAuthor] = useState("");
  const [tempBorrowMid, setTempBorrowMid] = useState<number | null>(null);
  const [tempReturnBid, setTempReturnBid] = useState<number | null>(null);

  const consoleEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    consoleEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [terminalLogs]);

  const addLog = (text: string, type: LogLine["type"] = "output") => {
    setTerminalLogs((prev) => [...prev, { text, type }]);
  };

  const printMenu = () => {
    addLog("\n=== LIBRARY MANAGEMENT SYSTEM ===\n");
    addLog("1. Add New Book");
    addLog("2. View All Books");
    addLog("3. Search Books");
    addLog("4. Register Member");
    addLog("5. Borrow Book");
    addLog("6. Return Book");
    addLog("7. View Library Statistics");
    addLog("8. Exit");
  };

  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const input = currentInput.trim();
    setCurrentInput("");

    if (input === "" && commandState === "MENU") return;

    // Log the user's input
    addLog(`$ ${input === "" ? "[Enter]" : input}`, "input");

    switch (commandState) {
      case "MENU":
        handleMenuChoice(input);
        break;

      case "ADD_BOOK_TITLE":
        if (input === "") {
          addLog("Error: Book title cannot be empty!", "error");
          addLog("Enter Book Title: ");
          return;
        }
        setTempBookTitle(input);
        addLog("Enter Book Author: ");
        setCommandState("ADD_BOOK_AUTHOR");
        break;

      case "ADD_BOOK_AUTHOR":
        if (input === "") {
          addLog("Error: Author field cannot be empty!", "error");
          addLog("Enter Book Author: ");
          return;
        }
        setTempBookAuthor(input);
        addLog("Enter ISBN-13 Code: ");
        setCommandState("ADD_BOOK_ISBN");
        break;

      case "ADD_BOOK_ISBN":
        if (input === "") {
          addLog("Error: ISBN code cannot be empty!", "error");
          addLog("Enter ISBN-13 Code: ");
          return;
        }
        // Save book
        const finalTitle = tempBookTitle;
        const finalAuthor = tempBookAuthor;
        const finalIsbn = input;
        const nextBookId = state.books.length > 0 ? state.books[state.books.length - 1].id + 1 : 101;

        const updatedBooks = [
          ...state.books,
          {
            id: nextBookId,
            title: finalTitle,
            author: finalAuthor,
            isbn: finalIsbn,
            isAvailable: true,
            borrowerId: -1,
            dueDate: null,
          },
        ];

        onUpdateState({
          ...state,
          books: updatedBooks,
        });

        addLog(`Success: Book '${finalTitle}' added successfully with ID: ${nextBookId}`, "success");
        setCommandState("MENU");
        printMenu();
        break;

      case "SEARCH_BOOK":
        if (input === "") {
          addLog("Error: Search query cannot be blank.", "error");
          addLog("Enter Search Term (Title/Author/ISBN): ");
          return;
        }

        const queryResult = state.books.filter(
          (b) =>
            b.title.toLowerCase().includes(input.toLowerCase()) ||
            b.author.toLowerCase().includes(input.toLowerCase()) ||
            b.isbn.includes(input)
        );

        if (queryResult.length === 0) {
          addLog(`No records found matching term '${input}'.`, "output");
        } else {
          addLog(`\nID    | TITLE                     | AUTHOR               | ISBN          | STATUS`, "output");
          addLog(`---------------------------------------------------------------------------------`, "output");
          queryResult.forEach((b) => {
            const status = b.isAvailable ? "Available" : `Borrowed (Member: ${b.borrowerId})`;
            const paddedTitle = b.title.padEnd(25).substring(0, 25);
            const paddedAuthor = b.author.padEnd(20).substring(0, 20);
            addLog(`${b.id.toString().padEnd(5)} | ${paddedTitle} | ${paddedAuthor} | ${b.isbn.padEnd(13)} | ${status}`, "output");
          });
        }

        setCommandState("MENU");
        printMenu();
        break;

      case "REGISTER_NAME":
        if (input === "") {
          addLog("Error: Name cannot be blank.", "error");
          addLog("Enter Full Name: ");
          return;
        }

        const nextMemberId = state.members.length > 0 ? state.members[state.members.length - 1].id + 1 : 1001;
        const updatedMembers = [
          ...state.members,
          { id: nextMemberId, name: input, borrowedBookIds: [] },
        ];

        onUpdateState({
          ...state,
          members: updatedMembers,
        });

        addLog(`Success: Member '${input}' registered successfully with ID: ${nextMemberId}`, "success");
        setCommandState("MENU");
        printMenu();
        break;

      case "BORROW_MID":
        const mid = parseInt(input);
        if (isNaN(mid)) {
          addLog("Error: Member Registration ID must be numerical.", "error");
          setCommandState("MENU");
          printMenu();
          return;
        }

        const memberExists = state.members.find((m) => m.id === mid);
        if (!memberExists) {
          addLog(`Error: Member with ID ${mid} not found!`, "error");
          setCommandState("MENU");
          printMenu();
          return;
        }

        setTempBorrowMid(mid);
        addLog("Enter Book catalog ID (e.g., 101): ");
        setCommandState("BORROW_BID");
        break;

      case "BORROW_BID":
        const bid = parseInt(input);
        if (isNaN(bid)) {
          addLog("Error: Catalog ID must be numerical.", "error");
          setCommandState("MENU");
          printMenu();
          return;
        }

        const book = state.books.find((b) => b.id === bid);
        if (!book) {
          addLog(`Error: Book with ID ${bid} not found!`, "error");
          setCommandState("MENU");
          printMenu();
          return;
        }

        if (!book.isAvailable) {
          addLog(`Error: Book '${book.title}' is already borrowed! Currently due on ${book.dueDate}`, "error");
          setCommandState("MENU");
          printMenu();
          return;
        }

        const borrowerId = tempBorrowMid!;
        const borrower = state.members.find((m) => m.id === borrowerId)!;

        // Calculate a simulated 14 day due date
        const borrowDateStr = new Date().toISOString().split("T")[0];
        const d = new Date();
        d.setDate(d.getDate() + 14);
        const dueDateStr = d.toISOString().split("T")[0];

        // Update arrays
        const newBooks = state.books.map((b) =>
          b.id === bid ? { ...b, isAvailable: false, borrowerId, dueDate: dueDateStr } : b
        );
        const newMembers = state.members.map((m) =>
          m.id === borrowerId ? { ...m, borrowedBookIds: [...m.borrowedBookIds, bid] } : m
        );
        const newBorrowings = [
          ...state.borrowings,
          { bookId: bid, memberId: borrowerId, borrowDate: borrowDateStr, dueDate: dueDateStr },
        ];

        onUpdateState({
          ...state,
          books: newBooks,
          members: newMembers,
          borrowings: newBorrowings,
        });

        addLog(`Success: '${book.title}' borrowed by ${borrower.name}.`, "success");
        addLog(`-> Date Borrowed: ${borrowDateStr} | Return Due Date: ${dueDateStr}`, "success");

        setCommandState("MENU");
        setTempBorrowMid(null);
        printMenu();
        break;

      case "RETURN_BID":
        const returnBid = parseInt(input);
        if (isNaN(returnBid)) {
          addLog("Error: Catalog ID must be numerical.", "error");
          setCommandState("MENU");
          printMenu();
          return;
        }

        const retBook = state.books.find((b) => b.id === returnBid);
        if (!retBook) {
          addLog(`Error: Book with ID ${returnBid} not found!`, "error");
          setCommandState("MENU");
          printMenu();
          return;
        }

        if (retBook.isAvailable) {
          addLog(`Error: Book '${retBook.title}' is not marked as borrowed in our database!`, "error");
          setCommandState("MENU");
          printMenu();
          return;
        }

        setTempReturnBid(returnBid);
        addLog(`Enter Return Date (yyyy-MM-dd) [Leave empty to record as TODAY ${new Date().toISOString().split("T")[0]}]: `);
        setCommandState("RETURN_DATE");
        break;

      case "RETURN_DATE":
        let returnDateStr = input.trim();
        const bId = tempReturnBid!;
        const actualReturnBook = state.books.find((b) => b.id === bId)!;

        if (returnDateStr === "") {
          returnDateStr = new Date().toISOString().split("T")[0];
        }

        // Calculate potential late fine ($0.50 / day)
        let fine = 0;
        try {
          const due = new Date(actualReturnBook.dueDate!);
          const ret = new Date(returnDateStr);
          if (ret.getTime() > due.getTime()) {
            const diffTime = Math.abs(ret.getTime() - due.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            fine = diffDays * 0.5;
          }
        } catch (e) {
          addLog("Warning: Unrecognized date format. Defaulting return calculation with no fines.", "error");
        }

        // Update database arrays
        const bIdBorrowerId = actualReturnBook.borrowerId;
        const booksAfterReturn = state.books.map((b) =>
          b.id === bId ? { ...b, isAvailable: true, borrowerId: -1, dueDate: null } : b
        );
        const membersAfterReturn = state.members.map((m) =>
          m.id === bIdBorrowerId ? { ...m, borrowedBookIds: m.borrowedBookIds.filter((id) => id !== bId) } : m
        );

        // Edit transaction logs or update fine stats
        onUpdateState({
          ...state,
          books: booksAfterReturn,
          members: membersAfterReturn,
          collectedFines: state.collectedFines + fine,
          borrowings: state.borrowings.map((bor) =>
            bor.bookId === bId && !bor.returnDate
              ? { ...bor, returnDate: returnDateStr, fineIncurred: fine }
              : bor
          ),
        });

        if (fine > 0) {
          addLog(`Warning: Return is overdue! Late fine incurred: $${fine.toFixed(2)}`, "error");
        } else {
          addLog("Success: Return processed on schedule. No fine incurred.", "success");
        }
        addLog(`Success: '${actualReturnBook.title}' is returned to inventory.`, "success");

        setCommandState("MENU");
        setTempReturnBid(null);
        printMenu();
        break;
    }
  };

  const handleMenuChoice = (input: string) => {
    const choiceNum = parseInt(input);

    if (isNaN(choiceNum) || choiceNum < 1 || choiceNum > 8) {
      addLog("Error: Invalid choice format! Please enter an integer between 1 and 8.", "error");
      return;
    }

    switch (choiceNum) {
      case 1:
        addLog("\n--- [1] Add New Book ---");
        addLog("Enter Book Title: ");
        setCommandState("ADD_BOOK_TITLE");
        break;

      case 2:
        addLog("\n--- [2] View All Books ---");
        if (state.books.length === 0) {
          addLog("Catalog is empty. Register books using Menu Task [1].");
        } else {
          addLog(`ID    | TITLE                      | AUTHOR               | ISBN          | STATUS     | DUE DATE`, "output");
          addLog(`------------------------------------------------------------------------------------------------------`, "output");
          state.books.forEach((b) => {
            const status = b.isAvailable ? "Available" : "Borrowed";
            const due = b.dueDate || "N/A";
            const paddedTitle = b.title.padEnd(26).substring(0, 26);
            const paddedAuthor = b.author.padEnd(20).substring(0, 20);
            addLog(
              `${b.id.toString().padEnd(5)} | ${paddedTitle} | ${paddedAuthor} | ${b.isbn.padEnd(13)} | ${status.padEnd(10)} | ${due}`,
              "output"
            );
          });
        }
        printMenu();
        break;

      case 3:
        addLog("\n--- [3] Search Books ---");
        addLog("Enter Search Term (Title/Author/ISBN): ");
        setCommandState("SEARCH_BOOK");
        break;

      case 4:
        addLog("\n--- [4] Register Member ---");
        addLog("Enter Full Name: ");
        setCommandState("REGISTER_NAME");
        break;

      case 5:
        addLog("\n--- [5] Borrow Book ---");
        addLog("Enter Member Registration ID (e.g., 1001): ");
        setCommandState("BORROW_MID");
        break;

      case 6:
        addLog("\n--- [6] Return Book ---");
        addLog("Enter Book catalog ID (e.g., 101): ");
        setCommandState("RETURN_BID");
        break;

      case 7:
        addLog("\n====================================");
        addLog("      CURRENT LIBRARY METRICS       ");
        addLog("====================================");
        addLog(`Total Books Cataloged:       ${state.books.length}`);
        const borrowedCount = state.books.filter((b) => !b.isAvailable).length;
        addLog(`Available Books in Shelves:  ${state.books.length - borrowedCount}`);
        addLog(`Active Outgoing Borrowings:  ${borrowedCount}`);
        addLog(`Registered System Members:   ${state.members.length}`);
        addLog(`Cumulative Late Fines Pool: $${state.collectedFines.toFixed(2)}`);
        addLog("====================================\n");
        printMenu();
        break;

      case 8:
        addLog("\nExiting. Compiling outputs & saving files... Goodbye!", "success");
        addLog("System reset. You may run the console driver again.", "output");
        break;
    }
  };

  const getLogColorClass = (type: LogLine["type"]) => {
    switch (type) {
      case "input":
        return "text-indigo-400 font-bold";
      case "error":
        return "text-red-400 font-medium";
      case "success":
        return "text-green-400 font-medium";
      case "banner":
        return "text-amber-500 font-bold";
      default:
        return "text-gray-300";
    }
  };

  const getPromptPlaceholder = () => {
    switch (commandState) {
      case "MENU":
        return "Enter menu selection (1-8)";
      case "ADD_BOOK_TITLE":
        return "Enter book title e.g. Design Patterns";
      case "ADD_BOOK_AUTHOR":
        return "Enter book author e.g. Erich Gamma";
      case "ADD_BOOK_ISBN":
        return "Enter ISBN-13 e.g. 9780201633610";
      case "SEARCH_BOOK":
        return "Type books keywords to search";
      case "REGISTER_NAME":
        return "Type new member's name";
      case "BORROW_MID":
        return "Enter member ID (e.g. 1001)";
      case "BORROW_BID":
        return "Enter Book catalog ID (e.g. 101)";
      case "RETURN_BID":
        return "Enter Book catalog ID (e.g. 101)";
      case "RETURN_DATE":
        return "Leave empty or type return date (yyyy-MM-dd)";
      default:
        return "Type here...";
    }
  };

  const triggerMockUseCase = (scenario: "borrow" | "returnLate" | "register") => {
    // Inject logs mock actions
    if (scenario === "register") {
      setCommandState("REGISTER_NAME");
      addLog("--- Direct Trigger: Registering New Member ---", "banner");
      addLog("Enter Full Name: ", "output");
      setCurrentInput("Diana Prince");
    } else if (scenario === "borrow") {
      setCommandState("BORROW_MID");
      addLog("--- Direct Trigger: Borrowing Book ---", "banner");
      addLog("Enter Member Registration ID (e.g., 1001): ", "output");
      setCurrentInput("1001");
    } else if (scenario === "returnLate") {
      setCommandState("RETURN_BID");
      addLog("--- Direct Trigger: Return Book Late ---", "banner");
      addLog("Enter Book catalog ID (e.g., 101): ", "output");
      setCurrentInput("102"); // Clean code (borrowed by Bob initially)
    }
  };

  return (
    <div id="terminal-simulation" className="flex flex-col bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden h-[540px]">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 w-[11px] h-[11px]"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 w-[11px] h-[11px]"></span>
            <span className="w-3 h-3 rounded-full bg-green-500/80 w-[11px] h-[11px]"></span>
          </div>
          <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5 pl-2">
            <Terminal size={12} className="text-indigo-400" />
            Java JVM Virtual Console :: Main.class
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onResetState}
            title="Reset JVM State and seed data"
            className="p-1 text-slate-400 hover:text-slate-200 transition-colors hover:bg-slate-800 rounded"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Terminal View */}
      <div className="flex-1 p-4 overflow-y-auto font-mono text-[13px] leading-relaxed select-text space-y-1">
        {terminalLogs.map((log, index) => (
          <div key={index} className={`whitespace-pre-wrap ${getLogColorClass(log.type)}`}>
            {log.text}
          </div>
        ))}
        <div ref={consoleEndRef} />
      </div>

      {/* Auto-fill Scenarios bar */}
      <div className="px-4 py-2 border-t border-slate-800 bg-slate-950 flex flex-wrap gap-2 items-center text-xs">
        <span className="text-slate-500 font-medium">Quick Scenarios:</span>
        <button
          onClick={() => triggerMockUseCase("register")}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
        >
          + Reg Member ("Diana Prince")
        </button>
        <button
          onClick={() => triggerMockUseCase("borrow")}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
        >
          Borrow checkout (Alice borrows)
        </button>
        <button
          onClick={() => triggerMockUseCase("returnLate")}
          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
        >
          Return Book (Simulate Overdue)
        </button>
      </div>

      {/* Input Form */}
      <form onSubmit={handleTerminalSubmit} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
        <span className="font-mono text-slate-400 text-sm py-1 font-bold select-none">&gt;&gt;</span>
        <input
          type="text"
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          placeholder={getPromptPlaceholder()}
          autoFocus
          className="flex-1 bg-transparent text-indigo-300 font-mono text-sm border-0 focus:outline-none focus:ring-0 placeholder-slate-600"
        />
        <button
          type="submit"
          className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono rounded transition-all hover:text-white border border-slate-700"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
