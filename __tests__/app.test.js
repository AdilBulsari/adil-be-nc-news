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
        expect(body.message).toBe("id must be a number");
      });
  });
  test("status:404, responds with an error message does not exist", () => {
    return request(app)
      .get("/api/articles/99999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("does not exist");
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
        expect(body.message).toBe("does not exist");
      });
  });
  test("status:400, responds with an error message when passed invalid id", () => {
    const updateArticleVote = { inc_votes: -100 };
    return request(app)
      .patch("/api/articles/not-an-id")
      .send(updateArticleVote)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("enter valid id..");
      });
  });

  test("422 : /api/articles/1  => { inc_votes: 'not a number' }", () => {
    const updateArticleVote = { inc_votes: "not-a-number" };
    return request(app)
      .patch("/api/articles/1")
      .send(updateArticleVote)
      .expect(422)
      .then(({ body }) => {
        expect(body.message).toBe("enter valid vote number");
      });
  });

  test("415 : /api/articles/1  => {  }", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(415)
      .then(({ body }) => {
        expect(body.message).toBe("empty body");
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
        } else {
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

describe("GET : /api/articles object including total comments", () => {
  test("/api/articlezz -> route that does not exist: 404 Not Found", () => {
    return request(app)
      .get("/api/articlezz")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("does not exist");
      });
  });

  test("200 : returns object with all major fields sort by descending DEFAULT", () => {
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
        article_id: 2,
        title: "Sony Vaio; or, The Laptop",
        topic: "mitch",
        author: "icellusedkars",
        body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
        created_at: "2020-10-16T05:03:00.000Z",
        votes: 0,
        comment_count: 0,
      },
      {
        article_id: 12,
        title: "Moustache",
        topic: "mitch",
        author: "butter_bridge",
        body: "Have you seen the size of that thing?",
        created_at: "2020-10-11T11:24:00.000Z",
        votes: 0,
        comment_count: 0,
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
      {
        article_id: 10,
        title: "Seven inspirational thought leaders from Manchester UK",
        topic: "mitch",
        author: "rogersop",
        body: "Who are we kidding, there is only one, and it's Mitch!",
        created_at: "2020-05-14T04:15:00.000Z",
        votes: 0,
        comment_count: 0,
      },
      {
        article_id: 4,
        title: "Student SUES Mitch!",
        topic: "mitch",
        author: "rogersop",
        body: "We all love Mitch and his wonderful, unique typing style. However, the volume of his typing has ALLEGEDLY burst another students eardrums, and they are now suing for damages",
        created_at: "2020-05-06T01:14:00.000Z",
        votes: 0,
        comment_count: 0,
      },
      {
        article_id: 8,
        title: "Does Mitch predate civilisation?",
        topic: "mitch",
        author: "icellusedkars",
        body: "Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!",
        created_at: "2020-04-17T01:08:00.000Z",
        votes: 0,
        comment_count: 0,
      },
      {
        article_id: 11,
        title: "Am I a cat?",
        topic: "mitch",
        author: "icellusedkars",
        body: "Having run out of ideas for articles, I am staring at the wall blankly, like a cat. Does this make me a cat?",
        created_at: "2020-01-15T22:21:00.000Z",
        votes: 0,
        comment_count: 0,
      },
      {
        article_id: 7,
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: "2020-01-07T14:08:00.000Z",
        votes: 0,
        comment_count: 0,
      },
    ];

    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeSortedBy("created_at", { descending: true });
      });
  });
});

