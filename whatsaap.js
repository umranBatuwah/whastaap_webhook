const axios = require('axios');

module.exports.getUserAddress = async (toNumber, whatsappToken) => {
    try {
        const myHeaders = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + whatsappToken
        };

        const addressMessageData = {
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": toNumber,
            "type": "interactive",
            "interactive": {
                "type": "address_message",
                "body": {
                    "text": "Thanks for your order! Tell us what address you’d like this order delivered to."
                },
                "action": {
                    "name": "address_message",
                    "parameters": {
                        "country": "IN"
                    }
                }
            }
        };

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            data: JSON.stringify(addressMessageData), // Convert to JSON string
            redirect: 'follow',
        };

        const response = await axios.post("https://graph.facebook.com/v19.0/208582795666783/messages", JSON.stringify(addressMessageData), requestOptions);
        const result = response.data;
        console.log(result);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw error;
    }
};