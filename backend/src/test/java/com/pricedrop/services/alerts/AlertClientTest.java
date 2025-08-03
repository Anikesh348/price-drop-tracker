package com.pricedrop.services.alerts;

import com.pricedrop.models.Product;
import com.pricedrop.models.User;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AlertClientTest {
    @Test
    void testCreateBodyIncludesFields() {
        Vertx vertx = Vertx.vertx();
        User user = new User();
        user.setEmail("e@mail.com");
        Product p = new Product();
        p.setProductUrl("http://url");
        JsonObject info = new JsonObject().put("price", "100").put("title", "t");
        AlertClient client = new AlertClient(user, info, p, vertx);
        String body = client.createBody();
        assertTrue(body.contains("t"));
        assertTrue(body.contains("http://url"));
        vertx.close();
    }
}
