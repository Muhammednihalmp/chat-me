const BOT_TOKEN = "7239458839:AAHTXtF23O2Zfe7q1OSOTtpQvbCjXCflFAg";  // Replace with your Telegram Bot Token
const CHAT_ID = "5541151768";      // Replace with your Telegram Chat ID

let lastUpdateId = 0; // Track last update to avoid duplicate messages

// Function to send messages to Telegram bot
function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const params = {
        chat_id: CHAT_ID,
        text: message,
    };

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
    })
    .then(response => response.json())
    .then(data => console.log("Message sent:", data))
    .catch(error => console.error("Error:", error));
}

// Send notification to Telegram when the page loads
window.onload = function() {
    const openMessage = `🚨 WEB APP OPENED 🚨\n[Opened at ${new Date().toLocaleTimeString()}]`;
    sendToTelegram(openMessage);
};

function sendMessage() {
    const input = document.getElementById('messageInput');
    const messageArea = document.getElementById('messageArea');

    if (input.value.trim() !== '') {
        // Display user message
        appendMessage(input.value, "user");

        // Send chat message to Telegram
        sendToTelegram(input.value);

        // Clear input
        input.value = '';
    }
}

// Function to listen for incoming messages from Telegram bot
function listenForMessages() {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/getUpdates?offset=${lastUpdateId + 1}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (data.result.length > 0) {
                data.result.forEach(update => {
                    if (update.message && update.message.chat.id == CHAT_ID) {
                        // Display bot response
                        appendMessage(update.message.text, "bot");
                        lastUpdateId = update.update_id; // Update the last seen message
                    }
                });
            }
        })
        .catch(error => console.error("Error fetching messages:", error));
}

// Function to add messages to chat UI
function appendMessage(text, sender) {
    const messageArea = document.getElementById('messageArea');
    const messageDiv = document.createElement('div');
    
    messageDiv.classList.add('message');
    messageDiv.classList.add(sender === "user" ? 'user-message' : 'bot-message');
    messageDiv.textContent = text;

    messageArea.appendChild(messageDiv);
    messageArea.scrollTop = messageArea.scrollHeight; // Auto scroll
}

// Clear messages function
function clearMessages() {
    document.getElementById('messageArea').innerHTML = '';
}

// Periodically check for new messages (every 3 seconds)
setInterval(listenForMessages, 3000);

// Send message when Enter key is pressed
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
