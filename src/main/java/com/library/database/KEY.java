package com.library.database;

public record KEY(String name, int value) {
    public KEY(String name, int value) {
        this.name = name;
        this.value = value;
    }

    public boolean equals(KEY other) {
        return this.name.equals(other.name) && this.value == other.value;
    }
}
