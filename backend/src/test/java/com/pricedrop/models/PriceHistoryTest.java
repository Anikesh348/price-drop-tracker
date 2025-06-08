package com.pricedrop.models;

import org.junit.jupiter.api.Test;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;

class PriceHistoryTest {
    @Test
    void testGettersAndSetters() {
        PriceHistory h = new PriceHistory();
        h.setProductId("pid");
        h.setProductName("name");
        h.setProductUrl("url");
        h.setProductPrice("price");
        Instant now = Instant.now();
        h.setCaptureTime(now);
        h.setUserId("uid");

        assertEquals("pid", h.getProductId());
        assertEquals("name", h.getProductName());
        assertEquals("url", h.getProductUrl());
        assertEquals("price", h.getProductPrice());
        assertEquals(now, h.getCaptureTime());
        assertEquals("uid", h.getUserId());
    }
}
