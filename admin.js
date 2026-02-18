const ADMIN_PIN = "1234";
let lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
let foundItems = JSON.parse(localStorage.getItem("foundItems")) || [];
let editIndex = -1;

const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");

// Login
function login() {
  if (pin.value === ADMIN_PIN) {
    login.style.display = "none";
    admin.style.display = "block";
    renderLists();
  } else alert("Invalid PIN");
}
const login = document.getElementById("login");
const admin = document.getElementById("admin");

// Photo preview
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => { preview.src = reader.result; preview.style.display = "block"; };
  reader.readAsDataURL(file);
});

// Save item (Add/Edit)
function saveItem() {
  const typeVal = type.value;
  const list = typeVal === "lost" ? lostItems : foundItems;

  const entry = {
    item: item.value.trim(),
    location: location.value.trim(),
    name: name.value.trim(),
    contact: contact.value.trim(),
    photo: preview.src || "",
    date: date.value || new Date().toLocaleDateString(),
    time: time.value || new Date().toLocaleTimeString(),
    status: "Unclaimed"
  };

  if(editIndex > -1) { list[editIndex] = entry; editIndex = -1; }
  else { list.push(entry); }

  localStorage.setItem("lostItems", JSON.stringify(lostItems));
  localStorage.setItem("foundItems", JSON.stringify(foundItems));

  clearForm();
  renderLists();
}

// Clear form
function clearForm() {
  item.value = location.value = name.value = contact.value = date.value = time.value = "";
  preview.style.display = "none"; preview.src = "";
  editIndex = -1;
}

// Render lists
function renderLists() {
  const q = search.value.toLowerCase();
  lostList.innerHTML = ""; foundList.innerHTML = "";

  lostItems.filter(i=>i.item.toLowerCase().includes(q))
           .forEach((i, idx)=> lostList.innerHTML += createCard(i,"lost",idx));
  foundItems.filter(i=>i.item.toLowerCase().includes(q))
           .forEach((i, idx)=> foundList.innerHTML += createCard(i,"found",idx));

  lostCount.textContent = lostItems.length;
  foundCount.textContent = foundItems.length;
  claimedCount.textContent = [...lostItems,...foundItems].filter(i=>i.status==="Claimed").length;
}

// Card HTML
function createCard(i, typeStr, idx) {
  return `<li class="${typeStr}">
    <img src="${i.photo||''}">
    <span class="badge ${i.status==="Claimed"?"claimed":"unclaimed"}">${i.status}</span>
    <b>${i.item}</b><br>${i.location}<br>${i.name} – ${i.contact}<br>${i.date} ${i.time}
    <div class="actions">
      <button class="edit" onclick="editItem('${typeStr}',${idx})">Edit</button>
      <button class="claim" onclick="toggleStatus('${typeStr}',${idx})">Claim</button>
      <button class="delete" onclick="deleteItem('${typeStr}',${idx})">Delete</button>
    </div>
  </li>`;
}

// Actions
function editItem(typeStr, idx) {
  const i = (typeStr==="lost"?lostItems:foundItems)[idx];
  type.value = typeStr;
  item.value = i.item; location.value = i.location;
  name.value = i.name; contact.value = i.contact;
  preview.src = i.photo || ""; preview.style.display = i.photo?"block":"none";
  date.value = i.date; time.value = i.time;
  editIndex = idx;
}

function toggleStatus(typeStr, idx) {
  const list = typeStr==="lost"?lostItems:foundItems;
  list[idx].status = list[idx].status==="Claimed"?"Unclaimed":"Claimed";
  saveAll();
}

function deleteItem(typeStr, idx) {
  (typeStr==="lost"?lostItems:foundItems).splice(idx,1);
  saveAll();
}

// Auto-match Lost & Found
function autoMatch() {
  let matches = [];
  lostItems.forEach(l => {
    foundItems.forEach(f => {
      if(l.item.toLowerCase().includes(f.item.toLowerCase()) || f.item.toLowerCase().includes(l.item.toLowerCase()))
        matches.push(`${l.item} ↔ ${f.item}`);
    });
  });
  alert(matches.length ? matches.join("\n") : "No matches found");
}

// Export CSV
function exportCSV() {
  let rows=[["Type","Item","Location","Name","Contact","Date","Time","Status","Photo"]];
  lostItems.forEach(i=>rows.push(["Lost",i.item,i.location,i.name,i.contact,i.date,i.time,i.status,i.photo]));
  foundItems.forEach(i=>rows.push(["Found",i.item,i.location,i.name,i.contact,i.date,i.time,i.status,i.photo]));
  const csv = rows.map(r=>r.join(",")).join("\n");
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([csv],{type:"text/csv"}));
  a.download = "lost_found_report.csv";
  a.click();
}

function saveAll(){ 
  localStorage.setItem("lostItems", JSON.stringify(lostItems));
  localStorage.setItem("foundItems", JSON.stringify(foundItems));
  renderLists(); clearForm();
}

// Initial render
renderLists();
