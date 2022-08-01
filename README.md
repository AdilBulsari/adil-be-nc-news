# Adil's Northcoders News API

This project is designed to retrieve data using this API, from the Northcoders news database. The data includes news articles with comments, votes, topics and scores related to them. Please refer to the endpoints.json file in the root directory to see all the endpoints and their use.

Alternatively you can check the hosted version of the API on heroku https://nc-news-pa.herokuapp.com/api

## User guide

The project has already a database folder with a setup.sql file to enable you set-up two databases, one for development and the other for testing. Both test and dev data are included in the data subfolder. There is also a seeds subfolder that contains the files that will enable you to seed the database by executing the npm scripts mentioned in the package.json.

If you want to use this API you will need to create two .env files for your project: .env.test and .env.development in the root directory. Into each, add PGDATABASE=<database_name_here>, with the correct database name for that environment (see /db/setup.sql for the database names).Make sure that these .env files are .gitignored. You will also need to install all the dependencies. Namely node-postgress to interact with the databases, dotenv to enable you to target a specific database and express to enable you to respond to requests to your database, and other devDepenedcies by executing npm install.

Then seed the databases with the script npm run setup-dbs && npm run seed

You can use the jest library to run your tests by executing npm test

## Minimum versions of Node.js and Postgres needed to run the project

Node version 18.0.0

postgress version 8.7.3
