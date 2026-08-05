const API_URL = "/api/chat";
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

        // Send the conversation to a server-side endpoint. The server should store the API key
        // in an environment variable and forward this request to the provider. This keeps the
        // API key out of client-side code.
        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                model: MODEL,

                messages: conversation

            })

        });

        if (!response.ok) {
            const errText = await response.text();
            throw new Error(`Server responded ${response.status}: ${errText}`);
        }

        const data = await response.json();

        const reply = data.choices?.[0]?.message?.content || data.reply || "(no reply)";

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
