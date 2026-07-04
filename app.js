const GOOGLE_SCRIPT_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

const graduationDate = new Date("2027-11-10T00:00:00");

document.getElementById("date").valueAsDate = new Date();

function updateCountdown() {
  const now = new Date();
  const diff = graduationDate - now;

  if (diff <= 0) return;

  document.getElementById("days").textContent = Math.floor(diff / (1000 * 60 * 60 * 24));
  document.getElementById("hours").textContent = Math.floor((diff / (1000 * 60 * 60)) % 24);
  document.getElementById("minutes").textContent = Math.floor((diff / (1000 * 60)) % 60);
  document.getElementById("seconds").textContent = Math.floor((diff / 1000) % 60);
}

function getLocalEntries() {
  return JSON.parse(localStorage.getItem("clinicalStudyEntries")) || [];
}

function saveLocalEntries(entries) {
  localStorage.setItem("clinicalStudyEntries", JSON.stringify(entries));
}

async function saveEntry() {
  const date = document.getElementById("date").value;

  if (!date) {
    alert("Please select a date.");
    return;
  }

  const tasks = Array.from(document.querySelectorAll(".clinicalTask:checked"))
    .map(task => task.value);

  const entry = {
    date,
    patients: Number(document.getElementById("patients").value) || 0,
    tasks,
    clinicalNotes: document.getElementById("clinicalNotes").value.trim(),
    studyTopic: document.getElementById("studyTopic").value.trim(),
    studyHours: Number(document.getElementById("studyHours").value) || 0,
    studyMethod: document.getElementById("studyMethod").value,
    studyNotes: document.getElementById("studyNotes").value.trim(),
    submittedAt: new Date().toISOString()
  };

  let entries = getLocalEntries();
  entries = entries.filter(item => item.date !== entry.date);
  entries.push(entry);
  entries.sort((a, b) => new Date(b.date) - new Date(a.date));

  saveLocalEntries(entries);
  renderEntries();

  try {
    await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(entry)
    });

    showStatus("Saved locally and sent to Google Sheet.", "success");
  } catch (error) {
    showStatus("Saved locally, but Google Sheet upload failed.", "error");
  }

  resetForm();
}

function renderEntries() {
  const entries = getLocalEntries();
  const table = document.getElementById("logTable");

  table.innerHTML = "";

  let totalPatients = 0;
  let totalStudyHours = 0;
  let totalTasks = 0;

  entries.forEach(entry => {
    totalPatients += entry.patients;
    totalStudyHours += entry.studyHours;
    totalTasks += entry.tasks.length;

    const taskTags = entry.tasks
      .map(task => `<span class="tag">${task}</span>`)
      .join(" ");

    const row = document.createElement("tr");

    row.innerHTML = `
      <td><strong>${entry.date}</strong></td>
      <td>
        <strong>${entry.patients}</strong> patients seen<br>
        ${taskTags || "No clinical tasks selected"}<br>
        <small>${entry.clinicalNotes || ""}</small>
      </td>
      <td>
        <strong>${entry.studyTopic || "No topic entered"}</strong><br>
        ${entry.studyHours} hour(s) — ${entry.studyMethod || "No method selected"}<br>
        <small>${entry.studyNotes || ""}</small>
      </td>
    `;

    table.appendChild(row);
  });

  document.getElementById("totalDays").textContent = entries.length;
  document.getElementById("totalPatients").textContent = totalPatients;
  document.getElementById("totalStudyHours").textContent = totalStudyHours.toFixed(1);
  document.getElementById("totalTasks").textContent = totalTasks;
}

function resetForm() {
  document.getElementById("patients").value = "";
  document.getElementById("clinicalNotes").value = "";
  document.getElementById("studyTopic").value = "";
  document.getElementById("studyHours").value = "";
  document.getElementById("studyMethod").value = "";
  document.getElementById("studyNotes").value = "";

  document.querySelectorAll(".clinicalTask").forEach(task => {
    task.checked = false;
  });
}

function clearLocalData() {
  if (confirm("Delete all locally saved browser data?")) {
    localStorage.removeItem("clinicalStudyEntries");
    renderEntries();
  }
}

function showStatus(message, type) {
  const status = document.getElementById("statusMessage");
  status.textContent = message;
  status.style.color = type === "success" ? "green" : "red";
}

updateCountdown();
renderEntries();
setInterval(updateCountdown, 1000);
