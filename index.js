const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const swaggerJsdoc = require('swagger-jsdoc'); 
const swaggerUi = require('swagger-ui-express');
const { MongoClient, ObjectId } = require("mongodb");
const port = 5050;

// Set up default mongoose connection
const url = "mongodb+srv://admin:salapang@testone.yviwfaa.mongodb.net/test";
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


//swagger documentation for GET
const swaggerOptions = {
  swaggerDefinition: {
    info: {
        title: 'HOSPITAL RECORDS',
        description: "API for hospital records",
        contact:{
          name: "mongoDB"
        },
        servers: ["http://localhost:5050"] // test for the user interface of the localhost
    }
  },
  apis:["index.js"]
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use("/api-docs",swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
/**
 * @swagger
 * /patients:
 * get:
 *  descritpion: Use to request all patients
 *  responses:
 *     '200':
 *        description: A sucessfull response
 */

app.get("/patients",(req, res) => {
  console.log("request");
  res.status(200).send("Patients Results");
})

app.get("/", (req, res) => {
  db.collection("patients")
    .find({})
    .toArray()
    .then((records) => {
      return res.json(records);
    })
    .catch((err) => {
      console.log("err");
      return res.json({ msg: "There was an error processing your query" });
    });
});

//Create a patient

app.post("/patients", (req, res) => {
    console.log(req.body);
    const {patient_no,name,age,birthdate,address,bloodtype,gender} = req.body;
    db.collection("patients")
      .insertOne({patient_no,name,age,birthdate,address,bloodtype,gender})
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });

  //Create prescriptions

  app.post("/prescriptions", (req, res) => {
    console.log(req.body);
    const {date,patient_no,name,diagnosis,medications} = req.body;
    db.collection("prescriptions")
      .insertOne({date,patient_no,name,diagnosis,medications})
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  }); 

  //Delete a patient

  app.delete("/patients/:patient_no", (req, res) => {
    const _patient_no = req.params.patient_no;
    db.collection("patients")
      .deleteOne(
        {
          patient_no: _patient_no
        })
      .then((records) => {
        return res.json(records);
      })
      .catch((err) => {
        console.log(err);
        return res.json({ msg: "There was an error processing your query" });
      });
  });

  //Delete a prescription

  app.delete("/prescriptions/:_id", (req, res) => {
    const id = req.params._id;
    db.collection("prescriptions")
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

  //Add a medication to the prescription

  app.put("/prescriptions/:_id", (req, res) => {
    const id = req.params._id;
    const {patient_no,name,age,date,diagnosis} = req.body;
    db.collection("prescriptions")
      .updateOne(
        {
          _id: ObjectId(id)
        },
        {
          $push: {
            medications
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

  //Remove a medication from a prescription

  app.put("/prescriptions/:_id", (req, res) => {
    const id = req.params._id;
    const {patient_no,name,age,date,diagnosis} = req.body;
    db.collection("prescriptions")
      .updateOne(
        {
          _id: ObjectId(id)
        },
        {
          $pull: {
            medications
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

  //update patients

  app.put("/patients/:patient_no", (req, res) => {
    const _patient_no = req.params.patient_no;
    const {name,age,birthdate,address,bloodtype,gender} = req.body;
    db.collection("patients")
      .updateOne(
        {
          patient_no: _patient_no
        },
        {
          $set: {
            name,age,birthdate,address,bloodtype,gender
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