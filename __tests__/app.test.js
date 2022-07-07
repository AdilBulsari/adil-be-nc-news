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

describe("GET /api/articles/:article_id", () => {
  test("200 :returns article by id", () => {
    const expectedArticle = {
      article_id: 12,
      title: "Moustache",
      topic: "mitch",
      author: "butter_bridge",
      body: "Have you seen the size of that thing?",
      total_comments: 0,
      created_at: "2020-10-11T11:24:00.000Z",
      votes: 0,
    };

    return request(app)
      .get("/api/articles/12")
      .expect(200)

      .then(({ body: { article } }) => {
        expect(typeof article.article_id).toBe("number");
        expect(typeof article.title).toBe("string");
        expect(typeof article.author).toEqual("string");
        expect(typeof article.votes).toEqual("number");
        expect(typeof article.created_at).toEqual("string");
        expect(article).toEqual(expectedArticle);
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

  test("status:404, responds with an error message when id does not exist", () => {
    const updateArticleVote = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/99999")
      .send(updateArticleVote)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("does not exist");
      });
  });
  test("status:400, responds with an error message when passed invalid id", () => {
    const updateArticleVote = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/not-an-id")
      .send(updateArticleVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("enter valid id..");
      });
  });

  test("422 : /api/articles/1  => { inc_votes: 'not a number' }", () => {
    const updateArticleVote = { inc_votes: "not-a-number" };
    return request(app)
      .patch("/api/articles/1")
      .send(updateArticleVote)
      .expect(422)
      .then(({ body }) => {
        expect(body.msg).toBe("enter valid vote number");
      });
  });

  test("415 : /api/articles/1  => {  }", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(415)
      .then(({ body }) => {
        expect(body.msg).toBe("empty body");
      });
  });
});

describe("/api/users", () => {
  test("200 : get all users with array of object", () => {
    const expectedData = [
      {
        avatar_url:
          "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
        name: "jonny",
        username: "butter_bridge",
      },
      {
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
        name: "sam",
        username: "icellusedkars",
      },
      {
        avatar_url:
          "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
        name: "paul",
        username: "rogersop",
      },
      {
        avatar_url:
          "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
        name: "do_nothing",
        username: "lurker",
      },
    ];

    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body: { users } }) => {
        if (users.length === 0) {
          return;
        }else{
          users.forEach((user) => {
            expect(typeof user.username).toBe("string");
            expect(typeof user.avatar_url).toBe("string");
            expect(typeof user.name).toBe("string");
          });
          expect(users).toEqual(expectedData);
        }
      });
  });
});
