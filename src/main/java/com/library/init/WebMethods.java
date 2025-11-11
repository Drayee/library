package com.library.init;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;

public class WebMethods {
    public static void redirect(HttpServletRequest request, HttpServletResponse response) throws jakarta.servlet.ServletException, IOException {
        response.setContentType("text/plain;charset=UTF-8");
        String name = "/Library";
        response.setStatus(HttpServletResponse.SC_FOUND);
        response.setHeader("Location", name);
    }
}
