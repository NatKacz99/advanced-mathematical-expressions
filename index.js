import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended : true}));

const API_URL = "https://newton.now.sh/api/v2/";

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/", async (req, res) => {
  const selectedOperation = req.body.operation;
  try{
    const result = await axios.get(API_URL + selectedOperation);
    res.render("index.ejs", {operation : JSON.stringify(result.data)})
  } catch(error) {
    console.log(error.result.data);
    res.status(500);
  }
})


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});