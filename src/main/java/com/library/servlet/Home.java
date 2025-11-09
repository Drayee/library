package com.library.servlet;

import com.library.init.BookShelf;
import com.library.init.Library;
import com.library.init.User;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.*;

import java.io.IOException;

@WebServlet(name = "home", value = "/home")
public class Home extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    }

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String username = request.getParameter("username");
        String uniquecodeStr = request.getParameter("uniquecode");
        
        response.setContentType("application/json;charset=UTF-8");
        
        try {
            if (username == null || uniquecodeStr == null) {
                response.getWriter().write("{\"message\":\"ERROR\",\"error\":\"缺少必要参数\"}");
                return;
            }
            
            int uniquecode = Integer.parseInt(uniquecodeStr);
            
            if (User.getDataBase().checkUser(username, uniquecode)) {
                String bookstr = BookShelf.getBooks(Library.getDataBase().getLendBook(User.getDataBase().getUserID(username)));
                response.getWriter().write("{\"message\":\"OK\",\"books\":" + bookstr + "}");
            } else {
                response.getWriter().write("{\"message\":\"ERROR\",\"error\":\"用户验证失败\"}");
            }
        } catch (NumberFormatException e) {
            response.getWriter().write("{\"message\":\"ERROR\",\"error\":\"uniquecode参数格式错误\"}");
        } catch (Exception e) {
            response.getWriter().write("{\"message\":\"ERROR\",\"error\":\"服务器内部错误\"}");
        }
    }
}