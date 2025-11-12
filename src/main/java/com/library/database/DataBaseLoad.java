package com.library.database;

import java.sql.*;
import java.util.Random;

public abstract class DataBaseLoad implements IDataBase {
    private static final String user;
    private static final String password;
    protected static final Connection conn;
    protected static final Statement stmt;
    protected static ResultSet rs;

    protected static KEY key;

    public String getUser(KEY key) {
        if (!DataBaseLoad.key.equals(key)) {
            return null;
        }
        return user;
    }

    public String getPassword(KEY key) {
        if (!DataBaseLoad.key.equals(key)) {
            return null;
        }
        return password;
    }

    public ResultSet getResultSet(KEY key) {
        if (!DataBaseLoad.key.equals(key)) {
            return null;
        }
        return rs;
    }

    static {

        user = "root";
        password = "yuanshen123";

        key = new KEY("id", new Random().nextInt(1000000));

        try {
            Class.forName("com.mysql.cj.jdbc.Driver");
            conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/library", user, password);
            stmt = conn.createStatement();
        } catch (ClassNotFoundException | SQLException e) {
            throw new RuntimeException(e);
        }
    }

    private final String sql;
    private String insert_pstmts;
    private String in_check_pstmts;
    protected final String table_name;

    public DataBaseLoad(String table_name) {
        insert_pstmts = null;
        in_check_pstmts = null;
        this.table_name = table_name;
        sql = "SELECT * FROM " + table_name;
        try {
            PreparedStatement select_pstmt = conn.prepareStatement(sql);
            rs = select_pstmt.executeQuery();
            rs.next();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
        if (!check()) {
            throw new RuntimeException("Something went wrong when loading " + table_name);
        }else{
            System.out.println("Successfully loaded " + table_name);
        }
    }

    protected String getSql() {
        return sql;
    }

    public void DataBaseLoadClose() {
        try {
            rs.close();
            conn.close();
            stmt.close();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    @Override
    public boolean SetKey(KEY new_key) {
        if (key.equals(new_key)) {
            key = new_key;
            return true;
        }
        return false;
    }

    public Object getField(String field) {
        try {
            return rs.getObject(field);
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public boolean addField(String[] field, Object[] value) {
        insert_pstmts = "INSERT INTO " + table_name + " (" + String.join(", ", field) + ") VALUES (" + String.join(", ", java.util.stream.IntStream.range(0, field.length).mapToObj(i -> "?").toArray(String[]::new)) + ")";
        try {
            PreparedStatement insert_pstmt = conn.prepareStatement(insert_pstmts);
            for (int i = 0; i < field.length; i++) {
                insert_pstmt.setString(i + 1, String.valueOf(value[i]));
            }
            insert_pstmt.executeUpdate();
            return true;
        } catch (SQLException e) {
            return false;
        }
    }

    public boolean isInColumn(String column, Object value) {
        try {
            in_check_pstmts = "SELECT " + column + " FROM " + table_name + " WHERE " + column + " = ?";
            PreparedStatement check_pstmt = conn.prepareStatement(in_check_pstmts);
            check_pstmt.setString(1, String.valueOf(value));
            return check_pstmt.executeQuery().next();
        } catch (SQLException e) {
            throw new RuntimeException(e);
        }
    }

    public abstract boolean check();
}