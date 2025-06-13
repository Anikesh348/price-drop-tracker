package com.pricedrop.models;

import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ProductTest {
    @Test
    void testGettersAndSetters() {
        Product p = new Product();
        p.setProductId("id");
        p.setProductUrl("url");
        p.setUserIds(List.of("u1"));
        p.setTargetPrice("100");

        assertEquals("id", p.getProductId());
        assertEquals("url", p.getProductUrl());
        assertEquals(List.of("u1"), p.getUserIds());
        assertEquals("100", p.getTargetPrice());
    }
}
