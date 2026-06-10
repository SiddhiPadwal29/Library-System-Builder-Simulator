import { JavaFile } from "./types";

export const javaCodeFiles: JavaFile[] = [
  {
    name: "Book.java",
    path: "week3-library-system/src/main/java/library/Book.java",
    description: "Defines the Book model with strict encapsulation, fields for tracking borrowing status, and custom file serialization loaders.",
    content: `package library;

/**
 * Represents a library book.
 * Concepts: Encapsulation (private fields, public accessors and mutators).
 */
public class Book {
    private int id;
    private String title;
    private String author;
    private String isbn;
    private boolean isAvailable;
    private int borrowerId; // ID of the member who borrowed it, -1 if available
    private String dueDate; // "N/A" if available, otherwise formatted "yyyy-MM-dd"

    /**
     * Constructor for creating a new Book instance.
     */
    public Book(int id, String title, String author, String isbn) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.isAvailable = true;
        this.borrowerId = -1;
        this.dueDate = "N/A";
    }

    /**
     * Constructor used when reading from files (loaded state).
     */
    public Book(int id, String title, String author, String isbn, boolean isAvailable, int borrowerId, String dueDate) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.isbn = isbn;
        this.isAvailable = isAvailable;
        this.borrowerId = borrowerId;
        this.dueDate = dueDate;
    }

    // --- Accessors & Mutators (Strict Encapsulation) ---

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
    }

    public int getBorrowerId() {
        return borrowerId;
    }

    public void setBorrowerId(int borrowerId) {
        this.borrowerId = borrowerId;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    /**
     * Helper method to serialize Book information to record in "books.txt" CSV style.
     */
    public String toFileString() {
        return id + ";" + title + ";" + author + ";" + isbn + ";" + isAvailable + ";" + borrowerId + ";" + dueDate;
    }

    /**
     * Helper static method to parse a line from "books.txt" and instantiate a Book.
     */
    public static Book fromFileString(String line) {
        String[] parts = line.split(";");
        if (parts.length < 7) {
            throw new IllegalArgumentException("Invalid file format for Book serialization.");
        }
        int id = Integer.parseInt(parts[0]);
        String title = parts[1];
        String author = parts[2];
        String isbn = parts[3];
        boolean isAvailable = Boolean.parseBoolean(parts[4]);
        int borrowerId = Integer.parseInt(parts[5]);
        String dueDate = parts[6];
        return new Book(id, title, author, isbn, isAvailable, borrowerId, dueDate);
    }

    @Override
    public String toString() {
        String status = isAvailable ? "Available" : "Borrowed (Due: " + dueDate + ")";
        return String.format("Book [ID=%d, Title='%s', Author='%s', ISBN='%s', Status=%s]", 
                id, title, author, isbn, status);
    }
}`
  },
  {
    name: "Member.java",
    path: "week3-library-system/src/main/java/library/Member.java",
    description: "Defines the Member model carrying records of active borrowed books tracked dynamically using an ArrayList.",
    content: `package library;

import java.util.ArrayList;

/**
 * Represents a registered library member.
 * Concepts: Encapsulation, ArrayList integration for composite relations.
 */
public class Member {
    private int id;
    private String name;
    private ArrayList<Integer> borrowedBookIds; // tracks currently borrowed books

    /**
     * New member constructor.
     */
    public Member(int id, String name) {
        this.id = id;
        this.name = name;
        this.borrowedBookIds = new ArrayList<>();
    }

    /**
     * Deserialization constructor from file loader state.
     */
    public Member(int id, String name, ArrayList<Integer> borrowedBookIds) {
        this.id = id;
        this.name = name;
        this.borrowedBookIds = borrowedBookIds;
    }

    // --- Accessor & Mutator Methods (Strict Encapsulation) ---

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ArrayList<Integer> getBorrowedBookIds() {
        return borrowedBookIds;
    }

    public void addBorrowedBook(int bookId) {
        if (!borrowedBookIds.contains(bookId)) {
            borrowedBookIds.add(bookId);
        }
    }

    public void removeBorrowedBook(int bookId) {
        borrowedBookIds.remove(Integer.valueOf(bookId));
    }

    /**
     * Converts Member state to serialized line for members.txt storage.
     */
    public String toFileString() {
        StringBuilder sb = new StringBuilder();
        sb.append(id).append(";").append(name).append(";");
        if (borrowedBookIds.isEmpty()) {
            sb.append("NONE");
        } else {
            for (int i = 0; i < borrowedBookIds.size(); i++) {
                sb.append(borrowedBookIds.get(i));
                if (i < borrowedBookIds.size() - 1) {
                    sb.append(",");
                }
            }
        }
        return sb.toString();
    }

    /**
     * Reconstructs Member instance from a line from members.txt file.
     */
    public static Member fromFileString(String line) {
        String[] parts = line.split(";");
        if (parts.length < 2) {
            throw new IllegalArgumentException("Invalid file format for Member serialization.");
        }
        int id = Integer.parseInt(parts[0]);
        String name = parts[1];
        ArrayList<Integer> borrowedBookIds = new ArrayList<>();
        
        if (parts.length > 2 && !parts[2].equalsIgnoreCase("NONE")) {
            String[] ids = parts[2].split(",");
            for (String bid : ids) {
                if (!bid.trim().isEmpty()) {
                    borrowedBookIds.add(Integer.parseInt(bid.trim()));
                }
            }
        }
        
        return new Member(id, name, borrowedBookIds);
    }

    @Override
    public String toString() {
        return String.format("Member [ID=%d, Name='%s', Borrowed Books Count=%d]", 
                id, name, borrowedBookIds.size());
    }
}`
  },
  {
    name: "LibraryManager.java",
    path: "week3-library-system/src/main/java/library/LibraryManager.java",
    description: "The core system administrator handling in-memory database arrays, transaction logic, fine calculation, and custom file-readers/writers.",
    content: `package library;

import java.io.*;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;

/**
 * Controller class managing the books, members, and transactions.
 * Concepts: File I/O operations, collections (ArrayLists), custom fine calculations, OOP organization.
 */
public class LibraryManager {
    private ArrayList<Book> books;
    private ArrayList<Member> members;
    
    private final String BOOKS_FILE = "books.txt";
    private final String MEMBERS_FILE = "members.txt";
    private double accumulatedFines; // tracks fine stats in simulated system

    public LibraryManager() {
        this.books = new ArrayList<>();
        this.members = new ArrayList<>();
        this.accumulatedFines = 0.0;
        // Automatically attempt to load data on initialization
        loadData();
    }

    // --- Book Operations ---

    public void addBook(String title, String author, String isbn) {
        int nextId = books.isEmpty() ? 101 : books.get(books.size() - 1).getId() + 1;
        Book newBook = new Book(nextId, title, author, isbn);
        books.add(newBook);
        System.out.println("Success: Book '" + title + "' added successfully with ID: " + nextId);
        saveData();
    }

    public ArrayList<Book> getAllBooks() {
        return books;
    }

    public ArrayList<Book> searchBooks(String query) {
        ArrayList<Book> results = new ArrayList<>();
        String lowerQuery = query.toLowerCase().trim();
        for (Book b : books) {
            if (b.getTitle().toLowerCase().contains(lowerQuery) || 
                b.getAuthor().toLowerCase().contains(lowerQuery) || 
                b.getIsbn().contains(lowerQuery)) {
                results.add(b);
            }
        }
        return results;
    }

    // --- Member Operations ---

    public void registerMember(String name) {
        int nextId = members.isEmpty() ? 1001 : members.get(members.size() - 1).getId() + 1;
        Member newMember = new Member(nextId, name);
        members.add(newMember);
        System.out.println("Success: Member '" + name + "' registered successfully with ID: " + nextId);
        saveData();
    }

    public ArrayList<Member> getAllMembers() {
        return members;
    }

    public Member findMemberById(int memberId) {
        for (Member m : members) {
            if (m.getId() == memberId) {
                return m;
            }
        }
        return null;
    }

    public Book findBookById(int bookId) {
        for (Book b : books) {
            if (b.getId() == bookId) {
                return b;
            }
        }
        return null;
    }

    // --- Transaction Business Logic ---

    public boolean borrowBook(int memberId, int bookId) {
        Member member = findMemberById(memberId);
        if (member == null) {
            System.out.println("Error: Member with ID " + memberId + " not found!");
            return false;
        }

        Book book = findBookById(bookId);
        if (book == null) {
            System.out.println("Error: Book with ID " + bookId + " not found!");
            return false;
        }

        if (!book.isAvailable()) {
            System.out.println("Error: Book '" + book.getTitle() + "' is already borrowed! Currently due on " + book.getDueDate());
            return false;
        }

        // Apply rules: borrowing represents a 14 day checkout cycle
        LocalDate borrowDate = LocalDate.now();
        LocalDate dueDate = borrowDate.plusDays(14);

        book.setAvailable(false);
        book.setBorrowerId(memberId);
        book.setDueDate(dueDate.toString());

        member.addBorrowedBook(bookId);

        System.out.println("Success: '" + book.getTitle() + "' borrowed by " + member.getName() + ".");
        System.out.println("-> Date Borrowed: " + borrowDate + " | Return Due Date: " + dueDate);
        
        saveData();
        return true;
    }

    public boolean returnBook(int bookId, String returnDateStr) {
        Book book = findBookById(bookId);
        if (book == null) {
            System.out.println("Error: Book with ID " + bookId + " not found!");
            return false;
        }

        if (book.isAvailable()) {
            System.out.println("Error: Book '" + book.getTitle() + "' is not marked as borrowed inside our database!");
            return false;
        }

        int borrowerId = book.getBorrowerId();
        Member member = findMemberById(borrowerId);

        // Process fine calculations
        double fine = calculateOverdueFine(book, returnDateStr);
        if (fine > 0) {
            accumulatedFines += fine;
            System.out.printf("Warning: Return is overdue! Out of Cycle Fine incurred: $%.2f%n", fine);
        } else {
            System.out.println("Success: Return processed on schedule. No fine incurred.");
        }

        book.setAvailable(true);
        book.setBorrowerId(-1);
        book.setDueDate("N/A");

        if (member != null) {
            member.removeBorrowedBook(bookId);
        }

        System.out.println("Success: '" + book.getTitle() + "' is returned to inventory.");
        saveData();
        return true;
    }

    /**
     * Calculates overdue fines at $0.50 per day past the due date.
     * Concepts: LocalDate parsing, ChronoUnit difference tracking.
     */
    public double calculateOverdueFine(Book book, String returnDateStr) {
        if (book == null || book.getDueDate().equals("N/A")) {
            return 0.0;
        }
        try {
            LocalDate due = LocalDate.parse(book.getDueDate());
            LocalDate returned = LocalDate.parse(returnDateStr);
            
            if (returned.isAfter(due)) {
                long daysOverdue = ChronoUnit.DAYS.between(due, returned);
                return daysOverdue * 0.50; // $0.50 per day rate
            }
        } catch (Exception e) {
            System.out.println("Log: Non-standard date format encountered in calculations. Skipping fine.");
        }
        return 0.0;
    }

    // --- Statistics ---

    public void viewLibraryStatistics() {
        System.out.println("\n====================================");
        System.out.println("      CURRENT LIBRARY METRICS       ");
        System.out.println("====================================");
        System.out.println("Total Books Cataloged:       " + books.size());
        
        int borrowedCount = 0;
        for (Book b : books) {
            if (!b.isAvailable()) borrowedCount++;
        }
        System.out.println("Available Books in Shelves:  " + (books.size() - borrowedCount));
        System.out.println("Active Outgoing Borrowings:  " + borrowedCount);
        System.out.println("Registered System Members:   " + members.size());
        System.out.printf("Cumulative Late Fines Pool: $%.2f%n", accumulatedFines);
        System.out.println("====================================\n");
    }

    // --- File I/O Operations for Data Persistence ---

    /**
     * Loads books and members lists from external files.
     * Concepts: BufferedReader structure, Exception block containment.
     */
    public void loadData() {
        // Load Books database
        File booksFile = new File(BOOKS_FILE);
        if (booksFile.exists()) {
            try (BufferedReader reader = new BufferedReader(new FileReader(booksFile))) {
                books.clear();
                String line;
                while ((line = reader.readLine()) != null) {
                    if (!line.trim().isEmpty()) {
                        books.add(Book.fromFileString(line));
                    }
                }
            } catch (IOException e) {
                System.out.println("Warning: Critical issue occurred reading " + BOOKS_FILE + ": " + e.getMessage());
            }
        } else {
            // Seed initial database structure if file doesn't exist
            seedInitialBooks();
        }

        // Load Members database
        File membersFile = new File(MEMBERS_FILE);
        if (membersFile.exists()) {
            try (BufferedReader reader = new BufferedReader(new FileReader(membersFile))) {
                members.clear();
                String line;
                while ((line = reader.readLine()) != null) {
                    if (!line.trim().isEmpty()) {
                        members.add(Member.fromFileString(line));
                    }
                }
            } catch (IOException e) {
                System.out.println("Warning: Critical issue occurred reading " + MEMBERS_FILE + ": " + e.getMessage());
            }
        } else {
            seedInitialMembers();
        }
    }

    /**
     * Saves dynamically altered program data arrays to file stores.
     * Concepts: BufferedWriter output pipeline writing.
     */
    public void saveData() {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(BOOKS_FILE))) {
            for (Book b : books) {
                writer.write(b.toFileString());
                writer.newLine();
            }
        } catch (IOException e) {
            System.out.println("Critical Error: Failed writing books.txt file: " + e.getMessage());
        }

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(MEMBERS_FILE))) {
            for (Member m : members) {
                writer.write(m.toFileString());
                writer.newLine();
            }
        } catch (IOException e) {
            System.out.println("Critical Error: Failed writing members.txt file: " + e.getMessage());
        }
    }

    private void seedInitialBooks() {
        books.add(new Book(101, "Effective Java", "Joshua Bloch", "9780134685991"));
        books.add(new Book(102, "Clean Code", "Robert C. Martin", "9780132350884"));
        books.add(new Book(103, "Head First Java", "Kathy Sierra", "9780596009205"));
        saveData();
    }

    private void seedInitialMembers() {
        members.add(new Member(1001, "Alice Johnson"));
        members.add(new Member(1002, "Bob Smith"));
        saveData();
    }
}`
  },
  {
    name: "Main.java",
    path: "week3-library-system/src/main/java/library/Main.java",
    description: "The primary driver class triggering the interactive command loop, including robust Scanner sanitizers and CLI state responses.",
    content: `package library;

import java.util.ArrayList;
import java.util.Scanner;

/**
 * Driver console class booting up the Library Management Command Center.
 * Concepts: Scanner menu systems, Exception sanitizers, helper operations.
 */
public class Main {
    public static void main(String[] args) {
        LibraryManager manager = new LibraryManager();
        Scanner scanner = new Scanner(System.in);
        boolean running = true;

        System.out.println("=================================================");
        System.out.println("  WELCOME TO CONSOLE LIBRARY MANAGEMENT SYSTEM   ");
        System.out.println("        Week 3: Java Programming Basics          ");
        System.out.println("=================================================");

        while (running) {
            printMenu();
            System.out.print("Enter your choice: ");
            String choiceInput = scanner.nextLine().trim();

            if (choiceInput.isEmpty()) {
                continue;
            }

            int choice = -1;
            try {
                choice = Integer.parseInt(choiceInput);
            } catch (NumberFormatException e) {
                System.out.println("Error: Invalid choice format! Please enter an integer between 1 and 8.");
                continue;
            }

            switch (choice) {
                case 1:
                    performAddBook(manager, scanner);
                    break;
                case 2:
                    performViewBooks(manager);
                    break;
                case 3:
                    performSearchBooks(manager, scanner);
                    break;
                case 4:
                    performRegisterMember(manager, scanner);
                    break;
                case 5:
                    performBorrowBook(manager, scanner);
                    break;
                case 6:
                    performReturnBook(manager, scanner);
                    break;
                case 7:
                    manager.viewLibraryStatistics();
                    break;
                case 8:
                    System.out.println("\nExiting. Compiling outputs & saving files... Goodbye!");
                    manager.saveData();
                    running = false;
                    break;
                default:
                    System.out.println("Error: Out of bounds option. Please select an operational code 1-8.");
            }
        }
        scanner.close();
    }

    private static void printMenu() {
        System.out.println("\n=== LIBRARY MANAGEMENT SYSTEM ===");
        System.out.println("1. Add New Book");
        System.out.println("2. View All Books");
        System.out.println("3. Search Books");
        System.out.println("4. Register Member");
        System.out.println("5. Borrow Book");
        System.out.println("6. Return Book");
        System.out.println("7. View Library Statistics");
        System.out.println("8. Exit");
    }

    private static void performAddBook(LibraryManager manager, Scanner scanner) {
        System.out.println("\n--- [1] Add New Book ---");
        System.out.print("Enter Book Title: ");
        String title = scanner.nextLine().trim();
        if (title.isEmpty()) {
            System.out.println("Error: Book title cannot be empty!");
            return;
        }

        System.out.print("Enter Book Author: ");
        String author = scanner.nextLine().trim();
        if (author.isEmpty()) {
            System.out.println("Error: Author field cannot be empty!");
            return;
        }

        System.out.print("Enter ISBN-13 Code: ");
        String isbn = scanner.nextLine().trim();
        if (isbn.isEmpty()) {
            System.out.println("Error: ISBN-13 code cannot be empty!");
            return;
        }

        manager.addBook(title, author, isbn);
    }

    private static void performViewBooks(LibraryManager manager) {
        System.out.println("\n--- [2] View All Books ---");
        ArrayList<Book> books = manager.getAllBooks();
        if (books.isEmpty()) {
            System.out.println("Catalog is empty. Register books using Menu Task [1].");
            return;
        }

        System.out.printf("%-5s | %-25s | %-20s | %-13s | %-10s | %-10s%n", 
                "ID", "TITLE", "AUTHOR", "ISBN", "STATUS", "DUE DATE");
        System.out.println("------------------------------------------------------------------------------------------------------");
        for (Book b : books) {
            String status = b.isAvailable() ? "Available" : "Borrowed";
            System.out.printf("%-5d | %-25.25s | %-20.20s | %-13s | %-10s | %-10s%n", 
                    b.getId(), b.getTitle(), b.getAuthor(), b.getIsbn(), status, b.getDueDate());
        }
    }

    private static void performSearchBooks(LibraryManager manager, Scanner scanner) {
        System.out.println("\n--- [3] Search Books ---");
        System.out.print("Enter Search Term (Title/Author/ISBN): ");
        String query = scanner.nextLine().trim();
        if (query.isEmpty()) {
            System.out.println("Error: Search query cannot be blank.");
            return;
        }

        ArrayList<Book> searchResults = manager.searchBooks(query);
        if (searchResults.isEmpty()) {
            System.out.println("No records found matching term '" + query + "'.");
            return;
        }

        System.out.printf("\n%-5s | %-25s | %-20s | %-13s | %-10s%n", "ID", "TITLE", "AUTHOR", "ISBN", "STATUS");
        System.out.println("---------------------------------------------------------------------------------");
        for (Book b : searchResults) {
            String status = b.isAvailable() ? "Available" : "Borrowed";
            System.out.printf("%-5d | %-25.25s | %-20.20s | %-13s | %-10s%n", 
                    b.getId(), b.getTitle(), b.getAuthor(), b.getIsbn(), status);
        }
    }

    private static void performRegisterMember(LibraryManager manager, Scanner scanner) {
        System.out.println("\n--- [4] Register Member ---");
        System.out.print("Enter Full Name: ");
        String name = scanner.nextLine().trim();
        if (name.isEmpty()) {
            System.out.println("Error: Name cannot be blank.");
            return;
        }

        manager.registerMember(name);
    }

    private static void performBorrowBook(LibraryManager manager, Scanner scanner) {
        System.out.println("\n--- [5] Borrow Book ---");
        System.out.print("Enter Member Registration ID (e.g., 1001): ");
        String midInput = scanner.nextLine().trim();
        System.out.print("Enter Book catalog ID (e.g., 101): ");
        String bidInput = scanner.nextLine().trim();

        try {
            int memberId = Integer.parseInt(midInput);
            int bookId = Integer.parseInt(bidInput);
            manager.borrowBook(memberId, bookId);
        } catch (NumberFormatException e) {
            System.out.println("Error: System IDs must be numeric. Transaction abandoned.");
        }
    }

    private static void performReturnBook(LibraryManager manager, Scanner scanner) {
        System.out.println("\n--- [6] Return Book ---");
        System.out.print("Enter Book catalogs ID (e.g., 101): ");
        String bidInput = scanner.nextLine().trim();
        
        System.out.print("Enter Return Date (yyyy-MM-dd) [Leave empty to record as TODAY]: ");
        String rDateInput = scanner.nextLine().trim();
        if (rDateInput.isEmpty()) {
            rDateInput = java.time.LocalDate.now().toString();
        }

        try {
            int bookId = Integer.parseInt(bidInput);
            manager.returnBook(bookId, rDateInput);
        } catch (NumberFormatException e) {
            System.out.println("Error: Catalog ID must be numerical.");
        }
    }
}`
  }
];
