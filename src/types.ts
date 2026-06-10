export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  isAvailable: boolean;
  borrowerId: number;
  dueDate: string | null;
}

export interface Member {
  id: number;
  name: string;
  borrowedBookIds: number[];
}

export interface BorrowingRecord {
  bookId: number;
  memberId: number;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  fineIncurred?: number;
}

export interface LibraryState {
  books: Book[];
  members: Member[];
  borrowings: BorrowingRecord[];
  collectedFines: number;
}

export interface JavaFile {
  name: string;
  path: string;
  content: string;
  description: string;
}
