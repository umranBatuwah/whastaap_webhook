const axios = require('axios');
module.exports.sendMessage = async (event) => {
    try {
        // Parse the event body as JSON if it's a string
        let bodyParams = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        const token = "";

        console.log(JSON.stringify(bodyParams, null, 2));

        if (bodyParams.object) {
            console.log("Inside body param");
            if (bodyParams.entry &&
                bodyParams.entry[0].changes &&
                bodyParams.entry[0].changes[0].value.messages &&
                bodyParams.entry[0].changes[0].value.messages[0]) {

                // Extract relevant information from the incoming message
                let phoneNumberId = bodyParams.entry[0].changes[0].value.metadata.phone_number_id;
                let from = bodyParams.entry[0].changes[0].value.messages[0].from;
                let msgBody = bodyParams.entry[0].changes[0].value.messages[0].text.body;

                console.log("Phone number: " + phoneNumberId);
                console.log("From: " + from);
                console.log("Body param: " + msgBody);

                // Your axios POST request here to send a response
                await axios({
                    method: "POST",
                    url: `https://graph.facebook.com/v18.0/208582795666783/messages?access_token=${token}`,
                    data: {
                        messaging_product: "whatsapp",
                        to: from,
                        text: {
                            body: `Hi.. I'm Prasath, your message is ${msgBody}`
                        }
                    },
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                return {
                    statusCode: 200,
                    body: 'Message processed successfully',
                };
            } else {
                return {
                    statusCode: 404,
                    body: 'Invalid request format',
                };
            }
        } else {
            return {
                statusCode: 404,
                body: 'Invalid request format',
            };
        }
    } catch (error) {
        console.error('Error processing request:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
        };
    }
};
