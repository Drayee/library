package com.library.database;

import com.library.userClass.BookType;
import com.library.userClass.Detail;

import java.sql.Array;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Arrays;
import java.util.stream.Collectors;

public class BookShelfBase extends DataBaseLoad {
    private final String get_book_sql = "SELECT name FROM " + table_name + " WHERE idbook = ?";
    private final String add_bool_sql = "INSERT INTO " + table_name + " (bookname,booknumber,bookadddate,booklender,booktype,bookaddress,bookauthor) VALUES (?, ?, ?, ?, ?, ?, ?)";
    private final String get_book_detail_sql = "SELECT * FROM " + table_name + " WHERE idbook = ?";
    private final String get_book_all_id_sql = "SELECT * FROM " + table_name;

    public BookShelfBase() {
        super("bookshelflibrary");
    }

    public String getBookName(int bookId) {
        try {
            PreparedStatement check_pstmt = conn.prepareStatement(get_book_sql);
            check_pstmt.setInt(1, bookId);
            ResultSet rs = check_pstmt.executeQuery();
            if (rs.next()) {
                String bookName = rs.getString("bookname");
                rs.close();
                return bookName;
            }
        } catch (SQLException e) {
            return e.getMessage();
        }
        return "未知书籍";
    }

    public boolean addBook(Detail detail) {
        String book_type = Arrays.stream(detail.bookType()).map(Enum::name).collect(Collectors.joining(","));
        for (int i = 0; i < detail.bookNum(); i++) {
            try {
                PreparedStatement add_pstmt = conn.prepareStatement(add_bool_sql);
                add_pstmt.setString(1, detail.bookName());
                add_pstmt.setInt(2, detail.bookIds()[i]);
                add_pstmt.setDate(3, new java.sql.Date(detail.date().getTime()));
                add_pstmt.setInt(4, 0);
                add_pstmt.setString(5, book_type);
                add_pstmt.setString(6, Arrays.toString(detail.bookAddresses()[i]));
                add_pstmt.setString(7, detail.bookAuthor());
                add_pstmt.executeUpdate();
            } catch (SQLException e) {
                System.out.println(e.getMessage());
                return false;
            }
        }
        return true;
    }

    public Detail[] getAllBookDetail() {
        try{
            PreparedStatement pstmt = conn.prepareStatement(get_book_all_id_sql);
            ResultSet rs = pstmt.executeQuery();
            Detail[] details = new Detail[rs.getMetaData().getColumnCount()];
            while (rs.next()) {
                details[rs.getInt("idbook")] = this.getBookDetail(rs.getInt("idbook"));
            }
            rs.close();
            return details;
        } catch (SQLException e) {
            return null;
        }
    }

    public Detail getBookDetail(int bookId) {
        try {
            PreparedStatement pstmt = conn.prepareStatement(get_book_detail_sql);
            pstmt.setInt(1, bookId);
            ResultSet rs = pstmt.executeQuery();
            if (rs.next()) {
                 Detail detail = new Detail(
                                new int[]{bookId},
                                rs.getString("bookname"),
                                1,
                                rs.getString("booklender").equals("null") ? 0 : 1,
                                new String[]{rs.getString("booknumber")},
                                rs.getString("bookauthor"),
                                new int[][]{Arrays.stream(rs.getString("bookaddress").replaceAll("[\\[\\]]", "").split(",")).map(String::trim).mapToInt(Integer::parseInt).toArray()},
                                Arrays.stream(rs.getString("booktype").split(",")).map(BookType::valueOf).toArray(BookType[]::new),
                                rs.getDate("bookadddate")
                );
                 rs.close();
                 return detail;
            }
        } catch (SQLException e) {
            return null;
        }
        return null;
    }

    @Override
    public boolean check() {
        return true;
    }
}
