package com.library.database;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

public class BindDataBase extends DataBaseLoad{
    private final String add_sql = "INSERT INTO userbind (iduser, email, studentid) VALUES (?, ?, ?)";
    private final String get_sql = "SELECT * FROM userbind WHERE iduser = ?";

    public BindDataBase() {
        super("userbind");
    }

    public boolean AddUser(int iduser, String email, String studentid) {
        try {
            PreparedStatement check_pstmt = conn.prepareStatement(add_sql);
            check_pstmt.setInt(1, iduser);
            check_pstmt.setString(2, email);
            check_pstmt.setString(3, studentid);
            return check_pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            return false;
        }
    }

    public Map<String , Object> getUser(int iduser) {
        Map<String , Object> map = new HashMap<>();
        try {
            PreparedStatement check_pstmt = conn.prepareStatement(get_sql);
            check_pstmt.setInt(1, iduser);
            ResultSet rs = check_pstmt.executeQuery();
            if (rs.next()) {
                map.put("email", rs.getString("email"));
                map.put("studentid", rs.getString("studentid"));
            }
            rs.close();
        } catch (SQLException e) {
            return null;
        }
        return map;
    }

    @Override
    public boolean check() {
        return true;
    }
}
