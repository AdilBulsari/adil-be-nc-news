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
          console.log(res.body);
          expect(res.body).toEqual({ topic: obj });
        });
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200 :returns article by id", () => {
    const id = [
      {
        article_id: 12,
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: "2020-10-11T11:24:00.000Z",
        votes: 0,
      },
    ];
    return request(app)
      .get("/api/articles/12")
      .send(id)
      .expect(200)
      .then((res) => {
        console.log(res.body);
        expect(res.body).toEqual({ topic: id });
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200 :patch article votes", () => {
    const updateArticleVote = { inc_votes: -100 };

    return request(app)
      .patch("/api/articles/12")
      .send(updateArticleVote)
      .expect(200)
      .then((res) => {
        console.log(res.body);
        expect(res.body).toEqual({
          article: {
            article_id: 12,
            title: "Moustache",
            topic: "mitch",
            author: "butter_bridge",
            body: "Have you seen the size of that thing?",
            created_at: "2020-10-11T11:24:00.000Z",
            votes: -100,
          },
        });
      });
  });
});
