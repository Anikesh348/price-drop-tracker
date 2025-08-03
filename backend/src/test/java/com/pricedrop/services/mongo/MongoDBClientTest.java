package com.pricedrop.services.mongo;

import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class MongoDBClientTest {
    @Test
    void testUnwrapCauseReturnsRoot() {
        Exception inner = new Exception("root");
        Exception outer = new Exception("outer", inner);
        MongoDBClient client = new MongoDBClient(Vertx.vertx(), new JsonObject());
        java.lang.reflect.Method m;
        try {
            m = MongoDBClient.class.getDeclaredMethod("unwrapCause", Throwable.class);
            m.setAccessible(true);
            Throwable result = (Throwable) m.invoke(client, outer);
            assertEquals(inner, result);
        } catch (Exception e) {
            fail(e);
        }
    }
}
