const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const serverless = require("serverless-http");

const PORT = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.disable("x-powered-by");

app.use(morgan("dev"));

app.use("/api/v1", require("./routes/router"));

app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`);
});

module.exports = serverless(app);
