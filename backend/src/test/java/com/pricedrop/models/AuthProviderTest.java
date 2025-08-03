package com.pricedrop.models;

import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class AuthProviderTest {
    @Test
    void testGettersAndSetters() {
        Instant now = Instant.now();
        AuthProvider a = new AuthProvider("uid", "local", "user", "e", now, now, "hp");
        a.setUserId("u2");
        a.setProvider("p");
        a.setProviderUserId("pu");
        a.setEmail("mail");
        a.setCreatedAt(now);
        a.setUpdatedAt(now);
        a.setHashedPassword("hash");

        assertEquals("u2", a.getUserId());
        assertEquals("p", a.getProvider());
        assertEquals("pu", a.getProviderUserId());
        assertEquals("mail", a.getEmail());
        assertEquals(now, a.getCreatedAt());
        assertEquals(now, a.getUpdatedAt());
        assertEquals("hash", a.getHashedPassword());
    }
}
