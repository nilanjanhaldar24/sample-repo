// main.js
import express from "express";
import { createOrder, captureOrder, authenticate } from "./paypalHelper.js";
import "dotenv/config";

const { PAYPAL_CLIENT_ID, SERVER_PORT = 8888 } = process.env;
const app = express();

app.set("view engine", "ejs");
app.set("views", "./server/views");

app.use(express.static("client"));
app.use(express.json());

app.post("/api/orders", async (req, res) => {
  try {
    const { cart, final_amount } = req.body;
    const { jsonResponse, httpStatusCode } = await createOrder(cart, final_amount);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
});

app.post("/api/orders/:orderID/capture", async (req, res) => {
  try {
    const { orderID } = req.params;
    const { jsonResponse, httpStatusCode } = await captureOrder(orderID);
    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
});

app.get("/", async (req, res) => {
  try {
    const { jsonResponse } = await authenticate({
      target_customer_id: req.query.customerID,
    });
    res.render("checkout", {
      clientId: PAYPAL_CLIENT_ID,
      userIdToken: jsonResponse.id_token,
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.listen(SERVER_PORT, () => {
  console.log(`Node server listening at http://localhost:${SERVER_PORT}/`);
});
