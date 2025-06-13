package com.pricedrop.verticles;

import com.pricedrop.services.products.ProductChecker;
import io.vertx.core.Vertx;
import io.vertx.junit5.VertxExtension;
import io.vertx.junit5.VertxTestContext;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;

@ExtendWith(VertxExtension.class)
class PriceCheckSchedulerVerticleTest {
    @Test
    void testPeriodicCall(Vertx vertx, VertxTestContext testContext) {
        ProductChecker checker = Mockito.mock(ProductChecker.class);
        vertx.deployVerticle(new PriceCheckSchedulerVerticle(checker), ar -> {
            vertx.setTimer(10, id -> {
                Mockito.verify(checker, Mockito.atLeastOnce()).checkAllProducts();
                testContext.completeNow();
            });
        });
        testContext.awaitCompletion(2000);
    }
}