describe("GET /api/queries(Queries)", () => {
  test("200 : sort_by default date", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200 : sort_by article_id (default desc)", () => {
    return request(app)
      .get("/api/articles?sort_by=article_id")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeSortedBy("article_id", { descending: true });
      });
  });
  test("200 : order_by desc (default)", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order_by=desc")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200 : order_by asc", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order_by=asc")
      .expect(200)
      .then((res) => {
        expect(res.body).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("200 : filter by topic", () => {
    return request(app)
      .get("/api/articles?filter_by=topic")
      .expect(200)
      .then((res) => {
   
        expect(res.body).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("200 : sort by comment", () => {
    return request(app)
      .get("/api/articles?sort_by=comment_count")
      .expect(200)
      .then((res) => {
        console.log(res.body);
        // expect(res.body).toBeSortedBy("created_at", { ascending: true });
      });
  });
});

describe("Ticket 9 : Get article Comment", () => {
  test("200 : Array of comment of particular article id", () => {
    const expectedCommentArray = [
      {
        comment_id: 2,
        votes: 14,
        created_at: "2020-10-31T03:03:00.000Z",
        author: "butter_bridge",
        body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
      },
      {
        comment_id: 3,
        votes: 100,
        created_at: "2020-03-01T01:13:00.000Z",
        author: "icellusedkars",
        body: "Replacing the quiet elegance of the dark suit and tie with the casual indifference of these muted earth tones is a form of fashion suicide, but, uh, call me crazy — onyou it works.",
      },
      {
        comment_id: 4,
        votes: -100,
        created_at: "2020-02-23T12:01:00.000Z",
        author: "icellusedkars",
        body: " I carry a log — yes. Is it funny to you? It is not to me.",
      },
      {
        comment_id: 5,
        votes: 0,
        created_at: "2020-11-03T21:00:00.000Z",
        author: "icellusedkars",
        body: "I hate streaming noses",
      },
      {
        comment_id: 6,
        votes: 0,
        created_at: "2020-04-11T21:02:00.000Z",
        author: "icellusedkars",
        body: "I hate streaming eyes even more",
      },
      {
        comment_id: 7,
        votes: 0,
        created_at: "2020-05-15T20:19:00.000Z",
        author: "icellusedkars",
        body: "Lobster pot",
      },
      {
        comment_id: 8,
        votes: 0,
        created_at: "2020-04-14T20:19:00.000Z",
        author: "icellusedkars",
        body: "Delicious crackerbreads",
      },
      {
        comment_id: 9,
        votes: 0,
        created_at: "2020-01-01T03:08:00.000Z",
        author: "icellusedkars",
        body: "Superficially charming",
      },
      {
        comment_id: 12,
        votes: 0,
        created_at: "2020-03-02T07:10:00.000Z",
        author: "icellusedkars",
        body: "Massive intercranial brain haemorrhage",
      },
      {
        comment_id: 13,
        votes: 0,
        created_at: "2020-06-15T10:25:00.000Z",
        author: "icellusedkars",
        body: "Fruit pastilles",
      },
      {
        comment_id: 18,
        votes: 16,
        created_at: "2020-07-21T00:20:00.000Z",
        author: "butter_bridge",
        body: "This morning, I showered for nine minutes.",
      },
    ];
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(expectedCommentArray);
      });
  });
  test("404 : /api/9999 -> route that does not exist: 404 Not Found", () => {
    return request(app)
      .get("/api/articles/9999/comments")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("not found");
      });
  });
  test("422 : /api/articlezz -> invalid path", () => {
    return request(app)
      .get("/api/articles/articlezz/comments")
      .expect(422)
      .then(({ body: { message } }) => {
        expect(message).toBe("Invalid path");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  const commentToPost = {
    username: "rogersop",
    body: "Lobster Pot",
  };

  test("415 : Invalid body /missing properties", () => {
    const invalidDataBody = {
      1: "rogersop",
      2: "lobster Pot",
    };
    const missingDataBody = {
      1: "rogersop",
    };

    return request(app)
      .post("/api/articles/4/comments")
      .send(invalidDataBody)
      .expect(415)
      .then(({ body: { message } }) => {
        expect(message).toBe("Unsupported Data/Body sent");
      });
  });

  test("200 : send request body with username and body", () => {
    return request(app)
      .post("/api/articles/4/comments")
      .send(commentToPost)
      .expect(200)
      .then(({ body: { postedComment } }) => {
        expect(postedComment).toEqual(
          expect.objectContaining({
            comment_id: 19,
            body: "Lobster Pot",
            article_id: 4,
            author: "rogersop",
            votes: 0,
          })
        );
      });
  });

  test("422 : Invalid article id /api/articles/not-an-id/comments", () => {
    return request(app)
      .post("/api/articles/not-an-id/comments")
      .send(commentToPost)
      .expect(422)
      .then(({ body: { message } }) => {
        expect(message).toBe("Invalid id");
      });
  });

  test("400 : bad request /api/articles/99999/comments", () => {
    return request(app)
      .post("/api/articles/99999/comments")
      .send(commentToPost)
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("Bad Request");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("delete row from comment table when passed valid comment_id and return empty data(no content)", () => {
    return request(app)
      .delete("/api/comments/2")
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual([]);
      });
  });
  test("404 : when passed invalid id number", () => {
    return request(app)
      .delete("/api/comments/9999")
      .expect(404)
      .then(({ body: { message } }) => {
        expect(message).toBe("does not exist");
      });
  });
  test("400 : when passed string as id", () => {
    return request(app)
      .delete("/api/comments/not-an-id")
      .expect(400)
      .then(({ body: { message } }) => {
        expect(message).toBe("incorrect id type passed");
      });
  });
});

  describe("GET /api", () => {
    it("200 responds with a json describing all available endpoints", () => {
      const endpoints = {
        "GET /api": {
          description:
            "serves up a json representation of all the available endpoints of the api",
        },
        "GET /api/topics": {
          description: "serves an array of all topics",
          queries: [],
          exampleResponse: {
            topics: [{ slug: "football", description: "Footie!" }],
          },
        },
        "GET /api/articles": {
          description: "serves an array of all articles",
          queries: ["author", "topic", "sort_by", "order"],
          exampleResponse: {
            articles: [
              {
                title: "Seafood substitutions are increasing",
                topic: "cooking",
                author: "weegembump",
                body: "Text from the article..",
                created_at: 1527695953341,
              },
              {
                title: "Eight pug gifs that remind me of mitch",
                topic: "mitch",
                author: "icellusedkars",
                body: "some gifs",
                created_at: 1604394720000,
                votes: 0,
              },
            ],
          },
        },
        "GET /api/users": {
          description: "serves an array of all users",
          queries: [],
          exampleResponse: {
            users: [
              {
                username: "butter_bridge",
                name: "jonny",
                avatar_url:
                  "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
              },
              {
                username: "icellusedkars",
                name: "sam",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
              },
              {
                username: "rogersop",
                name: "paul",
                avatar_url:
                  "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
              },
              {
                username: "lurker",
                name: "do_nothing",
                avatar_url:
                  "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
              },
            ],
          },
        },
        "GET /api/articles/:article_id": {
          description: "serves an article object",
          queries: [],
          exampleResponse: {
            articles: {
              title: "Seafood substitutions are increasing",
              topic: "cooking",
              author: "weegembump",
              body: "Text from the article..",
              created_at: 1527695953341,
              article_id: 12,
              votes: 0,
              comment_count: 5,
            },
          },
        },
        "PATCH /api/articles/:article_id": {
          description: "serves an updated article object",
          queries: [],
          exampleResponse: {
            articles: {
              title: "Seafood substitutions are increasing",
              topic: "cooking",
              author: "weegembump",
              body: "Text from the article..",
              created_at: 1527695953341,
              article_id: 12,
              votes: 1,
            },
          },
        },
        "GET /api/articles/:article_id/comments": {
          description: "serves a new comment object by article id",
          queries: [],
          exampleResponse: {
            articles: {
              title: "Seafood substitutions are increasing",
              topic: "cooking",
              author: "weegembump",
              body: "Text from the article..",
              created_at: 1527695953341,
              article_id: 12,
              votes: 1,
            },
          },
        },
        "POST /api/articles/:article_id/comments": {
          description: "posts and serves a new comment object by article id",
          queries: [],
          exampleResponse: {
            articles: {
              title: "Seafood substitutions are increasing",
              topic: "cooking",
              author: "weegembump",
              body: "Text from the article..",
              created_at: 1527695953341,
              article_id: 12,
              votes: 1,
            },
          },
        },
        "DELETE /api/comments/:comment_id": {
          description: "deletes a comment by comment id",
          queries: [],
          exampleResponse: {
            comments: [],
          },
        },
      };
      return request(app)
        .get("/api")
        .expect(200)
        .then((res) => {
       
          expect(res.body).toEqual(endpoints);
        });
    });
  });
  describe("GET /apg", () => {
    it("404 responds with page not found", () => {
      return request(app)
        .get("/apg")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).toBe("does not exist");
        });
    });
  });
