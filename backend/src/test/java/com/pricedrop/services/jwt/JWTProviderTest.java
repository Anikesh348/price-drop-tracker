package com.pricedrop.services.jwt;

import com.auth0.jwt.interfaces.DecodedJWT;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JWTProviderTest {
    @Test
    void testGenerateAndVerify() {
        String token = JWTProvider.generateToken("user", "id");
        assertNotNull(token);
        DecodedJWT decoded = JWTProvider.verifyToken(token);
        assertEquals("user", decoded.getClaim("userName").asString());
        assertEquals("id", decoded.getClaim("userId").asString());
    }
}
