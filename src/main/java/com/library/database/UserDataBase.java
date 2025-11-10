package com.library.database;

import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.util.Random;

public class UserDataBase extends DataBaseLoad {
    private final String check_pstmts;
    private final String find_userid_stmts;
    private final String find_uniquecode_stmts;

    private final Random rand = new Random();

    public UserDataBase() {
        super("users");
        check_pstmts = "SELECT DISTINCT name, password FROM users WHERE name = ? AND password = ?";
        find_userid_stmts = "SELECT iduser FROM users WHERE name = ?";
        find_uniquecode_stmts = "SELECT uniquecode FROM users WHERE name = ?";
    }

    public boolean checkUser(String user, String password) {
        try {
            PreparedStatement check_pstmt = conn.prepareStatement(check_pstmts);
            check_pstmt.setString(1, user);
            check_pstmt.setString(2, password);
            return check_pstmt.executeQuery().next();
        } catch (SQLException e) {
            return false;
        }
    }

    public boolean checkUser(String user, int uniquecode) throws SQLException {
        try {
            PreparedStatement check_pstmt = conn.prepareStatement(check_pstmts);
            check_pstmt.setString(1, user);
            check_pstmt.setInt(2, uniquecode);
            return check_pstmt.executeQuery().next();
        } catch (SQLException e) {
            return false;
        }
    }

    public int getUserID(String username) {
        try {
            PreparedStatement check_pstmt = conn.prepareStatement(find_userid_stmts);
            check_pstmt.setString(1, username);
            if (check_pstmt.executeQuery().next()) {
                rs = check_pstmt.getResultSet();
                return rs.getInt("iduser");
            }
        } catch (SQLException e) {
            return -1;
        }
        return -1;
    }

    public int getUniquecode(String username, String password) {
        try {
            if (checkUser(username, password)) {
                PreparedStatement check_pstmt = conn.prepareStatement(find_uniquecode_stmts);
                check_pstmt.setString(1, username);
                if (check_pstmt.executeQuery().next()) {
                    rs = check_pstmt.getResultSet();
                    return rs.getInt("uniquecode");
                }
            }
        } catch (SQLException e) {
            return -1;
        }
        return -1;
    }

    public boolean AddUser(String username, String password) {
        int uniquecode;
        do {
            uniquecode = rand.nextInt(2147483647);
        } while (isInColumn("uniquecode", uniquecode));
        String[] field = {"name", "password", "uniquecode"};
        Object[] value = {username, password, uniquecode};
        return addField(field, value);
    }

    @Override
    public boolean check() {
        return true;
    }
}
