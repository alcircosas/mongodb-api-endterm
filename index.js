const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const { MongoClient, ObjectId } = require("mongodb");
const port = 5050;

// Set up default mongoose connection
const url = "mongodb+srv://alcircosas:groupof3@hospital.lcj2fro.mongodb.net/test";
const client = new MongoClient(url);

app.use(
    bodyParser.urlencoded({
        extended: false,
    })
);

const dbName = "hospital";
let db;
client
  .connect()
  .then(async () => {
    db = client.db(dbName);
    console.log("Connected to Mongodb");
  })
  .catch((err) => {
    console.log(err);
    console.log("Unable to connect to Mongodb");
  });

app.get("/", (req, res) => {
  db.collection("patients")
    .find({})
    .toArray()
    .then((records) => {
      return res.json(records);
    })
    .catch((err) => {
      console.log(err);
      return res.json({ msg: "There was an error processing your query" });
    });
});

app.post("/", (req, res) => {
    console.log(req.body);
    const patient_no = req.body.patient_no;
    const name = req.body.name;
    db.collection("patients")
      .insertOne({
        name,
        age
      })
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  }); 

  app.put("/:_id", (req, res) => {
    const id = req.params._id;
    const name = req.body.name;
    db.collection("patients")
      .updateOne(
        {
          _id: ObjectId(id)
        },
        {
          $set: {
            name
          }
        }
      )
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });

  app.delete("/:_id", (req, res) => {
    const id = req.params._id;
    db.collection("patients")
      .deleteOne(
        {
          _id: ObjectId(id)
        })
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  }); 

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});