package com.pricedrop.verticles;

import com.pricedrop.middlewares.AuthHandler;
import com.pricedrop.services.products.SaveProduct;
import com.pricedrop.services.mongo.MongoDBClient;
import com.pricedrop.services.schedule.Schedule;
import com.pricedrop.services.user.UserManagement;
import io.github.cdimascio.dotenv.Dotenv;
import io.vertx.core.AbstractVerticle;
import io.vertx.core.Promise;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.client.WebClient;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CorsHandler;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.InputStream;


public class PriceDropBaseVerticle extends AbstractVerticle {
    private static final Logger log = LoggerFactory.getLogger(PriceDropBaseVerticle.class);
    private MongoDBClient mongoDBClient;
    private WebClient client;

    @Override
    public void start(Promise<Void> startFuture) {
        try {
            vertx.executeBlocking(() -> {
                JsonObject mongoConfig = loadMongoConfig();
                Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
                String mongoDbUrl = dotenv.get("DB_URL");
                mongoConfig.put("connection_string", mongoDbUrl);
                log.info("mongoConfig {}", mongoConfig);
                return mongoConfig;
            }).onSuccess(mongoConfig -> {
                mongoDBClient = new MongoDBClient(vertx, mongoConfig);
                mongoDBClient.pingConnection().onSuccess(res -> {
                    this.client = WebClient.create(vertx);
                    Router router = Router.router(vertx);
                    router.route().handler(
                            CorsHandler.create()
                                    .allowedMethod(HttpMethod.GET)
                                    .allowedMethod(HttpMethod.POST)
                                    .allowedMethod(HttpMethod.OPTIONS)
                                    .allowedHeader("Content-Type")
                                    .allowedHeader("Authorization")
                    );
                    router.route().handler(BodyHandler.create());
                    UserManagement userManagement = new UserManagement(mongoDBClient);
                    SaveProduct saveProduct = new SaveProduct(mongoDBClient);
                    router.post("/api/login").handler(userManagement::handleLogin);
                    router.post("/api/register").handler(userManagement::handleRegister);
                    router.route("/api/protected/*").handler(new AuthHandler());
                    router.post("/api/protected/save-product").handler(saveProduct::saveProduct);
                    router.get("/api/schedule").handler(context
                            -> Schedule.schedulePriceCheck(context, mongoDBClient, vertx, client));
                    vertx.createHttpServer()
                            .requestHandler(router)
                            .listen(8080)
                            .onSuccess(server -> {
                                log.info("Server started on port: {}", server.actualPort());
                                startFuture.complete();
                            }).onFailure(fail -> startFuture.fail(fail.getMessage()));
                }).onFailure(fail -> startFuture.fail(fail.getMessage()));
            }).onFailure(fail -> {
                log.error("failure in fetch mongo config {}", fail.getMessage());
                startFuture.fail(fail.getMessage());
            });
        } catch (Exception e) {
            log.error("Exception in starting the server {}", e.getMessage());
            startFuture.fail(e.getMessage());
        }
    }

    private JsonObject loadMongoConfig() throws Exception {
        try (InputStream is = getClass().getClassLoader().getResourceAsStream("mongo-config.json")) {
            if (is == null) {
                throw new RuntimeException("mongo-config.json not found in resources");
            }
            // Read stream and parse JSON
            return new JsonObject(new String(is.readAllBytes()));
        }
    }

    @Override
    public void stop(Promise<Void> stopPromise) {
        if (mongoDBClient.getMongoClient() != null) {
            mongoDBClient.getMongoClient().close();
        }
        if (client != null) {
            client.close();
        }
        stopPromise.complete();
    }

}
