const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
require("dotenv").config();
const cors = require('cors');
const PORT = 3000;

app.use(cors());
app.use(express.json());


const uri = `mongodb://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0-shard-00-00.gbi1i.mongodb.net:27017,cluster0-shard-00-01.gbi1i.mongodb.net:27017,cluster0-shard-00-02.gbi1i.mongodb.net:27017/?ssl=true&replicaSet=atlas-codyet-shard-0&authSource=admin&appName=Cluster0`;



const client = new MongoClient(uri, {
      serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
      }
});

async function run() {
      try {
            await client.connect();
            console.log("You successfully connected to MongoDB!");

            // তোমার ডাটাবেজ ও কালেকশন এখানে ডিফাইন করো
            const database = client.db("EpsTopicHero");
            const colorCollection = database.collection("colorCollection");
            const quizCollection = database.collection("quizCollection");


            app.get('/color', async (req, res) => {
                  try {
                        const result = await colorCollection.find().toArray();
                        res.send(result);
                  } catch (error) {
                        console.error("Error fetching colors:", error);
                        res.status(500).send({ message: "color missing" });
                  }
            });
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
      // এখানে finally ব্লক থেকে client.close() ফেলে দেওয়া হয়েছে যেন কানেকশন বন্ধ না হয়
}
run().catch(console.dir);

app.get('/', (req, res) => {
      res.send('Server is running!');
});

app.listen(PORT, () => {
      console.log(`Server: http://localhost:${PORT}`);
});