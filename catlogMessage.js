module.exports.sendCatalogMessage = async (phoneNumber,whatsappToken) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", "Bearer "+whatsappToken); // Replace with your actual access token

    const requestBody = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": phoneNumber,
        "type": "interactive",
        "interactive": {
            "type": "catalog_message",
            "body": {
                "text": "Fresh Fruits and Vegetables"
            },
            "action": {
                "name": "catalog_message",
                "parameters": {
                    "thumbnail_product_retailer_id": "47602216698168"
                }
            },
            "footer": {
                "text": "Get 10% discount"
            }
        }
    };

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(requestBody),
        redirect: 'follow'
    };

    try {
        const response = await fetch("https://graph.facebook.com/v19.0/208582795666783/messages", requestOptions);
        const result = await response.text();
        console.log(result);
    } catch (error) {
        console.error('Error:', error);
    }
}
