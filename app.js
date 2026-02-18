let lostItems = JSON.parse(localStorage.getItem("lostItems")) || [];
let foundItems = JSON.parse(localStorage.getItem("foundItems")) || [];

const photoInput = document.getElementById("photo");
const preview = document.getElementById("preview");
const lostList = document.getElementById("lostList");
const foundList = document.getElementById("foundList");

// Photo preview
photoInput.addEventListener("change", () => {
  const file = photoInput.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = () => { preview.src = reader.result; preview.style.display = "block"; };
  reader.readAsDataURL(file);
});

// Add item
function addItem() {
  const type = document.getElementById("type").value;
  const entry = {
    item: item.value.trim(),
    location: location.value.trim(),
    name: name.value.trim(),
    contact: contact.value.trim(),
    photo: preview.src || "",
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
    status: "Unclaimed"
  };

  if(type === "lost") lostItems.push(entry);
  else foundItems.push(entry);

  localStorage.setItem("lostItems", JSON.stringify(lostItems));
  localStorage.setItem("foundItems", JSON.stringify(foundItems));

  clearForm();
  renderLists();
}

// Clear form
function clearForm() {
  item.value = location.value = name.value = contact.value = "";
  preview.style.display = "none"; preview.src = "";
}

// Render lists
function renderLists() {
  lostList.innerHTML = "";
  foundList.innerHTML = "";
  lostItems.forEach((i) => lostList.innerHTML += createCard(i, "lost"));
  foundItems.forEach((i) => foundList.innerHTML += createCard(i, "found"));
}

// Card HTML
function createCard(i, typeStr) {
  return `<li class="${typeStr}">
    <img src="${i.photo||''}">
    <span class="badge ${typeStr==='lost'?'status-lost':'status-found'}">${i.status}</span>
    <b>${i.item}</b><br>${i.location}<br>${i.name} – ${i.contact}<br>${i.date} ${i.time}
  </li>`;
}

// Initial render
renderLists();
