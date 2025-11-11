package com.library.init;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.library.userClass.BookType;
import com.library.userClass.Detail;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class WebMethods {
    private static final File typeTransformFile = new File("src/main/resources/type_transform.json");
    private static final ObjectMapper objectMapper = new ObjectMapper();
    private static final Map<String, BookType> bookTypeMap = new HashMap<>();
    static {
        try {
            Map<String, String> typeTransform = objectMapper.readValue(typeTransformFile, Map.class);
            for (Map.Entry<String, String> entry : typeTransform.entrySet()) {
                bookTypeMap.put(entry.getValue(), BookType.valueOf(entry.getKey()));
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static void redirect(HttpServletRequest request, HttpServletResponse response) throws jakarta.servlet.ServletException, IOException {
        response.setContentType("text/plain;charset=UTF-8");
        String name = "/Library";
        response.setStatus(HttpServletResponse.SC_FOUND);
        response.setHeader("Location", name);
    }

    public static BookType[] bookTypesTransform(String[] bookTypes) {

        BookType[] bookTypesTrans = new BookType[bookTypes.length];
        for (int i = 0; i < bookTypes.length; i++) {
            bookTypesTrans[i] = bookTypeMap.get(bookTypes[i]);
        }
        return bookTypesTrans;
    }
}
