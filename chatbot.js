const API_KEY = "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";
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const chatForm = document.getElementById("chatForm");
const messageInput = document.getElementById("messageInput");
const chatMessages = document.getElementById("chatMessages");

const conversation = [
    {
        role: "system",
        content: "You are LaunchPad AI, a professional startup mentor."
    }
];

function addMessage(role, text) {

    const p = document.createElement("p");

    if (role === "user") {
        p.innerHTML = "<strong>You:</strong> " + text;
    } else {
        p.innerHTML = "<strong>LaunchPad AI:</strong> " + text;
    }

    chatMessages.appendChild(p);

    chatMessages.scrollTop = chatMessages.scrollHeight;
}

chatForm.addEventListener("submit", async function (event) {

    event.preventDefault();   // Stops the page from refreshing

    const userMessage = messageInput.value.trim();

    if (userMessage === "") {
        return;
    }

    addMessage("user", userMessage);

    conversation.push({
        role: "user",
        content: userMessage
    });

    messageInput.value = "";

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },

            body: JSON.stringify({

                model: MODEL,

                messages: conversation

            })

        });

        const data = await response.json();

        const reply = data.choices[0].message.content;

        conversation.push({
            role: "assistant",
            content: reply
        });

        addMessage("assistant", reply);

    } catch (error) {

        console.log(error);

        addMessage("assistant", "Something went wrong.");

    }

});
