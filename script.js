let reactionCount = 0;
let totalReactionTime = 0;
let maxTrials = 5;
let timeoutId, startTime;

function startTest() {
  document.querySelector("form").style.display = "none";
  document.getElementById("reactionTest").style.display = "block";
  reactionCount = 0;
  totalReactionTime = 0;
  runReactionTrial();
}

function runReactionTrial() {
  document.getElementById("reactionResult").textContent = `Percobaan ${reactionCount + 1} dari ${maxTrials}`;
  const delay = Math.random() * 4000 + 1000;
  timeoutId = setTimeout(() => {
    document.getElementById("beepSound").play();
    document.getElementById("targetCircle").classList.remove("hidden");
    startTime = new Date().getTime();
  }, delay);
}

document.getElementById("targetCircle").addEventListener("click", () => {
  const endTime = new Date().getTime();
  const reactionTime = endTime - startTime;
  totalReactionTime += reactionTime;
  reactionCount++;

  document.getElementById("targetCircle").classList.add("hidden");
  document.getElementById("reactionResult").textContent = `Waktu: ${reactionTime} ms`;

  if (reactionCount < maxTrials) {
    setTimeout(runReactionTrial, 1000);
  } else {
    const avgTime = totalReactionTime / maxTrials;
    const result = avgTime < 500 ? "Normal" : "Fatigue";
    document.getElementById("reactionResult").textContent = `Rata-rata: ${avgTime.toFixed(0)} ms — ${result}`;
    document.getElementById("resultFatigue").value = result;
    setTimeout(backToForm, 3000);
  }
});

function backToForm() {
  clearTimeout(timeoutId);
  document.getElementById("reactionTest").style.display = "none";
  document.querySelector("form").style.display = "block";
  document.getElementById("targetCircle").classList.add("hidden");
  document.getElementById("reactionResult").textContent = "";
}

// Tampilkan jam realtime
function updateClock() {
  const now = new Date();
  const timeString = now.toLocaleString("id-ID");
  document.getElementById("liveTime").textContent = timeString;
}
setInterval(updateClock, 1000);
updateClock();

function saveData() {
  const data = {
    kodePlant: document.getElementById('kodePlant').value,
    namaDriver: document.getElementById('namaDriver').value,
    usia: document.getElementById('usia').value,
    namaTransporter: document.getElementById('namaTransporter').value,
    noDo: document.getElementById('noDo').value,
    noTruck: document.getElementById('noTruck').value,
    nikSbi: document.getElementById('nikSbi').value,
    sistolik: document.getElementById('sistolik').value,
    diastolik: document.getElementById('diastolik').value,
    pulse: document.getElementById('pulse').value,
    alcohol: document.getElementById('alcohol').value,
    tanggal: new Date().toLocaleString("id-ID"),
    result: document.getElementById('resultFatigue').value
  };

  let logs = JSON.parse(localStorage.getItem("fatigueLogs") || "[]");
  logs.push(data);
  localStorage.setItem("fatigueLogs", JSON.stringify(logs));
  alert("Data berhasil disimpan ke penyimpanan lokal.");
}

function resetForm() {
  document.getElementById("fatigueForm").reset();
  document.getElementById("resultFatigue").value = "";
}

function exportCSV() {
  const logs = JSON.parse(localStorage.getItem("fatigueLogs") || "[]");
  if (logs.length === 0) {
    alert("Belum ada data yang disimpan.");
    return;
  }

  const headers = Object.keys(logs[0]);
  const rows = logs.map(obj => headers.map(h => `"${obj[h] || ''}"`).join(','));
  const csvContent = [headers.join(','), ...rows].join('\n');

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "fatigue_test_log.csv";
  link.click();
}

function exitApp() {
  if (confirm("Tutup aplikasi ini?")) {
    window.close(); // tidak berfungsi di sebagian browser
  }
}
