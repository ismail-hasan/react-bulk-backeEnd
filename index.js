const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');
const { ObjectId } = require("mongodb");

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
app.get("/vocabulary", async (req, res) => {
      try {
            const database = await connectDB();
            const vocabularyollection = database.collection("vocabularyollection");
            const result = await vocabularyollection.find({}).toArray();
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


app.get("/countries", async (req, res) => {
      try {
            const database = await connectDB();
            const countriesCollection = database.collection("countries");
            const result = await countriesCollection.find({}).toArray();
            res.send(result);
      } catch (error) {
            console.error(error);
            res.status(500).send({ message: "MongoDB thake country ar data ante somossa hoyeche" });
      }
});
app.get("/country", async (req, res) => {
      try {
            const database = await connectDB();
            const countryCollection = database.collection("country");
            const result = await countryCollection.find({}).toArray();
            res.send(result);
      } catch (error) {
            console.error(error);
            res.status(500).send({ message: "MongoDB thake singleCountry ar data ante somossa hoyeche" });
      }
});




// ১. সব ডাটা একসাথে দেখার রুট (http://localhost:5001/country)
app.get("/country", async (req, res) => {
      try {
            const database = await connectDB();
            const countryCollection = database.collection("country");

            // ডাটাবেসের সব ডাটা নিয়ে আসবে
            const result = await countryCollection.find({}).toArray();
            res.send(result);
      } catch (error) {
            console.error(error);
            res.status(500).send({ message: "সব দেশের ডাটা আনতে সমস্যা হয়েছে।" });
      }
});


app.get("/country/:id", async (req, res) => {
      try {
            const id = req.params.id; // ইউজার ইউআরএল-এ যে আইডি পাঠাবে (যেমন: 652f10b3...)

            const database = await connectDB();
            const countryCollection = database.collection("country");

            // স্ট্রিং আইডি-কে MongoDB ObjectId-তে রূপান্তর করে কোয়েরি তৈরি
            const query = { _id: new ObjectId(id) };

            const result = await countryCollection.findOne(query);

            // যদি এই আইডি দিয়ে কোনো ডাটা না পাওয়া যায়
            if (!result) {
                  return res.status(404).send({ message: "এই MongoDB ID দিয়ে কোনো দেশের ডাটা খুঁজে পাওয়া যায়নি!" });
            }

            // ডাটা পাওয়া গেলে রেসপন্স পাঠানো
            res.send(result);

      } catch (error) {
            console.error(error);
            // যদি ইউজার ২৪ অক্ষরের সঠিক আইডি না দিয়ে ভুলভাল কিছু দেয়, তাহলে এই ক্যাচ ব্লকে আসবে
            res.status(500).send({ message: "আইডির ফরম্যাট ঠিক নেই অথবা ডাটা আনতে সমস্যা হয়েছে।" });
      }
});







if (process.env.NODE_ENV !== 'production') {
      app.listen(port, '0.0.0.0', () => {
            console.log(`Server is running on port ${port}`);
      });
}

module.exports = app;