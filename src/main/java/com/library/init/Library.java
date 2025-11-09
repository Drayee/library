package com.library.init;

import com.library.database.IDataBase;
import com.library.database.LibraryDataBase;

import java.util.ArrayList;

public class Library extends InitDataBase {
    private static final LibraryDataBase dataBase;

    static {
        dataBase = new LibraryDataBase();
    }

    public static LibraryDataBase getDataBase() {
        return dataBase;
    }

    public static boolean lend(int id, int bookId) {
        return dataBase.lend(id, bookId);
    }

    public static boolean returned(int bookId) {
        return dataBase.returned(bookId);
    }
}
