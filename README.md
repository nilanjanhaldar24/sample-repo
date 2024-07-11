# Save Payment Method Example

This folder contains example code for a PayPal Save Payment Method integration using both the JS SDK and Node.js to complete transactions with the PayPal REST API.

[View the Documentation](https://developer.paypal.com/docs/checkout/save-payment-methods/during-purchase/js-sdk/paypal/)



# PayPal Integration Flow

This document outlines the flow of integrating PayPal payment processing into an application using Node.js and Express.js.

## Prerequisites

1. **Node.js and npm**: Ensure you have Node.js and npm installed.
2. **PayPal Developer Account**: Create a PayPal developer account and obtain your `PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_SECRET`.
3. **Environment Variables**: Set up the following environment variables in a `.env` file:
    ```plaintext
    PAYPAL_CLIENT_ID=your_paypal_client_id
    PAYPAL_CLIENT_SECRET=your_paypal_client_secret
    PAYPAL_BASE_URL=https://api.sandbox.paypal.com
    SERVER_PORT=8001
    ```

## Project Structure
```
project-root/
│
├── server/
│ ├── views/
│ │ └── checkout.ejs
│ ├── paymentHelper.js
│ └── main.js
├── client/
│ └── (static files)
├── utils/
│ ├── helper.js
│ └── constants.js
├── .env
└── package.json
```


Running the Application
Install Dependencies: Run npm install to install the required dependencies.
Start the Server: Run node main.js to start the Express.js server.
Access the Application: Open your browser and navigate to http://localhost:8001/.
API Endpoints
Create Order: POST /api/orders

Request Body: { "cart": [...], "final_amount": "10.00" }
Response: JSON object containing the order details.
Capture Order: POST /api/orders/:orderID/capture

Request Params: orderID
Response: JSON object containing the capture details.
Notes
Ensure that the PayPal API credentials are correctly set in the .env file.
The checkout.ejs file should contain the necessary HTML and JavaScript to handle the PayPal checkout process on the client side.
The handleResponse function in utils/helper.js should handle the API responses appropriately.
This setup modularizes the payment integration logic, making it easier to maintain and reuse across different applications.

Update 1 Test Commit

