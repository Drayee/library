package com.library.userClass;

import java.util.Date;

public record Detail(
        int[] bookIds,
        String bookName,
        int bookNum,
        int bookLendNum,
        String bookAuthor,
        int[][] bookAddresses,
        BookType[] bookType,
        Date date
) {
}
