const https = require("https");
const { getProductCategories, sendWhatsAppMessage } = require("./shopifyCatogory");
const { env } = require("process");

exports.handler = async (event) => {
  const VERIFY_TOKEN = "umran";
  const WHATSAPP_TOKEN = process.env.whatsapp_Token;

  let response;

  try {
    if (event.httpMethod === "GET") {
      // Handle GET request for webhook verification
      let queryParams = event?.queryStringParameters;
      console.log(queryParams);

      if (queryParams) {
        const mode = queryParams["hub.mode"];

        if (mode === "subscribe") {
          const verifyToken = queryParams["hub.verify_token"];

          if (verifyToken === VERIFY_TOKEN) {
            let challenge = queryParams["hub.challenge"];
            response = {
              "statusCode": 200,
              "body": challenge,
              "isBase64Encoded": false
            };
          } else {
            const responseBody = "Error, wrong validation token";
            response = {
              "statusCode": 403,
              "body": JSON.stringify(responseBody),
              "isBase64Encoded": false
            };
          }
        } else {
          const responseBody = "Error, wrong mode";
          response = {
            "statusCode": 403,
            "body": JSON.stringify(responseBody),
            "isBase64Encoded": false
          };
        }
      } else {
        const responseBody = "Error, no query parameters";
        response = {
          "statusCode": 403,
          "body": JSON.stringify(responseBody),
          "isBase64Encoded": false
        };
      }
    } else if (event.httpMethod === "POST") {
      try {
        let body = JSON.parse(event.body);
        console.log(body);

        if (body && body.entry) {
          for (let entry of body.entry) {
            for (let change of entry.changes) {
              let value = change.value;

              if (value != null && value.messages != null) {
                let phone_number_id = value.metadata.phone_number_id;

                for (let message of value.messages) {
                  if (message.type === 'text') {
                    let from = message.from;
                    let message_body = message.text.body;
                    const categories = await getProductCategories();
                    console.log(value)
                    console.log(from)
                    console.log(message_body)
                    let reply_message = "Welcome TO PromodeAgroFarms   veiw our catlog https://wa.me/c/919701610033";

                    await sendReply(phone_number_id, WHATSAPP_TOKEN, from, reply_message);

                    // Use Promise.all to wait for all messages to be sent
                    // await Promise.all(categories.map(async category => {
                    //   console.log(category.title);
                    //   return sendWhatsAppMessage(from, category.title, 'https://www.freshfruitsbasket.com/wp-content/uploads/2017/02/avasflowers-bon-appetit-fruit-basket_max.jpg', WHATSAPP_TOKEN);
                    // }));

                    const responseBody = "Done";
                    response = {
                      "statusCode": 200,
                      "body": JSON.stringify(responseBody),
                      "isBase64Encoded": false
                    };
                  }
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error in handler:', error);
        response = {
          "statusCode": 500,
          "body": JSON.stringify({ error: 'Internal Server Error' }),
          "isBase64Encoded": false
        };
      }
    } else {
      const responseBody = "Unsupported method";
      response = {
        "statusCode": 403,
        "body": JSON.stringify(responseBody),
        "isBase64Encoded": false
      };
    }
  } catch (error) {
    // Handle errors appropriately
    console.error('Error in handler:', error);
    response = {
      "statusCode": 500,
      "body": JSON.stringify({ error: 'Internal Server Error' }),
      "isBase64Encoded": false
    };
  }

  return response;
};

const sendReply = async (phone_number_id, whatsapp_token, to, reply_message) => {
  try {
    let json = {
      messaging_product: "whatsapp",
      to: to,
      text: { body: reply_message },
    };

    let data = JSON.stringify(json);
    let path = `/v18.0/${phone_number_id}/messages?access_token=${whatsapp_token}`;

    let options = {
      host: "graph.facebook.com",
      path: path,
      method: "POST",
      headers: { "Content-Type": "application/json" }
    };

    // Use a promise to handle the http request
    const response = await new Promise((resolve, reject) => {
      let req = https.request(options, (res) => {
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
