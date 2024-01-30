// require('dotenv').config();
// const https = require("https");
// const { createOrder } = require("./shopifyCatogory");
// const { env } = require("process");
// const { sendCatalogMessage } = require("./catlogMessage");
// const getUserAddress = require("./whatsaap");

// exports.handler = async (event) => {
//     const VERIFY_TOKEN = "umran";
//     const WHATSAPP_TOKEN = env.whatsapp_Token;

//     let response;

//     try {
//         if (event.httpMethod === "GET") {
//             // Handle GET request for webhook verification
//             let queryParams = event?.queryStringParameters;
//             console.log(queryParams);

//             if (queryParams) {
//                 const mode = queryParams["hub.mode"];

//                 if (mode === "subscribe") {
//                     const verifyToken = queryParams["hub.verify_token"];

//                     if (verifyToken === VERIFY_TOKEN) {
//                         let challenge = queryParams["hub.challenge"];
//                         response = {
//                             "statusCode": 200,
//                             "body": challenge,
//                             "isBase64Encoded": false
//                         };
//                     } else {
//                         const responseBody = "Error, wrong validation token";
//                         response = {
//                             "statusCode": 403,
//                             "body": JSON.stringify(responseBody),
//                             "isBase64Encoded": false
//                         };
//                     }
//                 } else {
//                     const responseBody = "Error, wrong mode";
//                     response = {
//                         "statusCode": 403,
//                         "body": JSON.stringify(responseBody),
//                         "isBase64Encoded": false
//                     };
//                 }
//             } else {
//                 const responseBody = "Error, no query parameters";
//                 response = {
//                     "statusCode": 403,
//                     "body": JSON.stringify(responseBody),
//                     "isBase64Encoded": false
//                 };
//             }
//         } else if (event.httpMethod === "POST") {
//             try {
//                 let body = JSON.parse(event.body);
//                 console.log(body);

//                 if (body && body.entry) {
//                     for (let entry of body.entry) {
//                         for (let change of entry.changes) {
//                             let value = change.value;

//                             if (value != null && value.messages != null) {
//                                 let phone_number_id = value.metadata.phone_number_id;

//                                 for (let message of value.messages) {

//                                     const orderData = {
//                                         order: {
//                                             line_items: [],
//                                             transactions: [
//                                                 {
//                                                     kind: "sale",
//                                                     status: "success",
//                                                     amount: 20
//                                                 }
//                                             ],
//                                             currency: "INR"
//                                         },
//                                         saveOrder: {
//                                             update: true
//                                         }
//                                     };
//                                     if (message.type === 'text') {
//                                         let from = message.from;
//                                         let message_body = message.text.body;
//                                         // const categories = await getProductCategories();
//                                         console.log(value)
//                                         console.log(from)
//                                         console.log(message_body)
//                                         let reply_message = "Welcome TO PromodeAgroFarms";

//                                         await sendReply(phone_number_id, WHATSAPP_TOKEN, from, reply_message);
//                                         await sendCatalogMessage(from, WHATSAPP_TOKEN);

//                                         const responseBody = "Done";
//                                         response = {
//                                             "statusCode": 200,
//                                             "body": JSON.stringify(responseBody),
//                                             "isBase64Encoded": false
//                                         };
//                                     }

//                                     else if (message.type === 'order') {
//                                         // console.log(message)
//                                         let from = message.from;
//                                         let message_order = message.order.product_items;
//                                         console.log(message_order)
//                                         for (const item of message_order) {
//                                             orderData.order.line_items.push({
//                                                 variant_id: item.product_retailer_id,
//                                                 quantity: item.quantity
//                                             });
//                                         }
                                        
//                                         let address = await getUserAddress.getUserAddress(from, WHATSAPP_TOKEN)
//                                         console.log(address)
//                                     }
//                                     else if (message.type === 'interactive') {
//                                         console.log("getting "+ message)
//                                         console.log(orderData.order.line_items)


//                                     }
//                                     // console.log(message)


//                                     // let orderDataArray = message_order.map((item) => {
//                                     //     console.log(item.product_retailer_id);
//                                     //     console.log(item.quantity);


//                                     // });


