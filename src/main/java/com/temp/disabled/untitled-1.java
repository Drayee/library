//package com.library.servlet;
//import jakarta.servlet.*;
//import jakarta.servlet.http.*;
//import jakarta.servlet.annotation.*;
//import java.io.IOException;
//import com.fasterxml.jackson.databind.ObjectMapper;
//import java.util.*;
//
//@WebServlet(name = "Administer", value = "/administer")
//public class Iadminister extends HttpServlet {
//    private ObjectMapper objectMapper = new ObjectMapper();
//
//    @Override
//    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        // 处理GET请求（如果需要的话）
//        response.setContentType("application/json;charset=UTF-8");
//        response.getWriter().write("{\"success\": false, \"message\": \"请使用POST方法\"}");
//    }
//
//    @Override
//    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
//        response.setContentType("application/json;charset=UTF-8");
//        response.setCharacterEncoding("UTF-8");
//
//        try {
//            // 读取请求体中的JSON数据
//            StringBuilder requestBody = new StringBuilder();
//            String line;
//            while ((line = request.getReader().readLine()) != null) {
//                requestBody.append(line);
//            }
//
//            Map<String, Object> requestData = objectMapper.readValue(requestBody.toString(), Map.class);
//            String action = (String) requestData.get("action");
//
//            if (action == null) {
//                response.getWriter().write("{\"success\": false, \"message\": \"缺少action参数\"}");
//                return;
//            }
//
//            switch (action) {
//                case "login":
//                    handleLogin(requestData, response);
//                    break;
//                case "getUsers":
//                    handleGetUsers(response);
//                    break;
//                case "getBooks":
//                    handleGetBooks(response);
//                    break;
//                case "getBorrowRecords":
//                    handleGetBorrowRecords(response);
//                    break;
//                case "addUser":
//                    handleAddUser(requestData, response);
//                    break;
//                case "addBook":
//                    handleAddBook(requestData, response);
//                    break;
//                case "editUser":
//                    handleEditUser(requestData, response);
//                    break;
//                case "editBook":
//                    handleEditBook(requestData, response);
//                    break;
//                case "deleteUser":
//                    handleDeleteUser(requestData, response);
//                    break;
//                case "deleteBook":
//                    handleDeleteBook(requestData, response);
//                    break;
//                case "returnBook":
//                    handleReturnBook(requestData, response);
//                    break;
//                default:
//                    response.getWriter().write("{\"success\": false, \"message\": \"未知的action: \" + action}");
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            response.getWriter().write("{\"success\": false, \"message\": \"服务器内部错误: \" + e.getMessage()}");
//        }
//    }
//
//    private void handleLogin(Map<String, Object> requestData, HttpServletResponse response) throws IOException {
//        String username = (String) requestData.get("username");
//        String password = (String) requestData.get("password");
//
//        if ("admin".equals(username) && "123456".equals(password)) {
//            response.getWriter().write("{\"success\": true, \"message\": \"登录成功\"}");
//        } else {
//            response.getWriter().write("{\"success\": false, \"message\": \"登录失败,用户名或密码错误\"}");
//        }
//    }
//
//    private void handleGetUsers(HttpServletResponse response) throws IOException {
//        // 模拟用户数据 - 在实际应用中应该从数据库获取
//        List<Map<String, Object>> users = new ArrayList<>();
//
//        Map<String, Object> user1 = new HashMap<>();
//        user1.put("id", 1);
//        user1.put("name", "张三");
//        user1.put("number", "20230001");
//        user1.put("email", "zhangsan@sicau.edu.cn");
//        user1.put("status", "active");
//        users.add(user1);
//
//        Map<String, Object> user2 = new HashMap<>();
//        user2.put("id", 2);
//        user2.put("name", "李四");
//        user2.put("number", "20230002");
//        user2.put("email", "lisi@sicau.edu.cn");
//        user2.put("status", "active");
//        users.add(user2);
//
//        Map<String, Object> result = new HashMap<>();
//        result.put("success", true);
//        result.put("data", users);
//
//        response.getWriter().write(objectMapper.writeValueAsString(result));
//    }
//
//    private void handleGetBooks(HttpServletResponse response) throws IOException {
//        // 模拟图书数据 - 在实际应用中应该从数据库获取
//        List<Map<String, Object>> books = new ArrayList<>();
//
//        Map<String, Object> book1 = new HashMap<>();
//        book1.put("id", 1);
//        book1.put("title", "Java编程思想");
//        book1.put("author", "Bruce Eckel");
//        book1.put("isbn", "9787111213826");
//        book1.put("stock", 5);
//        book1.put("status", "available");
//        books.add(book1);
//
//        Map<String, Object> book2 = new HashMap<>();
//        book2.put("id", 2);
//        book2.put("title", "深入理解计算机系统");
//        book2.put("author", "Randal E. Bryant");
//        book2.put("isbn", "9787111544937");
//        book2.put("stock", 3);
//        book2.put("status", "available");
//        books.add(book2);
//
//        Map<String, Object> result = new HashMap<>();
//        result.put("success", true);
//        result.put("data", books);
//
//        response.getWriter().write(objectMapper.writeValueAsString(result));
//    }
//
//    private void handleGetBorrowRecords(HttpServletResponse response) throws IOException {
//        // 模拟借阅记录 - 在实际应用中应该从数据库获取
//        List<Map<String, Object>> records = new ArrayList<>();
//
//        Map<String, Object> record1 = new HashMap<>();
//        record1.put("id", 1);
//        record1.put("userId", 1);
//        record1.put("bookId", 1);
//        record1.put("borrowDate", "2024-01-15");
//        record1.put("dueDate", "2024-02-15");
//        record1.put("status", "borrowed");
//        records.add(record1);
//
//        Map<String, Object> result = new HashMap<>();
//        result.put("success", true);
//        result.put("data", records);
//
//        response.getWriter().write(objectMapper.writeValueAsString(result));
//    }
//
//    private void handleAddUser(Map<String, Object> requestData, HttpServletResponse response) throws IOException {
//        // 模拟添加用户 - 在实际应用中应该保存到数据库
//        String name = (String) requestData.get("name");
//        String number = (String) requestData.get("number");
//        String email = (String) requestData.get("email");
//
//        Map<String, Object> result = new HashMap<>();
//        result.put("success", true);
//        result.put("message", "用户添加成功");
//
//        response.getWriter().write(objectMapper.writeValueAsString(result));
//    }
//
//    private void handleAddBook(Map<String, Object> requestData, HttpServletResponse response) throws IOException {
//        // 模拟添加图书 - 在实际应用中应该保存到数据库
//        String title = (String) requestData.get("title");
//        String author = (String) requestData.get("author");
//        String isbn = (String) requestData.get("isbn");
//        Integer stock = (Integer) requestData.get("stock");
//
//        Map<String, Object> result = new HashMap<>();
//        result.put("success", true);
//        result.put("message", "图书添加成功");
//
//        response.getWriter().write(objectMapper.writeValueAsString(result));
//    }
//
//    private void handleEditUser(Map<String, Object> requestData, HttpServletResponse response) throws IOException {
//        // 模拟编辑用户 - 在实际应用中应该更新数据库
//        Integer id = (Integer) requestData.get("id");
//        String name = (String) requestData.get("name");
//        String number = (String) requestData.get("number");
//        String email = (String) requestData.get("email");
//        String status = (String) requestData.get("status");
//
//        Map<String, Object> result = new HashMap<>();
//        result.put("success", true);
//        result.put("message", "用户信息更新成功");
//
//        response.getWriter().write(objectMapper.writeValueAsString(result));
//    }
//
//    private void handleEditBook(Map<String, Object> requestData, HttpServletResponse response) throws IOException {
//        // 模拟编辑图书 - 在实际应用中应该更新数据库
//        Integer id = (Integer) requestData.get("id");
//        String title = (String) requestData.get("title");
//        String author = (String) requestData.get("author");
//        String isbn = (String) requestData.get("isbn");
//        Integer stock = (Integer) requestData.get("stock");
//
//        Map<String, Object> result = new HashMap<>();
//        result.put("success", true);
//        result.put("message", "图书信息更新成功");
//
//        response.getWriter().write(objectMapper.writeValueAsString(result));
//    }
//
//    private void handleDeleteUser(Map<String, Object> requestData, HttpServletResponse response) throws IOException {
//        // 模拟删除用户 - 在实际应用中应该从数据库删除
//        Integer id = (Integer) requestData.get("id");
//
//        Map<String, Object> result = new HashMap<>();
//        result.put("success", true);
//        result.put("message", "用户删除成功");
//
//        response.getWriter().write(objectMapper.writeValueAsString(result));
//    }
//
//    private void handleDeleteBook(Map<String, Object> requestData, HttpServletResponse response) throws IOException {
//        // 模拟删除图书 - 在实际应用中应该从数据库删除
//        Integer id = (Integer) requestData.get("id");
//
//        Map<String, Object> result = new HashMap<>();
//        result.put("success", true);
//        result.put("message", "图书删除成功");
//
//        response.getWriter().write(objectMapper.writeValueAsString(result));
//    }
//
//    private void handleReturnBook(Map<String, Object> requestData, HttpServletResponse response) throws IOException {
//        // 模拟归还图书 - 在实际应用中应该更新数据库
//        Integer recordId = (Integer) requestData.get("recordId");
//
//        Map<String, Object> result = new HashMap<>();
//        result.put("success", true);
//        result.put("message", "图书归还成功");
//
//        response.getWriter().write(objectMapper.writeValueAsString(result));
//    }
//}
