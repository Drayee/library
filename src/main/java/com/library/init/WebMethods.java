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
//    private static final File typeTransformFile = new File("src/main/resources/type_transform.json");
//    private static final ObjectMapper objectMapper = new ObjectMapper();
//    private static final Map<String, BookType> bookTypeMap = new HashMap<>();
//    static {
//        try {
//            Map<String, String> typeTransform = objectMapper.readValue(typeTransformFile, Map.class);
//            for (Map.Entry<String, String> entry : typeTransform.entrySet()) {
//                bookTypeMap.put(entry.getValue(), BookType.valueOf(entry.getKey()));
//            }
//        } catch (IOException e) {
//            throw new RuntimeException(e);
//        }
//    }

    public static void redirect(HttpServletRequest request, HttpServletResponse response) throws jakarta.servlet.ServletException, IOException {
        response.setContentType("text/plain;charset=UTF-8");
        String name = "/Library";
        response.setStatus(HttpServletResponse.SC_FOUND);
        response.setHeader("Location", name);
    }

    public static BookType[] bookTypesTransform(String[] bookTypes) {

        System.out.println("book");
        BookType[] bookTypesTrans = new BookType[bookTypes.length];
        for (int i = 0; i < bookTypes.length; i++) {
            bookTypesTrans[i] = BookType.valueOf(bookTypes[i]);
        }
        return bookTypesTrans;
    }

    public static boolean addUser(String username, String email, String studentid) {
        if (User.getDataBase().AddUser(username, "123456")) {
            int id = User.getDataBase().getUserID(username);
            return UserBind.AddUser(id, email, studentid);
        }
        return false;
    }

    public static Map<Integer, Object> getUsers() {
        try{
            Map<Integer, String> users = User.getDataBase().getAllUsers();
            Map<Integer, Object> usersInfo = new HashMap<>();
            for (Map.Entry<Integer, String> user : users.entrySet()) {
                Map<String ,String> map = new HashMap<>();
                int id = user.getKey();
                String name = user.getValue();
                Map<String, Object> user_bind = UserBind.getUser(id);
                String email, studentid;
                email = user_bind.get("email") != null ? user_bind.get("email").toString() : "null";
                studentid = user_bind.get("studentid") != null ? user_bind.get("studentid").toString() : "null";
                map.put("name", name);
                map.put("email", email);
                map.put("studentid", studentid);
                usersInfo.put(user.getKey(), map);
            }return usersInfo;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
