package com.pricedrop.services.user;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PasswordUtilTest {
    @Test
    void testHashAndCheckPassword() {
        String pwd = "secret";
        String hashed = PasswordUtil.hashPassword(pwd);
        assertNotNull(hashed);
        assertTrue(PasswordUtil.checkPassword(pwd, hashed));
        assertFalse(PasswordUtil.checkPassword("wrong", hashed));
    }
}
