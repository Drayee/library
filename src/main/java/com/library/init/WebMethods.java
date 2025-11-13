package com.library.init;

import com.library.userClass.BookType;
import com.library.userClass.Detail;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.IntStream;
import java.util.stream.Stream;

public class WebMethods {
    private static int uniqueId;

    public static int getUniqueId() {
        return uniqueId;
    }

    public static void setUniqueId(int uniqueId) {
        WebMethods.uniqueId = uniqueId;
    }

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

    public static Map<Integer, Object> getBorrowRecords() {
        try{
            Map<Integer, Object> records = new HashMap<>();

            return records;
        } catch (Exception e) {
            return null;
        }
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
            return null;
        }
    }

    public static Detail[] DetailToDetails(Detail[] details) {
        ArrayList<String> names = new ArrayList<>();
        ArrayList<Detail> detailsTrans = new ArrayList<>();

        Detail detailTemp;
        for (Detail detail : details) {
            if (detail == null) {
                continue;
            }
            if (!names.contains(detail.bookName())) {
                names.add(detail.bookName());
                detailsTrans.add(detail);
            }else {
                int index = names.indexOf(detail.bookName());
                detailTemp = detailsTrans.get(index);
                detailsTrans.set(index, new Detail(
                        IntStream.concat(IntStream.of(detailTemp.bookIds()), IntStream.of(detail.bookIds())).toArray(),
                        detailTemp.bookName(),
                        detailTemp.bookNum() + detail.bookNum(),
                        detailTemp.bookLendNum() + detail.bookLendNum(),
                        Stream.concat(Arrays.stream(detailTemp.isbn()), Arrays.stream(detail.isbn())).toArray(String[]::new),
                        detailTemp.bookAuthor(),
                        detailTemp.bookAddresses(),
                        detailTemp.bookType(),
                        detailTemp.date()
                ));
            }
        }
        return detailsTrans.toArray(new Detail[0]);
    }
}
