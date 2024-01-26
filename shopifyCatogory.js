const axios = require('axios');

module.exports.getProductCategories = async () => {
    try {
        const response = await axios.get("https://44308b.myshopify.com/admin/api/2024-01/custom_collections.json", {
            headers: {
                'Content-Type': 'application/json',
                'X-Shopify-Access-Token': process.env.shopify,
            },
        });
        return response.data.custom_collections;
    } catch (error) {
        console.error('Error fetching Shopify categories:', error);
        throw error;
    }
}

module.exports.sendWhatsAppMessage = async (toNumber, productname, image, whatsappToken) => {
    try {
        const myHeaders = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + whatsappToken
        };

        const raw = JSON.stringify({
            "messaging_product": "whatsapp",
            "recipient_type": "individual",
            "to": toNumber,
            "type": "template",
            "template": {
                "name": "shopify_products",
                "language": {
                    "code": "en"
                },
                "components": [
                    {
                        "type": "header",
                        "parameters": [
                            {
                                "type": "image",
                                "image": {
                                    "link": image
                                }
                            }
                        ]
                    },
                    {
                        "type": "body",
                        "parameters": [
                            {
                                "type": "text",
                                "text": productname
                            }
                        ]
                    }
                ]
            }
        });


        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            data: raw, // 'data' instead of 'body' for axios
            redirect: 'follow',
        };

        const response = await axios.post("https://graph.facebook.com/v17.0/208582795666783/messages", raw, requestOptions);
        const result = response.data;
        console.log(result);
    } catch (error) {
        console.error('Error sending WhatsApp message:', error);
        throw error;
    }
}

async function fetchAndLogCategories() {
    try {
        const categories = await exports.getProductCategories();
        console.log(categories);
    } catch (error) {
        console.error('Error:', error);
    }
}

// Invoke the async function
fetchAndLogCategories();
