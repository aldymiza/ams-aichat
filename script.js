document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const loadingIndicator = document.getElementById('loading-indicator');
    const sendBtn = document.getElementById('send-btn');

    let conversationHistory = [];

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        addMessageToBox(userMessage, 'user');

        conversationHistory.push({ role: 'user', parts: [{ text: userMessage }] });

        userInput.value = '';
        showLoading(true);

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ history: conversationHistory }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Terjadi kesalahan pada server');
            }

            const data = await response.json();
            const botMessage = data.response;

            addMessageToBox(botMessage, 'bot');

            conversationHistory.push({ role: 'model', parts: [{ text: botMessage }] });

        } catch (error) {
            console.error('Error:', error);
            addMessageToBox(`Error: ${error.message}`, 'bot');
        } finally {
            showLoading(false);
        }
    });

    function addMessageToBox(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);

        const p = document.createElement('p');
        p.textContent = message;
        messageElement.appendChild(p);

        chatBox.appendChild(messageElement);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function showLoading(isLoading) {
        if (isLoading) {
            loadingIndicator.classList.remove('hidden');
            sendBtn.disabled = true;
        } else {
            loadingIndicator.classList.add('hidden');
            sendBtn.disabled = false;
        }
    }
});