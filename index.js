import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended : true}));

const API_URL = "https://newton.now.sh/api/v2/";

app.get("/", (req, res) => {
  res.render("index.ejs", { operation: null });
});

app.post("/score", async (req, res) => {
  const selectedOperation = req.body.operation;
  const expression = req.body.expression;

  if (!expression || expression.trim() === "") {
    return res.render("index.ejs", {
      operation: { error: "Expression field can not be empty!" }
    });
  }
  try{
    const encodedExpression = encodeURIComponent(expression); 
    const response = await axios.get(`${API_URL}${selectedOperation.toLowerCase()}/${encodedExpression}`);
    res.render("index.ejs", {operation : response.data})
  } catch(error) {
    console.log(error.response.data);
    res.status(500);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});