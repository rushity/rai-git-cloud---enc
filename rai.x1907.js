// Inject UI
document.body.insertAdjacentHTML("beforeend", `
<button id="ai-chat-btn">
  <svg class="rai-face" viewBox="0 0 48 48" width="26" height="26">
    <defs>
      <linearGradient id="raiGrad" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="#00e5ff"/>
        <stop offset="100%" stop-color="#7c4dff"/>
      </linearGradient>
    </defs>

    <!-- Antenna -->
    <rect x="23" y="2" width="2" height="6" rx="1" fill="#7c4dff"/>
    <circle cx="24" cy="2" r="3" fill="#7c4dff"/>

    <!-- Face body (MATCHES 26x22 ratio) -->
    <rect x="11" y="10" width="26" height="22" rx="10"
          fill="url(#raiGrad)"/>

    <!-- Eyes -->
    <circle cx="19" cy="18" r="2.5" fill="#0b0f1a"/>
    <circle cx="29" cy="18" r="2.5" fill="#0b0f1a"/>

    <!-- Mouth -->
    <rect x="19" y="25" width="10" height="3" rx="1.5"
          fill="#0b0f1a"/>
  </svg>
</button>


<div id="ai-chat-box">
  <div id="ai-chat-header">RAI — AI Assistant</div>
  <div id="ai-chat-messages"></div>
  <div id="ai-chat-input-area">
    <input id="ai-chat-input" placeholder="Ask something..." />

    <button id="ai-mic-btn" class="circle-btn">
      <img src="https://raw.githubusercontent.com/rushity/rai-chatbot/main/assets/mic.png">
    </button>

    <button id="ai-send-btn" class="circle-btn">
      <img src="https://raw.githubusercontent.com/rushity/rai-chatbot/main/assets/send.png">
    </button>
  </div>
</div>
`);

const btn = document.getElementById("ai-chat-btn");
const box = document.getElementById("ai-chat-box");
const input = document.getElementById("ai-chat-input");
const sendBtn = document.getElementById("ai-send-btn");
const micBtn = document.getElementById("ai-mic-btn");
const msgs = document.getElementById("ai-chat-messages");

btn.onclick = () => {
  box.style.display = box.style.display === "flex" ? "none" : "flex";
  setTimeout(() => input.focus(), 200);
};

addBotMessage("Hi 👋 I’m RAI. How can I help you today?");

sendBtn.onclick = sendMessage;
input.addEventListener("keydown", e => {
  if (e.key === "Enter") sendMessage();
});

function addUserMessage(text) {
  const div = document.createElement("div");
  div.className = "chat-bubble ai-user";
  div.innerText = text;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function addBotMessage(text) {
  const div = document.createElement("div");
  div.className = "chat-bubble ai-bot";
  div.innerHTML = `<span class="rai-label">RAI:</span> ${text}`;
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

function sendMessage() {
  const question = input.value.trim();
  if (!question) return;

  addUserMessage(question);
  input.value = "";

  btn.classList.add("rai-speaking");

  fetch("https://grateful790-rai-chatbot.hf.space/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question })
  })
    .then(res => res.json())
    .then(data => {
      addBotMessage(data.answer || "No response.");
      btn.classList.remove("rai-speaking");
    })
    .catch(() => {
      addBotMessage("Server error.");
      btn.classList.remove("rai-speaking");
    });
}
