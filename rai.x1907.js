// ==============================
// RAI CHATBOT – SAFE INJECTION
// ==============================

(function () {

  // Prevent double load
  if (document.getElementById("rai-widget-root")) return;

  document.body.insertAdjacentHTML("beforeend", `
    <div id="rai-widget-root">

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

          <button id="ai-mic-btn" class="circle-btn" title="Speak">
            <img src="https://raw.githubusercontent.com/rushity/rai-chatbot/main/assets/mic.png">
          </button>

          <button id="ai-send-btn" class="circle-btn" title="Send">
            <img src="https://raw.githubusercontent.com/rushity/rai-chatbot/main/assets/send.png">
          </button>
        </div>
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
    return div;
  }

  function addSystemMessage(text) {
    const div = document.createElement("div");
    div.className = "chat-bubble ai-bot";
    div.style.fontStyle = "italic";
    div.style.opacity = "0.7";
    div.innerHTML = `<span class="rai-label">RAI:</span> ${text}`;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
    return div;
  }

  function speakText(text) {
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  }

  let recognition;
  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";

    micBtn.onclick = () => {
      micBtn.classList.add("listening");
      const listening = addSystemMessage("RAI is listening…");
      recognition.start();

      recognition.onresult = e => {
        input.value = e.results[0][0].transcript;
        micBtn.classList.remove("listening");
        listening.remove();
        sendMessage(true);
      };

      recognition.onerror = () => {
        micBtn.classList.remove("listening");
        listening.remove();
      };

      recognition.onend = () => {
        micBtn.classList.remove("listening");
      };
    };
  } else {
    micBtn.style.display = "none";
  }

  function sendMessage(fromVoice = false) {
    const q = input.value.trim();
    if (!q) return;

    addUserMessage(q);
    input.value = "";

    const thinking = document.createElement("div");
    thinking.className = "chat-bubble ai-bot thinking";
    thinking.innerHTML = `<span class="rai-label">RAI</span> is thinking`;
    msgs.appendChild(thinking);
    msgs.scrollTop = msgs.scrollHeight;

    fetch("https://grateful790-rai-chatbot.hf.space/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question: q })
    })
      .then(r => r.json())
      .then(d => {
        thinking.remove();
        const reply = d.answer || "I couldn’t find an answer.";
        addBotMessage(reply);
        if (fromVoice) speakText(reply);
      })
      .catch(() => {
        thinking.remove();
        addBotMessage("Sorry, server issue.");
      });
  }

})();
