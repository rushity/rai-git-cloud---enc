// Inject UI
document.body.insertAdjacentHTML("beforeend", `
    
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
    <img src="https://raw.githubusercontent.com/rushity/rai-chatbot/main/assets/mic.png" alt="Mic">
  </button>

  <button id="ai-send-btn" class="circle-btn" title="Send">
    <img src="https://raw.githubusercontent.com/rushity/rai-chatbot/main/assets/send.png" alt="Send">
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

// btn.onclick = () => {
//     box.style.display = box.style.display === "flex" ? "none" : "flex";
// };
btn.onclick = () => {
  const open = box.style.display === "flex";
  box.style.display = open ? "none" : "flex";
  if (!open) {
    setTimeout(() => input.focus(), 300);
  }
};


// Initial greeting
addBotMessage(
  "Hi 👋 I’m RAI. How can I help you today?"
);

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


function speakText(text) {
  if (!("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;

  window.speechSynthesis.cancel(); // stop previous
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

      // AUTO SEND after voice input
      sendMessage(true); // true = from voice
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
  addBotMessage(reply);

  // 🔊 Speak ONLY if message came from mic
  if (fromVoice === true) {
    speakText(reply);
  }
})

    .catch(() => {
      thinking.remove();
      addBotMessage("Sorry, I ran into a server issue.");
    });
}
