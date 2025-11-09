package com.library.init;

import com.library.database.IDataBase;
import com.library.database.UserDataBase;

public class User extends InitDataBase {
    private static final UserDataBase dataBase;

    public static UserDataBase getDataBase() {
        return dataBase;
    }

    static {
        dataBase = new UserDataBase();
    }
}
