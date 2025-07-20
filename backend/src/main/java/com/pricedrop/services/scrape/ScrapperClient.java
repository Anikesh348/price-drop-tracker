package com.pricedrop.services.scrape;

import com.pricedrop.models.Product;
import io.github.cdimascio.dotenv.Dotenv;
import io.vertx.core.Future;
import io.vertx.core.Promise;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.client.HttpRequest;
import io.vertx.ext.web.client.WebClient;
import io.vertx.ext.web.client.impl.HttpRequestImpl;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class ScrapperClient {
    private static final Logger log = LoggerFactory.getLogger(ScrapperClient.class);
    private final String scrapperUrl;
    WebClient client;
    public ScrapperClient(WebClient client) {
        this.client = client;
        Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
        String defaultUrl = dotenv.get("SCRAPPER_URL", "");
        this.scrapperUrl = System.getenv().getOrDefault("SCRAPPER_URL", defaultUrl);
    }

    public Future<JsonObject> getScrappedProductDetails(Product product) {
        Promise<JsonObject> promise = Promise.promise();

        JsonObject requestBody = new JsonObject().put("url", product.getProductUrl());
        log.info("Sending request to scrapper for product: {}", product.getProductId());
        client.postAbs(scrapperUrl)
                .sendJsonObject(requestBody)
                .onSuccess(res -> {
                    String resString = res.bodyAsString();
                    if (resString == null || resString.isEmpty()) {
                        log.error("Empty response body from scrapper for product: {}", product.getProductUrl());
                        promise.fail("Empty response body");
                        return;
                    }
                    try {
                        JsonObject productInfo = res.bodyAsJsonObject();

                        if (productInfo.getString("price") == null
                                || productInfo.getString("title") == null
                                || productInfo.getString("price").isEmpty()
                                || productInfo.getString("title").isEmpty()) {
                            log.error("Invalid product info from scrapper: {}", productInfo.encodePrettily());
                            promise.fail("Invalid response from scrapper");
                            return;
                        }

                        JsonObject result = new JsonObject()
                                .put("productInfo", productInfo)
                                .put("product", JsonObject.mapFrom(product));
                        promise.complete(result);
                    } catch (Exception e) {
                        log.error("Error parsing response from scrapper: {}", e.getMessage());
                        promise.fail(e);
                    }
                })
                .onFailure(err -> {
                    log.error("Failed to fetch scrapped data: {}", err.getMessage());
                    promise.fail(err);
                });

        return promise.future();
    }
}