//                                     // console.log(orderData)

//                                     // // Create the orders outside of the mapping loop
//                                     let orders = await createOrder(orderData);
//                                     console.log(orders)
//                                     if(orders.status === 201){
//                                        console.log("Order Creates successfull")

//                                     }

//                                     // Log or process the results as needed
//                                     // console.log('Created orders:', orders);
//                                     // // const categories = await getProductCategories();
//                                     // console.log(value)
//                                     // console.log(from)
//                                     // console.log(message_body)
//                                     // let reply_message = "Welcome TO PromodeAgroFarms";

//                                     // await sendReply(phone_number_id, WHATSAPP_TOKEN, from, reply_message);
//                                     // await sendCatalogMessage(from, WHATSAPP_TOKEN);



//                                     // const responseBody = "Done";
//                                     // response = {
//                                     //     "statusCode": 200,
//                                     //     "body": JSON.stringify(responseBody),
//                                     //     "isBase64Encoded": false
//                                     // };

//                                 }
//                             }
//                         }
//                     }
//                 }
//             } catch (error) {
//                 console.error('Error in handler:', error);
//                 response = {
//                     "statusCode": 500,
//                     "body": JSON.stringify({ error: 'Internal Server Error' }),
//                     "isBase64Encoded": false
//                 };
//             }
//         } else {
//             const responseBody = "Unsupported method";
//             response = {
//                 "statusCode": 403,
//                 "body": JSON.stringify(responseBody),
//                 "isBase64Encoded": false
//             };
//         }
//     } catch (error) {
//         // Handle errors appropriately
//         console.error('Error in handler:', error);
//         response = {
//             "statusCode": 500,
//             "body": JSON.stringify({ error: 'Internal Server Error' }),
//             "isBase64Encoded": false
//         };
//     }

//     return response;
// };

// const sendReply = async (phone_number_id, whatsapp_token, to, reply_message) => {
//     try {
//         let json = {
//             messaging_product: "whatsapp",
//             to: to,
//             text: { body: reply_message },
//         };

//         let data = JSON.stringify(json);
//         let path = `/v18.0/${phone_number_id}/messages`;

//         let options = {
//             host: "graph.facebook.com",
//             path: path,
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//                 "Authorization": "Bearer " + whatsapp_token


//             }
//         };

//         console.log(options)

//         // Use a promise to handle the http request
//         const response = await new Promise((resolve, reject) => {
//             let req = https.request(options, (res) => {
//                 let str = "";
//                 res.on("data", (chunk) => {
//                     str += chunk;
//                 });
//                 res.on("end", () => {
//                     resolve(str);
//                 });
//             });

//             req.on("error", (e) => {
//                 reject(e);
//             });

//             req.write(data);
//             req.end();
//         });

//         // You can handle the response here if needed

//         return response;
//     } catch (error) {
//         console.error('Error in sendReply:', error);
//         throw error;
//     }
// };
require('dotenv').config();
const https = require("https");
const { createOrder } = require("./shopifyCatogory");
const { sendCatalogMessage } = require("./catlogMessage");
const getUserAddress = require("./whatsaap");

