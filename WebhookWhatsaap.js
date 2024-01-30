const axios = require('axios');

exports.handler = async (event) => {
    
    // const PHONE_NUMBER_ID = '208582795666783';
    const VERIFY_TOKEN = 'umran';
    console.log('Received event:', JSON.stringify(event));

    if (event.httpMethod === 'GET') {
        const hubVerifyToken = event.queryStringParameters['hub.verify_token'];
        if (hubVerifyToken === VERIFY_TOKEN) {
            const hubChallenge = event.queryStringParameters['hub.challenge'];
            return {
                statusCode: 200,
                body: hubChallenge,
            };
        } else {
            return {
                statusCode: 400,
                body: 'Unauthorized access',
            };
        }
    } else if (event.httpMethod === 'POST') {
        const body = JSON.parse(event.body);
        const entries = body.entry;

        for (const entry of entries) {
            const changes = entry.changes;

            for (const change of changes) {
                try {
                    const messages = change.value.messages;
                    await sendQuickReply('918317582549', messageId, 'Hello');
                    for (const message of messages) {
                        const fromNumber = message.from;
                        const messageId = message.id;

                        console.log('Received message from:', fromNumber);
                        console.log('Message ID:', messageId);

                        // Quick reply with "Hello" template
                    }
                } catch (error) {
                    console.error('Error processing message:', error);
                }
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ Message: 'Message accepted' }),
        };
    } else {
        return {
            statusCode: 403,
            body: 'Request not recognized',
        };
    }
};

async function sendQuickReply(toNumber, messageId, text, token) {
    try {
        const url = `https://graph.facebook.com/v18.0/208582795666783/messages`;

        const headers = {
            'Content-Type': 'application/json',
            'Authorization': "Bearer " + token ,
        };

        const data = {
            messaging_product: 'whatsapp',
            to: toNumber,
            type: 'template',
            template: {
                name: 'text',
                language: {
                    code: 'en_US',
                },
                components: [
                    {
                        type: 'body',
                        text: text,
                    },
                ],
            },
        };

        await axios.post(url, data, { headers });
    } catch (error) {
        console.error('Error sending quick reply:', error);
    }
}
