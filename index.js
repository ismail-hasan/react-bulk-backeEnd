const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ১. শর্ট এবং ক্লিন ক্লাউড ইউআরআই
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.gbi1i.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
      serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
      }
});

// গ্লোবাল ভেরিয়েবল (যেন নিচের রুটগুলো ডাটাবেজ এক্সেস করতে পারে)
let colorCollection;
let quizCollection;

async function connectDB() {
      try {
            await client.connect();
            console.log("You successfully connected to MongoDB!");

            const database = client.db("EpsTopicHero");
            colorCollection = database.collection("colorCollection");
            quizCollection = database.collection("quizCollection");
      } catch (error) {
            console.error("Database connection error:", error);
      }
}
connectDB().catch(console.dir);


// ২. রুটগুলোকে run() বা connectDB() ফাংশনের বাইরে স্বাধীনভাবে রাখা হলো
app.get('/', (req, res) => {
      res.send('Server is running!');
});

app.get('/color', async (req, res) => {
      try {
            if (!colorCollection) return res.status(500).send({ message: "Database connection not ready" });
            const result = await colorCollection.find().toArray();
            res.send(result);
      } catch (error) {
            console.error("Error fetching colors:", error);
            res.status(500).send({ message: "color missing" });
      }
});

app.get('/quiz', async (req, res) => {
      try {
            if (!quizCollection) return res.status(500).send({ message: "Database connection not ready" });
            const result = await quizCollection.find().toArray();
            res.send(result);
      } catch (error) {
            console.error("Error fetching quiz:", error);
            res.status(500).send({ message: "quiz missing" });
      }
});

app.listen(PORT, () => {
      console.log(`Server: http://localhost:${PORT}`);
});

module.exports = app;