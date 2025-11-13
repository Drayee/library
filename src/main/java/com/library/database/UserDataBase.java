package com.library.database;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class UserDataBase extends DataBaseLoad {
    private final String check_pstmts;
    private final String get_all_pstmts;
    private final String find_userid_stmts;
    private final String find_uniquecode_stmts;
    private final String find_username_stmts;

    private final Random rand = new Random();

    public UserDataBase() {
        super("users");
        check_pstmts = "SELECT DISTINCT name, password FROM users WHERE name = ? AND password = ?";
        find_userid_stmts = "SELECT iduser FROM users WHERE name = ?";
        find_uniquecode_stmts = "SELECT uniquecode FROM users WHERE name = ?";
        find_username_stmts = "SELECT name FROM users WHERE iduser = ?";
        get_all_pstmts = "SELECT * FROM users";
    }

    public Map<Integer, String> getAllUsers() {
        try {
            PreparedStatement select_pstmt = conn.prepareStatement(get_all_pstmts);
            ResultSet rs = select_pstmt.executeQuery();
            Map<Integer, String> users = new HashMap<>();
            while (rs.next()) {
                int iduser = rs.getInt(1);
                String uname = rs.getString(2);
                users.put(iduser, uname);
            }
            System.out.println(users);
            rs.close();
            return users;
        } catch (SQLException e) {
            return null;
        }
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
                ResultSet rs = check_pstmt.getResultSet();
                int iduser = rs.getInt("iduser");
                rs.close();
                return iduser;
            }
        } catch (SQLException e) {
            return -1;
        }
        return -1;
    }

    public String getUsername(String userid) {
        try {
            PreparedStatement check_pstmt = conn.prepareStatement(find_username_stmts);
            check_pstmt.setInt(1, Integer.parseInt(userid));
            if (check_pstmt.executeQuery().next()) {
                ResultSet rs = check_pstmt.getResultSet();
                String name = rs.getString("name");
                rs.close();
                return name;
            }
        } catch (SQLException e) {
            return null;
        }
        return null;
    }

    public int getUniquecode(String username, String password) {
        try {
            if (checkUser(username, password)) {
                PreparedStatement check_pstmt = conn.prepareStatement(find_uniquecode_stmts);
                check_pstmt.setString(1, username);
                if (check_pstmt.executeQuery().next()) {
                    ResultSet rs = check_pstmt.getResultSet();
                    int uniquecode = rs.getInt("uniquecode");
                    rs.close();
                    return uniquecode;
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
