package com.pricedrop.services.products;

import com.mongodb.MongoSocketReadException;
import com.pricedrop.models.Product;
import com.pricedrop.services.alerts.AlertClient;
import com.pricedrop.services.batchprocessor.BatchProcessor;
import com.pricedrop.services.batchprocessor.SaveHistoryAndAlertBatchProcessor;
import com.pricedrop.services.mongo.MongoDBClient;
import com.pricedrop.services.scrape.ScrapperClient;
import io.vertx.core.Vertx;
import io.vertx.core.json.JsonObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

import static com.pricedrop.Utils.Utility.*;

public class ProductChecker {
    private static final Logger log = LoggerFactory.getLogger(ProductChecker.class);
    MongoDBClient mongoDBClient;
    ScrapperClient scrapperClient;
    Vertx vertx;
    public ProductChecker(MongoDBClient mongoDBClient, Vertx vertx,  ScrapperClient scrapperClient) {
        this.mongoDBClient = mongoDBClient;
        this.scrapperClient = scrapperClient;
        this.vertx = vertx;
    }
    public void checkAllProducts() {
        mongoDBClient.queryRecords(new JsonObject(), "products")
                .onSuccess(productList -> {
                    List<Product> products = productList.stream().map(productJson
                            -> castToClass(productJson, Product.class)).toList();
                    BatchProcessor<Product> batchProcessor = new SaveHistoryAndAlertBatchProcessor(mongoDBClient,
                            vertx, scrapperClient);
                    batchProcessor.handleBatch(0, products);
                })
                .onFailure(fail -> log.error("Failed to fetch products from DB: {}", fail.getMessage()));
    }

    private Throwable unwrapCause(Throwable throwable) {
        while (throwable.getCause() != null) {
            throwable = throwable.getCause();
        }
        return throwable;
    }

}
