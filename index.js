const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000; // Vercel এর জন্য পোর্ট ডাইনামিক করা হলো

app.use(cors());
app.use(express.json());

// ১. এখানে মঙ্গোডিবির সলিড এবং শর্ট ক্লাউড URI ফর্ম্যাট ব্যবহার করা হয়েছে
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.gbi1i.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
      serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
      }
});

// মেইন রুটটি শুরুতে রাখা ভার্সেলের জন্য ভালো অভ্যাস
app.get('/', (req, res) => {
      res.send('Server is running!');
});

async function run() {
      try {
            await client.connect();
            console.log("You successfully connected to MongoDB!");

            const database = client.db("EpsTopicHero");
            const colorCollection = database.collection("colorCollection");
            const quizCollection = database.collection("quizCollection");

            // কালার গেট করার রুট
            app.get('/color', async (req, res) => {
                  try {
                        const result = await colorCollection.find().toArray();
                        res.send(result);
                  } catch (error) {
                        console.error("Error fetching colors:", error);
                        res.status(500).send({ message: "color missing" });
                  }
            });

            // কুইজ গেট করার রুট
            app.get('/quiz', async (req, res) => {
                  try {
                        const result = await quizCollection.find().toArray();
                        res.send(result);
                  } catch (error) {
                        console.error("Error fetching quiz:", error);
                        res.status(500).send({ message: "quiz missing" });
                  }
            });

      } catch (error) {
            console.error("Database connection error:", error);
      }
}
run().catch(console.dir);

app.listen(PORT, () => {
      console.log(`Server: http://localhost:${PORT}`);
});

// ২. ভার্সেল ডেপ্লয়মেন্টের জন্য অ্যাপটি নিচে এক্সপোর্ট করে দেওয়া হলো
module.exports = app;