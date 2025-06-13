package com.pricedrop.models;

import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {
    @Test
    void testGettersAndSetters() {
        User user = new User();
        user.setUserName("name");
        user.setEmail("e@example.com");
        user.setName("full");
        user.setUserId("id");
        Instant now = Instant.now();
        user.setCreatedAt(now);
        user.setUpdatedAt(now);

        assertEquals("name", user.getUserName());
        assertEquals("e@example.com", user.getEmail());
        assertEquals("full", user.getName());
        assertEquals("id", user.getUserId());
        assertEquals(now, user.getCreatedAt());
        assertEquals(now, user.getUpdatedAt());
    }
}
