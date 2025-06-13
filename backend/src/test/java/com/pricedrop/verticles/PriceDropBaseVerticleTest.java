package com.pricedrop.verticles;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class PriceDropBaseVerticleTest {
    @Test
    void testLoadSchema() {
        PriceDropBaseVerticle v = new PriceDropBaseVerticle();
        String schema = v.loadSchema("schemas/register-schema.json");
        assertNotNull(schema);
        assertTrue(schema.contains("userName"));
    }
}
