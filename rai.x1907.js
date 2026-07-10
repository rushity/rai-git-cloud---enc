// ==============================
// RAI CHATBOT – STRICT SHADOW DOM
// NO FUNCTIONALITY CHANGE
// ==============================

(function () {

  // prevent double load
  if (document.getElementById("rai-shadow-host")) return;

  // create shadow host
  const host = document.createElement("div");
  host.id = "rai-shadow-host";
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: "open" });
  const markedScript = document.createElement("script");
markedScript.src = "https://cdn.jsdelivr.net/npm/marked/marked.min.js";
document.head.appendChild(markedScript);

  // load your EXISTING css (UNCHANGED)
  const style = document.createElement("style");
  style.textContent = `
    @import url("https://rai-git-cloud---enc.pages.dev/rai.x3897.css");
  `;
  shadow.appendChild(style);

  // inject UI (HTML UNCHANGED)
  const root = document.createElement("div");
  root.innerHTML = `
<button id="ai-chat-btn">
  <div class="rai-robot friendly">
    <div class="antenna"></div>
    <span class="eye left"></span>
    <span class="eye right"></span>
    <div class="mouth"></div>
  </div>
</button>

<div id="ai-chat-box">
  <div id="ai-chat-header">

    <div class="rai-header-left">

       <div class="rai-avatar">
    <span class="rai-avatar-text">R</span>
</div>

        <div class="rai-header-info">

            <div class="rai-title">
                RAI Assistant
            </div>

            <div class="rai-status">
                <span class="online-dot"></span>
                Online
            </div>

        </div>

    </div>

    <div class="rai-header-right">

        <button id="rai-info-btn" class="header-btn" title="About RAI">

            <svg viewBox="0 0 24 24" class="header-icon">
                <path fill="currentColor"
                d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 4a1.25 1.25 0 110 2.5A1.25 1.25 0 0112 6zm1.2 12h-2.4v-7h2.4v7z"/>
            </svg>

        </button>

        <button id="rai-web-btn" class="header-btn" title="Visit Website">

            <svg viewBox="0 0 24 24" class="header-icon">
                <path fill="currentColor"
                d="M12 2A10 10 0 1022 12 10 10 0 0012 2zm6.92 9h-3.06a15.7 15.7 0 00-1.2-4.12A8.03 8.03 0 0118.92 11zm-6.92-7.02A13.2 13.2 0 0114 11h-4A13.2 13.2 0 0112 3.98zM9.34 6.88A15.7 15.7 0 008.14 11H5.08a8.03 8.03 0 014.26-4.12zM5.08 13h3.06a15.7 15.7 0 001.2 4.12A8.03 8.03 0 015.08 13zm6.92 7.02A13.2 13.2 0 0110 13h4a13.2 13.2 0 01-2 7.02zm2.66-2.9A15.7 15.7 0 0015.86 13h3.06a8.03 8.03 0 01-4.26 4.12z"/>
            </svg>

        </button>

        <button id="rai-close-btn" class="header-btn" title="Close">

            <svg viewBox="0 0 24 24" class="header-icon">
                <path fill="currentColor"
                d="M18.3 5.71L12 12l6.3 6.29-1.41 1.41L10.59 13.41 4.29 19.7 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29l6.3 6.3 6.29-6.3z"/>
            </svg>

        </button>

    </div>

</div>
  <div id="ai-chat-messages"></div>

  <div id="ai-chat-input-area">
    <input id="ai-chat-input" placeholder="Ask something..." />

    <button id="ai-mic-btn" class="circle-btn" title="Speak">
      <img src="https://raw.githubusercontent.com/rushity/rai-chatbot/main/assets/mic.png" alt="Mic">
    </button>

    <button id="ai-send-btn" class="circle-btn" title="Send">
      <img src="https://raw.githubusercontent.com/rushity/rai-chatbot/main/assets/send.png" alt="Send">
    </button>
  </div>
  <div id="rai-footer">

    <div class="footer-line"></div>

    <div class="footer-powered">

        <svg class="footer-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path
                fill="currentColor"
                d="M13 2L4 14h6l-1 8 9-12h-6L13 2z">
            </path>
        </svg>

        <span>
            Powered by <strong>Larxius Technologies</strong>
        </span>

    </div>

    <div class="footer-line"></div>

</div>
</div>
`;
  shadow.appendChild(root);

  // ======================
  // ORIGINAL LOGIC (SAME)
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
    if (!open) {
      setTimeout(() => input.focus(), 300);
    }
  };

  // Initial greeting
  addBotMessage("Hi 👋 I’m RAI. How can I help you today?");

  sendBtn.onclick = sendMessage;
  input.addEventListener("keydown", e => {
    if (e.key === "Enter") sendMessage();
  });

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

  if (window.marked) {
    text = marked.parse(text);
  }

  div.innerHTML = `<span class="rai-label">RAI:</span> ${text}`;

  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;

  return div;
}

 

async function typeBotMessage(text){

    const div = document.createElement("div");
    div.className = "chat-bubble ai-bot";

    div.innerHTML = `<span class="rai-label">RAI:</span>`;

    msgs.appendChild(div);

    let current = "";

    const speed = 10;

    for(let i=0;i<text.length;i++){

        current += text[i];

        if(window.marked){
            div.innerHTML = `<span class="rai-label">RAI:</span> ${marked.parse(current)}`;
        }else{
            div.innerHTML = `<span class="rai-label">RAI:</span> ${current}`;
        }

        msgs.scrollTop = msgs.scrollHeight;

        await new Promise(r=>setTimeout(r,speed));
    }
}

  function speakText(text) {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 1;
    utterance.pitch = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  let recognition;

  if ("webkitSpeechRecognition" in window) {
    recognition = new webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    micBtn.onclick = () => {
      micBtn.classList.add("listening");

      const listeningMsg = addSystemMessage("RAI is listening…");
      recognition.start();

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        input.value = transcript;

        micBtn.classList.remove("listening");
        listeningMsg.remove();

        sendMessage(true);
      };

      recognition.onerror = () => {
        micBtn.classList.remove("listening");
        listeningMsg.remove();
        addSystemMessage("Sorry, I couldn’t hear clearly.");
      };

      recognition.onend = () => {
        micBtn.classList.remove("listening");
      };
    };
  } else {
    micBtn.style.display = "none";
  }

  function sendMessage(fromVoice = false) {
    const question = input.value.trim();
    if (!question) return;

    addUserMessage(question);
    input.value = "";

    const thinking = document.createElement("div");
    thinking.className = "chat-bubble ai-bot thinking";
    thinking.innerHTML = `<span class="rai-label">RAI</span> is thinking`;
    msgs.appendChild(thinking);
    msgs.scrollTop = msgs.scrollHeight;

    fetch("https://grateful790-rai-chatbot.hf.space/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    })
      .then(res => res.json())
      .then(data => {
        thinking.remove();

       const reply = data.answer || "I couldn’t find an answer.";

      typeBotMessage(reply);

        if (fromVoice === true) {
          speakText(reply);
        }
      })
      .catch(() => {
        thinking.remove();
        addBotMessage("Sorry, I ran into a server issue.");
      });
  }

})();
