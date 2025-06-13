package com.pricedrop.Utils;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UtilityTest {
    @Test
    void testGenerateProductIdDeterministic() {
        String url = "https://example.com/product";
        String id1 = Utility.generateProductId(url);
        String id2 = Utility.generateProductId(url);
        assertEquals(id1, id2);
        assertEquals(64, id1.length());
    }

    @Test
    void testExtractPrice() {
        assertEquals(1234, Utility.extractPrice("Rs.1,234.56"));
    }

    @Test
    void testFormatToINR() {
        String formatted = Utility.formatToINR("1234.56");
        assertTrue(formatted.contains("₹") || formatted.contains("Rs"));
    }
}
