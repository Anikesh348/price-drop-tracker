package com.pricedrop.services.leetcode;

import com.pricedrop.Utils.Utility;
import com.pricedrop.models.LeetCodeQuestion;
import com.pricedrop.services.mongo.MongoDBClient;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.RoutingContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class AddQuestion {
    private static final Logger log = LoggerFactory.getLogger(AddQuestion.class);
    private final MongoDBClient mongoDBClient;

    public AddQuestion(MongoDBClient mongoDBClient) {
        this.mongoDBClient = mongoDBClient;
    }

    public void handle(RoutingContext context) {
        try {
            JsonObject body = context.body().asJsonObject();
            String userId = context.get("userId"); 

            JsonArray urls = body.getJsonArray("questionUrls");
            if (urls == null || urls.isEmpty()) {
                Utility.buildResponse(context, 400, Utility.createErrorResponse("No question URLs provided"));
                return;
            }

            List<JsonObject> inserted = new ArrayList<>();

            for (int i = 0; i < urls.size(); i++) {
                String url = urls.getString(i);

                LeetCodeQuestion question = new LeetCodeQuestion();
                question.setQuestionId(UUID.randomUUID().toString());
                question.setUrl(url);
                question.setSolved(false); 
                question.setUserId(userId);
                question.setCreatedAt(Instant.now());
                question.setUpdatedAt(Instant.now());

                JsonObject doc = JsonObject.mapFrom(question);
                inserted.add(doc);

                mongoDBClient.insertRecord(doc, "leetcode").onFailure(fail -> {
                    log.error("Failed to insert question {}: {}", url, fail.getMessage());
                });
            }

            JsonObject response = new JsonObject()
                    .put("success", true)
                    .put("addedQuestions", inserted);

            Utility.buildResponse(context, 200, response);

        } catch (Exception e) {
            log.error("Exception in AddQuestion", e);
            Utility.buildResponse(context, 500, Utility.createErrorResponse("Internal server error"));
        }
    }
}
