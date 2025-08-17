const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

// amirhossainbc75
// sHiKJoo3fAljOTPP

// midewaare
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3yb9d5d.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

   
    const attendanceCollection=client.db('productDB').collection('attendance')
    const izzaCollection=client.db('productDB').collection('izza')

// izza apis
app.post("/izza", async (req, res) => {
      const izza = req.body;
      // console.log('get product',product)
      const result = await izzaCollection.insertOne(izza);
      res.send(result);
    });

      app.get("/izza", async (req, res) => {
      const cursor = izzaCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

app.patch("/izza/:id", async (req, res) => {
  const id = req.params.id;
  const updatedData = req.body;
  
  try {
    const result = await izzaCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send({ message: "User updated successfully", result });
  } catch (err) {
    res.status(500).send({ message: "Update failed", error: err });
  }
});

// delete izza
app.delete("/izza/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const result = await izzaCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).send({ message: "Izza not found" });
    }

    res.send({ message: "Izza deleted successfully", result });
  } catch (err) {
    res.status(500).send({ message: "Delete failed", error: err });
  }
});






// attendance apis
app.get("/attendance", async (req, res) => {
  const { year, month } = req.query;

  const parsedYear = parseInt(year);
  const parsedMonth = parseInt(month);

  if (!parsedYear || !parsedMonth) {
    return res.status(400).send({ error: "Invalid year or month" });
  }

  const result = await attendanceCollection.findOne({ year: parsedYear, month: parsedMonth });
  res.send(result || {});
});

// ✅ POST attendance (optional, for initial insert)
app.post("/attendance", async (req, res) => {
  const attendance = req.body; // { year, month, data }
  const result = await attendanceCollection.insertOne(attendance);
  res.send(result);
});

// ✅ PATCH attendance (update a specific staff's status for a date)
app.patch("/attendance", async (req, res) => {
  const { year, month, date, staff, status } = req.body;

  const filter = { year, month };
  const update = {
    $set: {
      [`data.${date}.${staff}`]: status,
    },
  };
  const options = { upsert: true };

  const result = await attendanceCollection.updateOne(filter, update, options);
  res.send(result);
});




    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Crud is running...");
});

app.listen(port, () => {
  console.log(`Simple Crud is Running on port ${port}`);
});
