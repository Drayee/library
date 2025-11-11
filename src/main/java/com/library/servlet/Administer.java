package com.library.servlet;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.library.database.BookShelfBase;
import com.library.init.BookShelf;
import com.library.init.WebMethods;
import com.library.userClass.BookType;
import com.library.userClass.Detail;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

import java.awt.*;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

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
                break;
            case "getBooks":
                break;
            case "addBook":
                addBook(response, requestParams);
                break;
            default:
                response.setContentType("application/json;charset=UTF-8");
                response.getWriter().write("{\"success\": false, \"message\": \"未知操作\"}");
        }

    }

    private void login(HttpServletResponse response, Map<String, Object> requestParams) throws IOException {
        String username = (String) requestParams.get("username");
        String password = (String) requestParams.get("password");

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

    private void getBook(HttpServletResponse response) throws IOException {
        response.setContentType("application/json;charset=UTF-8");
        response.setCharacterEncoding("UTF-8");


    }

    private void addBook(HttpServletResponse response, Map<String, Object> requestParams) throws IOException {
        Map<String, Object> data = (Map<String, Object>) requestParams.get("data");
        String title = (String) data.get("title");
        String author = (String) data.get("author");
        int isbn = (int) (Long.parseLong((String)data.get("isbn")));
        int campus = (int) (Long.parseLong((String)data.get("campus")));
        int floor = (int) (Long.parseLong((String)data.get("floor")));
        int shelf = (int) (Long.parseLong((String)data.get("shelf")));
        String[] bookTypes = (String[]) data.get("bookTypes");
        BookType[] bookTypesTrans = WebMethods.bookTypesTransform(bookTypes);
        boolean isSuccess = BookShelf.getDataBase().addBook(new Detail(new int[]{isbn},title,
                1,1, author,
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