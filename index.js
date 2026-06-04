const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');

try {
      const dns = require("node:dns/promises");
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
      console.log("DNS setting skipped");
}

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://DemoEPS:fiCN8hJQD79MHJld@cluster0.gbi1i.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
      serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
      }
});

let db = null; // এই ডিফাইনটা মিসিং ছিল

async function connectDB() {
      if (db) return db; // অলরেডি কানেক্টেড থাকলে সেটাই রিটার্ন করবে
      await client.connect();
      db = client.db("ReviewPlexDB");
      console.log("Successfully connected to MongoDB!");
      return db;
}

const localQuizzes = require("./public/quizzes.js");

app.get('/', (req, res) => {
      res.send('Quiz Server is Running!');
});

app.post("/add-quiz", async (req, res) => {
      try {
            const database = await connectDB();
            const quizCollection = database.collection("quizzes");
            const result = await quizCollection.insertMany(localQuizzes);
            res.send(result);
      } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Data insert করতে সমস্যা হয়েছে" });
      }
});

app.get("/quiz", async (req, res) => {
      try {
            const database = await connectDB();
            const quizCollection = database.collection("quizzes");
            const result = await quizCollection.find({}).toArray();
            res.send(result);
      } catch (error) {
            console.error("MongoDB Error:", error);
            res.status(500).send({ error: error.message });
      }
});

app.get("/color", async (req, res) => {
      try {
            const database = await connectDB();
            const colorBlindCollection = database.collection("colorBlind");
            const result = await colorBlindCollection.find({}).toArray();
            res.send(result);
      } catch (error) {
            console.error(error);
            res.status(500).send({ message: "MongoDB thake color blindness data ante somossa hoyeche" });
      }
});

app.get("/book", async (req, res) => {
      try {
            const database = await connectDB();
            const bookCollection = database.collection("epsBooks");
            const result = await bookCollection.find({}).toArray();
            res.send(result);
      } catch (error) {
            console.error(error);
            res.status(500).send({ message: "MongoDB thake book data ante somossa hoyeche" });
      }
});

if (process.env.NODE_ENV !== 'production') {
      app.listen(port, '0.0.0.0', () => {
            console.log(`Server is running on port ${port}`);
      });
}

module.exports = app;