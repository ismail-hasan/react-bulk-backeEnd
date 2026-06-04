const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require('mongodb');

// লোকাল ডেনএস ফিক্স (Vercel-এ এটি কোনো সমস্যা করবে না, লোকালেও কাজ করবে)
try {
      const dns = require("node:dns/promises");
      dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
      console.log("DNS setting skipped");
}

const app = express();
const port = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB URI (.env ফাইল থেকে নেওয়া নিরাপদ, নাহলে আপনার স্ট্রিংটিই থাকবে)
// const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0.gbi1i.mongodb.net/?appName=Cluster0`;
const uri = `mongodb+srv://DemoEPS:fiCN8hJQD79MHJld@cluster0.gbi1i.mongodb.net/?appName=Cluster0`;
// MONGO_USER = DemoEPS
// MONGO_PASS = fiCN8hJQD79MHJld


// const uri = `mongodb+srv://DemoEPS:fiCN8hJQD79MHJld@cluster0.gbi1i.mongodb.net/?appName=Cluster0`;
// মঙ্গোডিবি ক্লায়েন্ট (কানেকশন পুলিং অপটিমাইজড)
const client = new MongoClient(uri, {
      serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
      }
});

// Serverless-এর জন্য ডাটাবেজ কানেকশন হ্যান্ডলার ফাংশন
// let db = null;
async function connectDB() {
      // if (db) return db; // অলরেডি কানেক্টেড থাকলে নতুন করে কানেক্ট করবে না
      await client.connect();
      db = client.db("ReviewPlexDB");
      console.log("Successfully connected to MongoDB!");
      return db;
}
// ==================== ROUTERS ==================== 

app.get('/', (req, res) => {
      res.send('Quiz Server is Running!');
});

// লোকাল ফাইল থেকে ডেটা ইমপোর্ট
const localQuizzes = require("./public/quizzes.js");

// ডাটাবেজে কুইজ আপলোড করার জন্য
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

// 🎯 কুইজ গেট রাউট
app.get("/quiz", async (req, res) => {
      try {
            const database = await connectDB(); // প্রতি রিকোয়েস্টে কানেকশন চেক করবে
            const quizCollection = database.collection("quizzes");
            const result = await quizCollection.find({}).toArray();
            res.send(result);
      } catch (error) {
            console.error("MongoDB Error:", error);
            res.status(500).send({ error: error.message });
      }
});

// 🎯 কালার ব্লাইন্ডনেস রাউট
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


// 🎯 বই এর রাউট
app.get("/book", async (req, res) => {
      try {
            const database = await connectDB();
            const bookCollection = database.collection("epsBooks");
            const result = await bookCollection.find({}).toArray();
            res.send(result);
      } catch (error) {
            console.error(error);
            res.status(500).send({ message: "MongoDB thake  book data ante somossa hoyeche" });
      }
});


if (process.env.NODE_ENV !== 'production') {
      app.listen(port, '0.0.0.0', () => {
            console.log(`Server is running on port ${port}`);
      });
}

module.exports = app; 