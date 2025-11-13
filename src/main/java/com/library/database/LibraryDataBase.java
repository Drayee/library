package com.library.database;

import com.library.userClass.Books;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class LibraryDataBase extends DataBaseLoad {
    private final String lend_sql;
    private final String return_sql;
    private final String find_sql;
    private final String find_all_sql;

    public LibraryDataBase(){
        super("userbook");
        lend_sql = "INSERT INTO "+table_name+" (iduser, idbook) VALUES (?, ?) ";
        return_sql = "DELETE FROM "+table_name+" AS l WHERE l.idbook = ?";
        find_sql = "SELECT * FROM "+table_name+" AS l WHERE l.iduser = ?";
        find_all_sql = "SELECT * FROM "+table_name;
    }

    public boolean lend(int id, int bookId) {
        try {
            PreparedStatement pstmt = conn.prepareStatement(lend_sql);
            pstmt.setInt(1, id);
            pstmt.setInt(2, bookId);
            return pstmt.executeUpdate()>0;
        } catch (SQLException e) {
            return false;
        }
    }

    public boolean returned(int bookId) {
        try {
            PreparedStatement pstmt = conn.prepareStatement(return_sql);
            pstmt.setInt(1, bookId);
            return pstmt.executeUpdate()>0;
        } catch (SQLException e) {
            return false;
        }
    }

    public Books[] getAllLendBooks() {
        try{
            PreparedStatement pstmt = conn.prepareStatement(find_all_sql);
            ResultSet rs = pstmt.executeQuery();
            Books[] books = getBooks(rs);
            if (books != null) return books;
        } catch (SQLException e) {
            return null;
        }
        return null;
    }

    private Books[] getBooks(ResultSet rs) throws SQLException {
        if (rs.next()) {
            Books[] books = new Books[rs.getMetaData().getColumnCount()];
            for (int i = 0; i < rs.getMetaData().getColumnCount(); i++) {
                books[i] = new Books(rs.getInt("idbook"), rs.getInt("iduser"), rs.getString("lenddate"));
            }
            rs.close();
            return books;
        }
        return null;
    }

    public Books[] getLendBook(int userId) {
        try {
            PreparedStatement pstmt = conn.prepareStatement(find_sql);
            pstmt.setInt(1, userId);
            ResultSet rs = pstmt.executeQuery();
            Books[] books = getBooks(rs);
            if (books != null) return books;
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
