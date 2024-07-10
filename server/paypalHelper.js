// paymentHelper.js
import fetch from "node-fetch";
import { handleResponse } from "./utils/helper.js";
import { constants } from "./utils/constants.js";
import "dotenv/config";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_BASE_URL } = process.env;
const base = PAYPAL_BASE_URL;

/**
 * Generate an OAuth 2.0 access token for authenticating with PayPal REST APIs.
 */
const authenticate = async (bodyParams = {}) => {
    const params = {
        grant_type: constants.GRANT_TYPE,
        response_type: constants.RESPONSE_TYPE,
        ...bodyParams,
    };

    const urlEncodedParams = new URLSearchParams(params).toString();
    try {
        if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
            throw new Error("MISSING_API_CREDENTIALS");
        }
        const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");

        const response = await fetch(`${base}/v1/oauth2/token`, {
            method: "POST",
            body: urlEncodedParams,
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });
        return handleResponse(response);
    } catch (error) {
        console.error("Failed to generate Access Token:", error);
        throw error;
    }
};

/** Generate an Access Token using PAYPAL Client ID and Secret */
const generateAccessToken = async () => {
    const { jsonResponse } = await authenticate();
    return jsonResponse.access_token;
};

/**
 * Create an order to start the transaction.
 */
const createOrder = async (cart, amount_value) => {
    const accessToken = await generateAccessToken();

    const url = `${base}/v2/checkout/orders`;

    const payload = {
        intent: "CAPTURE",
        purchase_units: [
            {
                amount: {
                    currency_code: constants.USD_CURRENCY,
                    value: amount_value || "1.00",
                },
            },
        ],
        payment_source: {
            paypal: {
                attributes: {
                    vault: {
                        store_in_vault: "ON_SUCCESS",
                        usage_type: "MERCHANT",
                        customer_type: "CONSUMER",
                    },
                },
                experience_context: {
                    return_url: constants.RETURN_URL,
                    cancel_url: constants.CANCEL_URL,
                    shipping_preference: constants.SHIPPING_PREFRENCES,
                },
            },
        },
    };

    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        method: "POST",
        body: JSON.stringify(payload),
    });

    return handleResponse(response);
};

/**
 * Capture payment for the created order to complete the transaction.
 */
const captureOrder = async (orderID) => {
    const accessToken = await generateAccessToken();
    const url = `${base}/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
    });

    return handleResponse(response);
};

export { authenticate, generateAccessToken, createOrder, captureOrder };
