package com.pricedrop.services.leetcode;

import com.pricedrop.Utils.Utility;
import com.pricedrop.services.mongo.MongoDBClient;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class GetQuestions {
    private static final Logger log = LoggerFactory.getLogger(GetQuestions.class);
    private final MongoDBClient mongoDBClient;

    public GetQuestions(MongoDBClient mongoDBClient) {
        this.mongoDBClient = mongoDBClient;
    }

    public void handle(RoutingContext context) {
        String userId = context.get("userId");

        JsonObject query = new JsonObject().put("userId", userId);

        mongoDBClient.queryRecords(query, "leetcode").onSuccess(res -> {
            log.info("Fetched {} questions for user {}", res.size(), userId);
            Utility.buildResponse(context, 200, res);
        }).onFailure(fail -> {
            log.error("Error fetching leetcode questions: {}", fail.getMessage());
            Utility.buildResponse(context, 500, Utility.createErrorResponse("Error fetching questions"));
        });
    }
}