exports.handler = async (event) => {
    const VERIFY_TOKEN = "umran";
    const WHATSAPP_TOKEN = process.env.whatsapp_Token;

    console.log(WHATSAPP_TOKEN)

    try {
        if (event.httpMethod === "GET") {
            // Handle GET request for webhook verification
            const queryParams = event?.queryStringParameters;

            if (queryParams) {
                const mode = queryParams["hub.mode"];

                if (mode === "subscribe") {
                    const verifyToken = queryParams["hub.verify_token"];

                    if (verifyToken === VERIFY_TOKEN) {
                        const challenge = queryParams["hub.challenge"];
                        return {
                            "statusCode": 200,
                            "body": challenge,
                            "isBase64Encoded": false
                        };
                    } else {
                        const responseBody = "Error, wrong validation token";
                        return {
                            "statusCode": 403,
                            "body": JSON.stringify(responseBody),
                            "isBase64Encoded": false
                        };
                    }
                } else {
                    const responseBody = "Error, wrong mode";
                    return {
                        "statusCode": 403,
                        "body": JSON.stringify(responseBody),
                        "isBase64Encoded": false
                    };
                }
            } else {
                const responseBody = "Error, no query parameters";
                return {
                    "statusCode": 403,
                    "body": JSON.stringify(responseBody),
                    "isBase64Encoded": false
                };
            }
        } else if (event.httpMethod === "POST") {
            try {
                const body = JSON.parse(event.body);

                if (body && body.entry) {
                    for (const entry of body.entry) {
                        for (const change of entry.changes) {
                            const value = change.value;
                            var payment = false

                            if (value != null && value.messages != null) {
                                const phone_number_id = value.metadata.phone_number_id;

                                for (const message of value.messages) {
                                    var orderData = {
                                        order: {
                                            line_items: [],
                                            transactions: [
                                                {
                                                    kind: "sale",
                                                    status: "success",
                                                    amount: 20
                                                }
                                            ],
                                            currency: "INR"
                                        },
                                        saveOrder: {
                                            update: true
                                        }
                                    };

                                    if (message.type === 'text') {
                                        const from = message.from;
                                        const message_body = message.text.body;
                                        console.log(value, from, message_body);
                                        const reply_message = "Welcome TO PromodeAgroFarms";

                                        await sendReply(phone_number_id, WHATSAPP_TOKEN, from, reply_message);
                                        await sendCatalogMessage(from, WHATSAPP_TOKEN);

                                        return {
                                            "statusCode": 200,
                                            "body": JSON.stringify({ message: "Done" }),
                                            "isBase64Encoded": false
                                        };
                                    } else if (message.type === 'order') {
                                        const from = message.from;
                                        const message_order = message.order.product_items;

                                        for (const item of message_order) {
                                            orderData.order.line_items.push({
                                                variant_id: item.product_retailer_id,
                                                quantity: item.quantity

                                            });
                                        }
                                        const orders = await createOrder(orderData);
                                        console.log(orders)


                                        const address = await getUserAddress.getUserAddress(from, WHATSAPP_TOKEN);
                                        console.log(address);
                                    } else if (message.type === 'interactive') {
                                        console.log("Getting interactive message: ", message);
                                        console.log("Order Line Items: ", orderData.order.line_items);
                                        payment = true;
                                    }
                                    // if(payment){

                                    //     const orders = await createOrder(orderData);
                                    //     console.log(orders);
    
                                    //     if (orders.status === 201) {
                                    //         console.log("Order created successfully");
                                    //     }
                                    // }
                                    
                                    return {
                                        "statusCode": 200,
                                        "body": JSON.stringify({ message: "Done" }),
                                        "isBase64Encoded": false
                                    };
                                }
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Error in handler:', error);
                return {
                    "statusCode": 500,
                    "body": JSON.stringify({ error: 'Internal Server Error' }),
                    "isBase64Encoded": false
                };
            }
        } else {
            const responseBody = "Unsupported method";
            return {
                "statusCode": 403,
                "body": JSON.stringify(responseBody),
                "isBase64Encoded": false
            };
        }
    } catch (error) {
        console.error('Error in handler:', error);
        return {
            "statusCode": 500,
            "body": JSON.stringify({ error: 'Internal Server Error' }),
            "isBase64Encoded": false
        };
    }
};

const sendReply = async (phone_number_id, whatsapp_token, to, reply_message) => {
    try {
        const json = {
            messaging_product: "whatsapp",
            to: to,
            text: { body: reply_message },
        };

        const data = JSON.stringify(json);
        const path = `/v18.0/${phone_number_id}/messages`;

        const options = {
            host: "graph.facebook.com",
            path: path,
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + whatsapp_token
            }
        };

        console.log(options);

        // Use a promise to handle the http request
        const response = await new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let str = "";
                res.on("data", (chunk) => {
                    str += chunk;
                });
                res.on("end", () => {
                    resolve(str);
                });
            });

            req.on("error", (e) => {
                reject(e);
            });

            req.write(data);
            req.end();
        });

        // You can handle the response here if needed

        return response;
    } catch (error) {
        console.error('Error in sendReply:', error);
        throw error;
    }
};
