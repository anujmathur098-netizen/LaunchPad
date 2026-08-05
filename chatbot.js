const API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");
const sendButton = document.getElementById("sendButton");

const conversation = [
    {
        role: "system",
        content: "You are LaunchPad AI, a professional startup mentor."
    }
];

function addMessage(role, text) {
    const message = document.createElement("p");
    const label = document.createElement("strong");

    label.textContent = role === "user" ? "You: " : "LaunchPad AI: ";
    message.append(label, document.createTextNode(text));
    chatMessages.appendChild(message);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function setLoading(isLoading) {
    sendButton.disabled = isLoading;
    messageInput.disabled = isLoading;
    sendButton.querySelector("span").textContent = isLoading ? "Sending..." : "Send";
}

chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const userMessage = messageInput.value.trim();
    if (!userMessage) return;

    addMessage("user", userMessage);
    conversation.push({ role: "user", content: userMessage });
    messageInput.value = "";
    setLoading(true);

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({ model: MODEL, messages: conversation })
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            throw new Error(data.error?.message || `Groq request failed (HTTP ${response.status}).`);
        }

        const reply = data.choices?.[0]?.message?.content;
        if (!reply) {
            throw new Error("Groq returned a response without a message.");
        }

        conversation.push({ role: "assistant", content: reply });
        addMessage("assistant", reply);
    } catch (error) {
        console.error("Groq request failed:", error);
        addMessage("assistant", `Sorry, I could not respond: ${error.message}`);
    } finally {
        setLoading(false);
        messageInput.focus();
    }
});

