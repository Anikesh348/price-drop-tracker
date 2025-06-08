package com.pricedrop.middlewares;

import com.pricedrop.services.jwt.JWTProvider;
import io.vertx.ext.web.RoutingContext;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;

class AuthHandlerTest {
    @Test
    void testHandleInvalidHeader() {
        RoutingContext ctx = mock(RoutingContext.class);
        when(ctx.request()).thenReturn(mock(io.vertx.core.http.HttpServerRequest.class));
        when(ctx.request().getHeader("Authorization")).thenReturn(null);
        when(ctx.response()).thenReturn(mock(io.vertx.core.http.HttpServerResponse.class));
        new AuthHandler().handle(ctx);
        verify(ctx).response();
    }

    @Test
    void testHandleValidToken() {
        String token = JWTProvider.generateToken("u","id");
        RoutingContext ctx = mock(RoutingContext.class);
        io.vertx.core.http.HttpServerRequest req = mock(io.vertx.core.http.HttpServerRequest.class);
        when(ctx.request()).thenReturn(req);
        when(req.getHeader("Authorization")).thenReturn("Bearer "+token);
        when(ctx.put(anyString(), any())).thenReturn(ctx);
        new AuthHandler().handle(ctx);
        verify(ctx).next();
    }
}
