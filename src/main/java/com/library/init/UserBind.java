package com.library.init;

import com.library.database.BindDataBase;

import java.util.Map;

public class UserBind extends InitDataBase {
    private final static BindDataBase dataBase;

    static {
        dataBase = new BindDataBase();
    }

    public static boolean AddUser(int iduser, String email, String studentid) {
        return dataBase.AddUser(iduser, email, studentid);
    }

    public static Map<String , Object> getUser(int iduser) {
        return dataBase.getUser(iduser);
    }

    public static BindDataBase getDataBase(){
        return dataBase;
    }
}
