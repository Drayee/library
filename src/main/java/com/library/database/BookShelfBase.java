package com.library.database;

import com.library.userClass.Detail;

import java.sql.Array;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.stream.Collectors;

public class BookShelfBase extends DataBaseLoad {
    private final String get_book_sql = "SELECT name FROM " + table_name + " WHERE idbook = ?";
    private final String add_bool_sql = "INSERT INTO " + table_name + " (bookname,booknum,bookadddate,booklender,booktype,bookaddress,bookauthor) VALUES (?, ?, ?, ?, ?, ?, ?)";


    public BookShelfBase() {
        super("bookshelflibrary");
    }

    public String getBookName(int bookId) {
        try {
            PreparedStatement check_pstmt = conn.prepareStatement(get_book_sql);
            check_pstmt.setInt(1, bookId);
            rs = check_pstmt.executeQuery();
            if (rs.next()) {
                return rs.getString("bookname");
            }
        } catch (SQLException e) {
            return e.getMessage();
        }
        return "未知书籍";
    }

    public boolean addBook(Detail detail) {
        String book_type = Arrays.stream(detail.bookType()).map(Enum::name).collect(Collectors.joining(","));
        for (int i = 0; i < detail.bookIds().length; i++) {
            try {
                PreparedStatement add_pstmt = conn.prepareStatement(add_bool_sql);
                add_pstmt.setString(1, detail.bookName());
                add_pstmt.setInt(2, detail.bookNum());
                add_pstmt.setDate(3, new java.sql.Date(detail.date().getTime()));
                add_pstmt.setInt(4, 0);
                add_pstmt.setString(5, book_type);
                add_pstmt.setString(6, Arrays.toString(detail.bookAddresses()[i]));
                add_pstmt.setString(7, detail.bookAuthor());
                add_pstmt.executeUpdate();
            } catch (SQLException e) {
                return false;
            }
        }
        return true;
    }

    @Override
    public boolean check() {
        return true;
    }
}
