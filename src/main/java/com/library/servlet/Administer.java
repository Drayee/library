package com.library.servlet;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.library.init.BookShelf;
import com.library.init.WebMethods;
import com.library.userClass.BookType;
import com.library.userClass.Detail;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

import java.io.IOException;
import java.util.*;
import java.util.List;

@WebServlet(name = "Administer", value = "/Administer")
public class Administer extends HttpServlet {
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        WebMethods.redirect(request, response);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        StringBuilder requestBody = new StringBuilder();
        String line;
        while ((line = request.getReader().readLine()) != null) {
            requestBody.append(line);
        }

        System.out.println(requestBody);

        Map<String ,Object> requestParams = objectMapper.readValue(requestBody.toString(), Map.class);
        String action = (String) requestParams.get("action");
        switch (action) {
                case "login":
                    login(response, requestParams);
                    return;
                case "getUsers":
                    getUser(response);
                    break;
                case "getBooks":
                    getBook(response);
                    break;
                case "addUser":
                    addUser(response, requestParams);
                    break;
                case "addBook":
                    addBook(response, requestParams);
                    break;
                case "getBorrowRecords":
                    getBorrowRecords(response);
                    break;
                default:
                    response.setContentType("application/json;charset=UTF-8");
                    response.getWriter().write("{\"success\": false, \"message\": \"未知操作\"}");
                    break;

        }

    }

    private void login(HttpServletResponse response, Map<String, Object> requestParams) throws IOException {
        String username = (String) requestParams.get("username");
        String password = (String) requestParams.get("password");

        Random seed = new Random();
        int uniqueId = seed.nextInt(2147483647);
        WebMethods.setUniqueId(uniqueId);
        Cookie uniqueCookie = new Cookie("uniqueId", Integer.toString(uniqueId));
        response.addCookie(uniqueCookie);

        if (username.equals("admin") && password.equals("123456")) {
            response.setContentType("application/json;charset=UTF-8");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"success\": true, \"message\": \"登录成功\"}");
        } else {
            response.setContentType("application/json;charset=UTF-8");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write("{\"success\": false, \"message\": \"你可能进错了网站\"}");
        }
    }

    private void getUser(HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        try {
            List<Map<String , Object>> list = new ArrayList<>();
            Map<Integer, Object> users = WebMethods.getUsers();
            if (users != null) {
                for (Map.Entry<Integer, Object> user : users.entrySet()) {
                    Map<String, Object> map = (Map<String, Object>) user.getValue();
                    map.put("id", user.getKey());
                    map.put("username", map.get("name"));
                    map.put("email", map.get("email"));
                    map.put("studentid", map.get("studentid"));
                    map.put("status", "active");
                    list.add(map);
                }
            }
            response.getWriter().write("{\"success\": true, \"message\": \"获取成功\", \"data\": " + objectMapper.writeValueAsString(list) + "}");
        }
        catch (Exception e) {
            response.getWriter().write("{\"success\": false, \"message\": \"获取失败\", \"data\": " + e.getMessage() + "}");
        }
    }

    private void getBorrowRecords(HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        try {
            List<Map<String , Object>> list = new ArrayList<>();
            Map<Integer, Object> records = WebMethods.getBorrowRecords();
            if (records != null) {
                for (Map.Entry<Integer, Object> record : records.entrySet()) {
                    Map<String, Object> map = (Map<String, Object>) record.getValue();
                    map.put("id", record.getKey());
                    list.add(map);
                }
            }
            response.getWriter().write("{\"success\": true, \"message\": \"获取成功\", \"data\": " + objectMapper.writeValueAsString(list) + "}");
        }
        catch (Exception e) {
            response.getWriter().write("{\"success\": false, \"message\": \"获取失败\", \"data\": " + e.getMessage() + "}");
        }
    }

    private void getBook(HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");

        List<Map<String , Object>> list = new ArrayList<>();
        Detail[] books = BookShelf.getAllBooks();
        books = WebMethods.DetailToDetails(books);
        for (Detail detail : books) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", detail.bookIds()[0]);
            map.put("title", detail.bookName());
            map.put("author", detail.bookAuthor());
            map.put("isbn", detail.bookNum());
            map.put("stock", detail.bookNum());
            map.put("status", detail.bookLendNum() == detail.bookNum() ? "unavailable" : "available");
            list.add(map);
        }
        try {
            response.getWriter().write("{\"success\": true, \"message\": \"获取成功\", \"data\": " + objectMapper.writeValueAsString(list) + "}");
        }
        catch (Exception e) {
            response.getWriter().write("{\"success\": false, \"message\": \"获取失败\", \"data\": " + e.getMessage() + "}");
        }
    }

    private void addUser(HttpServletResponse response, Map<String, Object> requestParams) throws IOException {
        Map<String, Object> data = (Map<String, Object>) requestParams.get("data");
        String name = (String) data.get("name");
        String email = (String) data.get("email");
        String studentid = (String) data.get("studentid");
        boolean isSuccess = WebMethods.addUser(name,email,studentid);
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        if (isSuccess) {
            response.getWriter().write("{\"success\": true, \"message\": \"添加成功\"}");
        }
        else {
            response.getWriter().write("{\"success\": false, \"message\": \"添加失败\"}");
        }
    }

    private void addBook(HttpServletResponse response, Map<String, Object> requestParams) throws IOException {
        Map<String, Object> data = (Map<String, Object>) requestParams.get("data");
        String title = (String) data.get("title");
        String author = (String) data.get("author");
        int isbn = (int) (Long.parseLong((String)data.get("isbn")));
        int campus = (int) (Long.parseLong((String)data.get("campus")));
        int floor = (int) (Long.parseLong((String)data.get("floor")));
        int shelf = (int) (Long.parseLong((String)data.get("shelf")));
        String[] bookTypes = ((ArrayList<String>) data.get("bookTypes")).toArray(new String[0]);
        BookType[] bookTypesTrans = WebMethods.bookTypesTransform(bookTypes);
        boolean isSuccess = BookShelf.getDataBase().addBook(new Detail(new int[]{isbn},title,
                1,0, null,author,
                new int[][]{new int[]{campus,floor,shelf}},
                bookTypesTrans, new Date()));
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");
        if (isSuccess) {
            response.getWriter().write("{\"success\": true, \"message\": \"添加成功\"}");
        }
        else {
            response.getWriter().write("{\"success\": false, \"message\": \"添加失败\"}");
        }
    }


}