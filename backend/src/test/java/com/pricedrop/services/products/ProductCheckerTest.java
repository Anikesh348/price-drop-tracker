package com.pricedrop.services.products;

import com.pricedrop.services.mongo.MongoDBClient;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class ProductCheckerTest {
    @Test
    void testUnwrapCause() throws Exception {
        ProductChecker checker = new ProductChecker(new MongoDBClient(Vertx.vertx(), new JsonObject()), Vertx.vertx());
        java.lang.reflect.Method m = ProductChecker.class.getDeclaredMethod("unwrapCause", Throwable.class);
        m.setAccessible(true);
        Exception inner = new Exception("inner");
        Exception outer = new Exception("outer", inner);
        Throwable root = (Throwable) m.invoke(checker, outer);
        assertEquals(inner, root);
    }
}
