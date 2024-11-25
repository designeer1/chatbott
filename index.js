// Select the input field, chat container, and button elements
let prompt = document.querySelector("#prompt");
let chatContainer = document.querySelector(".chat-content");
const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyBbfDzeSqaEqbH0yGuniZvkV4ARl2hzSzk";

// User object to store message
let user = {
    data: null,
    imageUrl: null
};

// Function to generate response from the API
async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");

    let requestOption = {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            model: "gemini-1.5-flash",
            contents: [
                {
                    parts: [
                        {
                            text: user.data
                        }
                    ]
                }
            ]
        })
    };

    try {
        // Sending the request to the API
        let response = await fetch(Api_Url, requestOption);
        let data = await response.json();
        console.log("API Response:", data); // Log the full response to check the structure

        // Ensure valid response structure
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content) {
            let apiResponse = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
            console.log("Bot Response:", apiResponse); // Log the parsed response

            // Insert the bot's response into the chat area
            text.innerHTML = apiResponse;

            // Scroll the chat container to the bottom to see the new message
            chatContainer.scrollTop = chatContainer.scrollHeight;
        } else {
            console.error("Invalid API response format.");
        }
    } catch (error) {
        console.log("Error in fetching the AI response:", error);
    }
}

// Function to create a new chat box
function createChatBox(html, classes) {
    let div = document.createElement("div");
    div.innerHTML = html;
    div.classList.add(classes);
    return div;
}

// Function to handle chat response
function handleChatResponse(message) {
    if (message.trim() === "" && !user.imageUrl) return; // Avoid sending empty messages

    let html = `
        <div class="user-chat-box">
            <img src="https://www.pngitem.com/pimgs/m/93-937516_office-worker-outline-free-people-icons-svg-psd.png" alt="" id="userimage" width="50">
            <div class="user-chat-area">
                ${user.data}
            </div>
        </div>
    `;

    if (user.imageUrl) {
        html = `
            <div class="user-chat-box">
                <img src="https://www.pngitem.com/pimgs/m/93-937516_office-worker-outline-free-people-icons-svg-psd.png" alt="" id="userimage" width="50">
                <div class="user-chat-area">
                    <img src="${user.imageUrl}" alt="Uploaded Image" style="max-width: 100%; border-radius: 10px;">
                </div>
            </div>
        `;
    }

    // Append user's chat box to the chat container
    let userChatBox = createChatBox(html, "user-chat-box");
    chatContainer.appendChild(userChatBox);

    // Scroll the chat container to the bottom to see the new message
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Create a delay to simulate bot response time
    setTimeout(() => {
        let html = `
            <div class="ai-chat-box">
                <img src="https://img.freepik.com/premium-photo/robot-chatbot-ai-bot-cartoon-logo-badge-design-symbol-cartoon-flat-style-illustration-generative-ai_159242-28179.jpg" alt="" id="aiimage" width="70">
                <div class="ai-chat-area"></div>
            </div>
        `;

        // Append AI's chat box to the chat container
        let aiChatBox = createChatBox(html, "ai-chat-box");
        chatContainer.appendChild(aiChatBox);

        // Call the API to get the bot's response
        generateResponse(aiChatBox);
    }, 100);
}

// Listen for "Enter" key press and call handleChatResponse
prompt.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault(); // Prevent default behavior (new line or form submit)

        // Only call handleChatResponse if prompt has a valid value (not null or empty)
        if (prompt.value.trim() && !user.imageUrl) {
            user.data = prompt.value;  // Store the prompt value
            handleChatResponse(prompt.value); // Handle the chat response
            prompt.value = '';  // Clear input after sending text
        }
    }
});

// Listen for image button click to open the file upload dialog
let imageButton = document.querySelector("#image");
let imageUploadInput = document.querySelector("#imageUpload"); // File input for image upload

imageButton.addEventListener("click", () => {
    imageUploadInput.click(); // Trigger the file input dialog
});

// When a file is selected, handle the image
imageUploadInput.addEventListener("change", (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
        const reader = new FileReader();

        reader.onload = function(e) {
            user.imageUrl = e.target.result; // Store the image URL
            prompt.value = '';  // Clear the input field after uploading image
            handleChatResponse(""); // Call the function to send the image in chat
        };

        reader.readAsDataURL(file); // Read the file as a data URL
    }
});

// You can also add click event listeners for the submit button if you want
document.querySelector("#submit").addEventListener("click", () => {
    // Ensure the value is not empty and image isn't selected
    if (prompt.value.trim() && !user.imageUrl) {
        user.data = prompt.value;  // Store the prompt value
        handleChatResponse(prompt.value); // Handle the chat response
        prompt.value = '';  // Clear input after sending text
    }
});
