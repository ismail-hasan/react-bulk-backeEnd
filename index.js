const { MongoClient, ServerApiVersion } = require('mongodb');
const express = require('express');
const cors = require('cors');
require("dotenv").config();

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json()); // POST রিকোয়েস্টের বডি রিড করার জন্য (লাগতে পারে)

// MongoDB URI
const uri = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@cluster0-shard-00-00.gbi1i.mongodb.net:27017,cluster0-shard-00-01.gbi1i.mongodb.net:27017,cluster0-shard-00-02.gbi1i.mongodb.net:27017/?ssl=true&replicaSet=atlas-codyet-shard-0&authSource=admin&appName=Cluster0`;

const client = new MongoClient(uri, {
      serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
      }
});

let quizCollection;

async function run() {
      try {
          
            await client.connect();

            const database = client.db("ReviewPlexDB");
            quizCollection = database.collection("quizzes");

            console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } catch (error) {
            console.error("MongoDB কানেকশনে ভুল হয়েছে:", error);
      }
     
}
run().catch(console.dir);


// ==================== ROUTERS ==================== 

app.get('/', (req, res) => {
      res.send('Quiz Server is Running!');
});

// লোকাল ফাইল থেকে ডেটা ইমপোর্ট (যদি একবারে ডাটাবেজে পুশ করতে চাও)
const localQuizzes = require("./quizzes.js");

// ডাটাবেজে কুইজ আপলোড করার জন্য (একবার হিট করলেই ডাটাবেজে সেভ হবে)
app.post("/add-quiz", async (req, res) => {
      try {
            const result = await quizCollection.insertMany(localQuizzes);
            res.send(result);
      } catch (error) {
            res.status(500).send({ message: "Data insert করতে সমস্যা হয়েছে" });
      }
});

// 🎯 আসল রাউট: যেটা তোমার React Native অ্যাপে ডেটা পাঠাবে সরাসরি MongoDB থেকে
app.get("/quiz", async (req, res) => {
      try {
            // ডাটাবেজ থেকে সব কুইজ খুঁজে বের করে অ্যারে বানিয়ে পাঠানো
            const cursor = quizCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
      } catch (error) {
            res.status(500).send({ message: "MongoDB থেকে ডেটা আনতে সমস্যা হয়েছে" });
      }
});


// ⚠️ মোবাইল থেকে কানেক্ট করার জন্য '0.0.0.0' যোগ করা হয়েছে
app.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on port ${port} and open to local network`);
});