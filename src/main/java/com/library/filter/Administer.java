package com.library.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import jakarta.servlet.annotation.WebFilter;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;


@WebFilter("/Administer")
public class Administer implements Filter {

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;
        Cookie[] cookies = request.getCookies();
        int uniqueId = -1;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().equals("uniqueId")) {
                    uniqueId = Integer.parseInt(cookie.getValue());
                    break;}}}
        if (uniqueId == -1) {

        }
        filterChain.doFilter(request, response);
    }
}
