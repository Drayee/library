package com.library.init;

import com.library.database.BookShelfBase;
import com.library.userClass.Books;

public class BookShelf extends InitDataBase {
    private static final BookShelfBase dataBase;
    static {
        dataBase = new BookShelfBase();
    }

    public static BookShelfBase getDataBase() {
        return dataBase;
    }

    public static String getBookName(int bookId) {
        return dataBase.getBookName(bookId);
    }


    public static String getBooks(Books[] books) {
        StringBuilder sb = new StringBuilder();
        sb.append("[");

        if (books == null || books.length == 0) {
            return "[]";
        }

        for (int i = 0; i < books.length; i++) {
            Books book = books[i];
            sb.append("{");
            sb.append("\"id\":").append(book.id()).append(",");
            sb.append("\"number\":").append(book.number()).append(",");
            sb.append("\"lenddate\":\"").append(book.lenddate()).append("\"");
            sb.append("}");

            if (i < books.length - 1) {
                sb.append(",");
            }
        }
        sb.append("]");
        return sb.toString();
    }
}