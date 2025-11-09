package com.library.servlet;

import com.library.init.User;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

import java.io.IOException;

@WebServlet(name = "Register", value = "/register")
public class Register extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html");
        response.setContentType("text/plain;charset=UTF-8");
        String name = "/Library";
        response.setStatus(HttpServletResponse.SC_FOUND);
        response.setHeader("Location", name);
    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("name");
        String password = request.getParameter("password");

        if (username == null || password == null) {
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\": false, \"message\": \"请输入用户名和密码\"}");
            return;
        }

        if (User.getDataBase().AddUser(username, password)) {
            String uniqueCode = Integer.toString(User.getDataBase().getUniquecode(username, password));

            HttpSession session = request.getSession();
            session.setAttribute("username", username);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\": true, \"message\": \"注册成功\", \"redirect\": \"/Library/home.html?name="+ username + "\",\"uniquecode\":\""+uniqueCode+"\"}");
        } else {
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\": false, \"message\": \"注册失败\"}");
        }
    }
}