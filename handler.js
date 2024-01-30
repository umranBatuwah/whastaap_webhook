'use strict';
module.exports.hello = async (event) => {
  
  try {
    const queryParams = event.queryStringParameters || {};
    const mode = queryParams['hub.mode'];
    const challenge = queryParams['hub.challenge'];
    const token = queryParams['hub.verify_token'];
    const mytoken = 'umran';

    console.log('Received request:', event);

    if (mode && token) {
        if (mode === 'subscribe' && token === mytoken) {
            console.log('Verification successful!');
            return {
                statusCode: 200,
                body: challenge,
            };
        } else {
            console.error('Verification failed.');
            return {
                statusCode: 403,
                body: JSON.stringify({ error: 'Verification failed' }),
            };
        }
    } else {
        console.error('Missing parameters in the request.');
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Missing parameters in the request',
            
            mode: mode,
            token: token,
            challenge: challenge
              
              
            }),

        };
    }
} catch (error) {
    console.error('Error processing request:', error);
    return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Internal Server Error' }),
    };
}
  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
