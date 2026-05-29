import express from "express";
import dotenv from "dotenv";
import mainRouter from "./routes";

dotenv.config();

const port = process.env.PORT || 8080;
const nodeEnv = process.env.NODE_ENV || "production";

const app = express();

app.use(express.json({ limit: "1mb" }));

app.use("/",
    express.static("client/dist"),
    express.static("client/public")
);

app.use("/", mainRouter);

app.listen(port, () => {
    console.log(
        `server running on port ${port} `
        + `(${nodeEnv} mode)`
    );
});