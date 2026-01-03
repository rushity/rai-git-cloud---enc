// Inject UI
document.body.insertAdjacentHTML("beforeend", `
<button id="ai-chat-btn">
<svg class="rai-face" viewBox="0 0 58 58" preserveAspectRatio="xMidYMid meet">

  <defs>
    <linearGradient id="raiGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#00e5ff"/>
      <stop offset="100%" stop-color="#7c4dff"/>
    </linearGradient>
  </defs>

  <!-- Face group scaled UP -->
  <g transform="translate(-6,-6) scale(1.35)">
    <!-- Antenna -->
    <rect x="28" y="6" width="2" height="6" rx="1" fill="#7c4dff"/>
    <circle cx="29" cy="6" r="3" fill="#7c4dff"/>

    <!-- Face body -->
    <rect x="16" y="22" width="26" height="22" rx="10"
          fill="url(#raiGrad)"/>

    <!-- Eyes -->
    <circle class="eye" cx="22" cy="29" r="2.5" fill="#0b0f1a"/>
    <circle class="eye" cx="36" cy="29" r="2.5" fill="#0b0f1a"/>

    <!-- Mouth -->
    <rect class="mouth" x="24" y="36" width="10" height="3" rx="1.5"
          fill="#0b0f1a"/>
  </g>
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
  const open = box.style.display === "flex";
  box.style.display = open ? "none" : "flex";
  if (!open) setTimeout(() => input.focus(), 200);
};

// Initial message
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
