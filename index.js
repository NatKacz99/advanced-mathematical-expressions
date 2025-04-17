import express from "express";
import axios from "axios";
import bodyParser from "body-parser";
import { create, all } from 'mathjs';
import { Equation, Expression, parse } from 'algebra.js';

const math = create(all);

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended : true}));

const API_URL = "https://newton.now.sh/api/v2/";

const operationMap = {
  "Simplify": "simplify",
  "Factor": "factor",
  "Derive": "derive",
  "Find 0's": "zeroes",
  "Integrate": "integrate",
  "Cosine": "cos",
  "Sine": "sin",
  "Tangent": "tan",
  "Inverse Cosine": "arccos",
  "Inverse Sine": "arcsin",
  "Inverse Tangent": "arctan",
  "Absolute Value": "abs",
  "Logarithm": "log"
};

app.get("/", (req, res) => {
  res.render("index.ejs", { operation: null });
});

app.post("/score", async (req, res) => {
  const userInputOperation = req.body.operation;
  const expression = req.body.expression;
  const selectedOperation = operationMap[userInputOperation];

  if (!expression || expression.trim() === "") {
    return res.render("index.ejs", {
      operation: { error: "Expression field can not be empty!" }
    });
  }

  if (selectedOperation === "zeroes") {
    try {
      const simplified = math.simplify(expression);

      //Transition left side of the equation.
      const leftSide = parse(simplified.toString());

      //Right side = 0
      const rightSide = new Expression(0);

      const eq = new Equation(leftSide, rightSide);

      const solution = eq.solveFor("x");

      const findZeroPlacesResponse = {
        operation: "zeroes",
        expression: expression,
        result: Array.isArray(solution)
          ? `[${solution.map(s => s.toString()).join(', ')}]`
          : solution.toString()
      };

      return res.render("index.ejs", { operation: findZeroPlacesResponse });

    } catch (err) {
      console.error("Mistake in solving the equation:", err.message);
      return res.render("index.ejs", {
        operation: { error: "Couldn't solve the equation. Check your syntax." }
      });
    }
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