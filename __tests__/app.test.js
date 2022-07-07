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
      const topics = [
        { slug: "mitch", description: "The man, the Mitch, the legend" },
        { slug: "cats", description: "Not dogs" },
        { slug: "paper", description: "what books are made of" },
      ];
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((res) => {
          expect(res.body).toEqual({ topic: topics });
        });
    });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200 :returns article by id", () => {
    const article = {
      article_id: 12,
      title: "Moustache",
      topic: "mitch",
      author: "butter_bridge",
      body: "Have you seen the size of that thing?",
      created_at: "2020-10-11T11:24:00.000Z",
      votes: 0,
    };

    return request(app)
      .get("/api/articles/12")
      .expect(200)
      .then(({ body: { topic } }) => {
        expect(typeof topic.article_id).toBe("number");
        expect(typeof topic.title).toBe("string");
        expect(typeof topic.author).toEqual("string");
        expect(typeof topic.votes).toEqual("number");
        expect(typeof topic.created_at).toEqual("string");
        expect(topic).toEqual(article);
      });
  });
});

describe("GET : /api/articles object including total comments", () => {
  test("/api/articlezz -> route that does not exist: 404 Not Found", () => {
    return request(app)
      .get("/api/articlezz")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("not found");
      });
  });

  test("200 : returns object with all major fields sort by descending", () => {
    const expectedData = [
      {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: "2020-11-03T09:12:00.000Z",
        votes: 0,
        comment_count: 2,
      },
      {
        article_id: 6,
        title: "A",
        topic: "mitch",
        author: "icellusedkars",
        body: "Delicious tin of cat food",
        created_at: "2020-10-18T01:00:00.000Z",
        votes: 0,
        comment_count: 1,
      },
      {
        article_id: 5,
        title: "UNCOVERED: catspiracy to bring down democracy",
        topic: "cats",
        author: "rogersop",
        body: "Bastet walks amongst us, and the cats are taking arms!",
        created_at: "2020-08-03T13:14:00.000Z",
        votes: 0,
        comment_count: 2,
      },
      {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
        comment_count: 11,
      },
      {
        article_id: 9,
        title: "They're not exactly dogs, are they?",
        topic: "mitch",
        author: "butter_bridge",
        body: "Well? Think about it.",
        created_at: "2020-06-06T09:10:00.000Z",
        votes: 0,
        comment_count: 2,
      },
    ];
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(expectedData);
      });
  });
});
