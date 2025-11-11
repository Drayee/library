package com.library.servlet;

import com.library.init.User;
import com.library.init.WebMethods;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

import java.io.IOException;

@WebServlet(name = "Login", value = "/login")
public class Login extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        WebMethods.redirect(request, response);
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
        if (User.getDataBase().checkUser(username, password)) {
            String uniqueCode = Integer.toString(User.getDataBase().getUniquecode(username, password));

            HttpSession session = request.getSession();
            session.setAttribute("username", username);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\": true, \"message\": \"登录成功\", \"redirect\": \"/Library/home.html?name="+username+"\",\"uniquecode\":\""+uniqueCode+"\"}");
        } else {
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"success\": false, \"message\": \"登录失败\"}");
        }
    }
}