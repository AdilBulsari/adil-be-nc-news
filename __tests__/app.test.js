const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const {
  topicData,
  userData,
  commentData,
  articleData,
} = require("../db/data/test-data/index");

beforeAll(() => {
  return seed({
    topicData,
    userData,
    commentData,
    articleData,
  });
});

afterAll(() => db.end());

describe("App test", () => {
  describe("GET /api/topics", () => {
    test("200 :returns topic", () => {
      const obj = [
        { slug: "mitch", description: "The man, the Mitch, the legend" },
        { slug: "cats", description: "Not dogs" },
        { slug: "paper", description: "what books are made of" },
      ];
      return request(app)
        .get("/api/topics")
        .send(obj)
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({ topic: obj });
        });
    });
    test("route that does not exist: 404 Not Found", () => {
      return request(app)
        .get("/api/topicz")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toBe("does not exist");
        });
    });
  });
});

describe("/api/articles/:article_id", () => {
  const expectedArticle = {
    article_id: 1,
    title: "Living in the shadow of a great man",
    topic: "mitch",
    author: "butter_bridge",
    body: "I find this existence challenging",
    created_at: "2020-07-09T20:11:00.000Z",
    votes: 100,
    total_comments: 11,
  };
  test("200 :returns article by id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article).toEqual(expectedArticle);
      });
  });
  test("200 :returns totalNumber of comments using article id", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body: { article } }) => {
        expect(article.total_comments).toBe(11);
        expect(typeof article.total_comments).toBe("number");
      });
  });
  test("status:400, responds with an error message when passed a bad user ID", () => {
    return request(app)
      .get("/api/articles/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("id must be a number");
      });
  });
  test("status:404, responds with an error message does not exist", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("does not exist");
      });
  });
});
