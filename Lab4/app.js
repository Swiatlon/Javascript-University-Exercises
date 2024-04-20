document.addEventListener("DOMContentLoaded", function () {
  displayNotes(); // Wyświetla notatki przy załadowaniu strony
});

function addNote() {
  const title = document.getElementById("note-title").value;
  const content = document.getElementById("note-content").value;
  const tags = document
    .getElementById("note-tags")
    .value.split(",")
    .map((tag) => tag.trim())
    .filter((tag) => tag); // Tworzenie tablicy tagów z ciągu wprowadzonego przez użytkownika
  const color = document.getElementById("note-color").value;
  const pin = document.getElementById("note-pin").checked;
  const created = new Date().toISOString();

  const note = {
    title,
    content,
    tags,
    color,
    pin,
    created,
  };

  saveNote(note);
  displayNotes();
  clearForm();
}

function saveNote(note) {
  let notes = JSON.parse(localStorage.getItem("notes")) || []; // Odczytanie notatek z localStorage lub stworzenie nowej tablicy, jeśli nie istnieją
  notes.push(note);
  localStorage.setItem("notes", JSON.stringify(notes));
}

function displayNotes(notes = JSON.parse(localStorage.getItem("notes")) || []) {
  const notesContainer = document.getElementById("notes-container");
  notesContainer.innerHTML = "";

  notes.sort((a, b) => b.pin - a.pin);

  notes.forEach((note) => {
    const noteElement = document.createElement("div");
    noteElement.classList.add("note");
    noteElement.style.backgroundColor = note.color;

    const title = document.createElement("h2");
    title.textContent = note.title;

    const content = document.createElement("p");
    content.textContent = note.content;

    // Zapewnienie, że tagi istnieją i są tablicą przed użyciem .join
    const tagList = document.createElement("p");
    tagList.textContent = `Tagi: ${
      note.tags ? note.tags.join(", ") : "Brak tagów"
    }`;

    const date = document.createElement("small");
    date.textContent = `Utworzono: ${new Date(note.created).toLocaleString()}`;

    noteElement.append(title, content, tagList, date);
    notesContainer.appendChild(noteElement);
  });
}

function clearForm() {
  document.getElementById("note-title").value = "";
  document.getElementById("note-content").value = "";
  document.getElementById("note-tags").value = "";
  document.getElementById("note-color").value = "#ffcc00";
  document.getElementById("note-pin").checked = false;
}

function searchNotes() {
  const searchText = document
    .getElementById("search-input")
    .value.toLowerCase();
  const allNotes = JSON.parse(localStorage.getItem("notes")) || [];
  const filteredNotes = allNotes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchText) ||
      note.content.toLowerCase().includes(searchText) ||
      note.tags.some((tag) => tag.toLowerCase().includes(searchText))
  );
  displayNotes(filteredNotes); // Wyświetlanie filtrowanych notatek
}
