// ==============================
// RAI CHATBOT — SHADOW DOM SAFE
// ==============================

(function () {

  if (document.getElementById("rai-shadow-host")) return;

  // Create shadow host
  const host = document.createElement("div");
  host.id = "rai-shadow-host";
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });

  // Load CSS inside shadow
  const style = document.createElement("style");
  style.textContent = `
@import url("https://rai-git-cloud---enc.pages.dev/rai.x3897.css");
`;
  shadow.appendChild(style);

  // Inject HTML (UNCHANGED)
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
<button id="ai-chat-btn">
  <div class="rai-robot friendly">
    <div class="antenna"></div>
    <span class="eye left"></span>
    <span class="eye right"></span>
    <div class="mouth"></div>
  </div>
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
`;
  shadow.appendChild(wrapper);

  // ======================
  // LOGIC (shadow-safe)
  // ======================

  const btn = shadow.getElementById("ai-chat-btn");
  const box = shadow.getElementById("ai-chat-box");
  const input = shadow.getElementById("ai-chat-input");
  const sendBtn = shadow.getElementById("ai-send-btn");
  const micBtn = shadow.getElementById("ai-mic-btn");
  const msgs = shadow.getElementById("ai-chat-messages");

  btn.onclick = () => {
    const open = box.style.display === "flex";
    box.style.display = open ? "none" : "flex";
    if (!open) setTimeout(() => input.focus(), 300);
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
    const q = input.value.trim();
    if (!q) return;

    addUserMessage(q);
    input.value = "";

    fetch("https://grateful790-rai-chatbot.hf.space/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q })
    })
      .then(r => r.json())
      .then(d => addBotMessage(d.answer || "No response"))
      .catch(() => addBotMessage("Server error"));
  }

})();
