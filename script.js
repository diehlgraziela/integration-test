import { formatDate, getTimeOpen } from "./helpers.js";

const TARGET_ORIGIN_URL = "http://localhost:5173";

let conversation = null;

function requestData() {
  console.log("INTEGRAÇÃO: data requested");

  window.parent.postMessage(
    {
      type: "get",
      payload: {
        fields: ["*"],
        customFields: ["cpf_customer"],
      },
    },
    TARGET_ORIGIN_URL,
  );
}

function triggerMessage(text) {
  window.parent.postMessage(
    {
      type: "action",
      payload: {
        action: "replace_writingbar_content",
        message: text,
      },
    },
    TARGET_ORIGIN_URL,
  );
}

function listenToMessages() {
  window.addEventListener("message", (event) => {
    const data = event.data;

    console.log("INTEGRAÇÃO: ouvindo mensagens", data);

    if (data.type === "chat_context") {
      conversation = data.payload;
      renderConversation();
    }

    if (data.type === "integration_error") {
      console.error("Erro recebido do inbox:", data.error);
    }
  });
}

function renderConversation() {
  if (!conversation) return;

  document.getElementById("loading").style.display = "none";
  document.getElementById("error").style.display = "none";

  document.getElementById("name").textContent = conversation.contactName || "—";
  document.getElementById("createdAt").textContent = formatDate(conversation.createdAt) || "—";
  document.getElementById("updatedAt").textContent = conversation.updatedAt ? formatDate(conversation.updatedAt) : "—";
  document.getElementById("department").textContent = conversation.department || "—";
  document.getElementById("tags").textContent = conversation.tags || "—";
  document.getElementById("openTime").textContent = getTimeOpen(conversation.createdAt) || "—";
  document.getElementById("customField").innerHTML = JSON.stringify(conversation.customFields) || "-";
}

function showLoading() {
  document.getElementById("loading").style.display = "block";
}

function showError() {
  document.getElementById("error").style.display = "block";
}

function copyContactId() {
  navigator.clipboard.writeText(conversation.contactId).then(() => {
    console.log("Contact ID copied to clipboard");
  });
}

function sendOrderInfo() {
  const name = conversation.contactName;
  const cpf = conversation.customFields?.cpf_customer || "Não informado";

  triggerMessage(`Aqui estão as informações sobre o pedido nº *123456*\n *Comprador:* ${name}\n *CPF:* ${cpf}`);
}

setInterval(() => {
  if (conversation) {
    document.getElementById("openTime").textContent = getTimeOpen(conversation.createdAt);
  }
}, 60000);

document.getElementById("refreshBtn").addEventListener("click", requestData);
document.getElementById("copyContactIdBtn").addEventListener("click", copyContactId);
document.getElementById("sendOrderInfoBtn").addEventListener("click", sendOrderInfo);

listenToMessages();
requestData();
