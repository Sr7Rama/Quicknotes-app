// Select DOM Elements
const noteForm = document.getElementById("note-form");
const noteInput = document.getElementById("note-input");
const noteCategory = document.getElementById("note-category");
const errorMessage = document.getElementById("error-message");
const searchInput = document.getElementById("search-input");
const noteCount = document.getElementById("note-count");
const notesList = document.getElementById("notes-list");
const clearAllBtn = document.getElementById("clear-all-btn");

// Initialize Array State from localStorage
let notes = JSON.parse(localStorage.getItem("quicknotes_data")) || [];

// Save Array State to localStorage
function saveToStorage() {
  localStorage.setItem("quicknotes_data", JSON.stringify(notes));
}

// Update Note Count Text
function updateNoteCount(displayedCount) {
  if (notes.length === 0) {
    noteCount.textContent = "You have no notes yet.";
  } else if (displayedCount === 1) {
    noteCount.textContent = "You have 1 note.";
  } else {
    noteCount.textContent = `You have ${displayedCount} notes.`;
  }
}

// Render Notes to DOM safely using createElement/textContent
function render() {
  notesList.textContent = "";
  const query = searchInput.value.trim().toLowerCase();

  // Filter notes by search query
  const filteredNotes = notes.filter((note) =>
    note.text.toLowerCase().includes(query)
  );

  updateNoteCount(filteredNotes.length);

  if (filteredNotes.length === 0 && notes.length > 0) {
    const noResultsLi = document.createElement("li");
    noResultsLi.textContent = "No notes match your search.";
    noResultsLi.style.fontStyle = "italic";
    noResultsLi.style.color = "#6c757d";
    notesList.appendChild(noResultsLi);
    return;
  }

  filteredNotes.forEach((note) => {
    // Card container element
    const li = document.createElement("li");
    li.className = `note-card category-${note.category.toLowerCase()}`;

    // Details wrapper
    const detailsDiv = document.createElement("div");
    detailsDiv.className = "note-details";

    // Text paragraph
    const textP = document.createElement("p");
    textP.className = "note-text";
    textP.textContent = note.text;

    // Metadata container (Category & Date)
    const metaDiv = document.createElement("div");
    metaDiv.className = "note-meta";

    const categorySpan = document.createElement("span");
    categorySpan.className = "category-tag";
    categorySpan.textContent = note.category;

    const dateSpan = document.createElement("span");
    dateSpan.textContent = note.createdAt;

    metaDiv.appendChild(categorySpan);
    metaDiv.appendChild(dateSpan);

    detailsDiv.appendChild(textP);
    detailsDiv.appendChild(metaDiv);

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteNote(note.id));

    li.appendChild(detailsDiv);
    li.appendChild(deleteBtn);

    notesList.appendChild(li);
  });
}

// Add Note Handler
noteForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = noteInput.value.trim();
  const category = noteCategory.value;

  // Validation checks
  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  // Clear validation error on success
  errorMessage.textContent = "";

  // Format readable timestamp
  const now = new Date();
  const createdAt = now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newNote = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: createdAt
  };

  notes.push(newNote);
  saveToStorage();
  render();

  noteInput.value = "";
});

// Delete Single Note
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveToStorage();
  render();
}

// Search Input Listener
searchInput.addEventListener("input", render);

// Bonus: Clear All Notes
clearAllBtn.addEventListener("click", () => {
  if (notes.length === 0) return;
  const confirmDelete = confirm("Delete all notes?");
  if (confirmDelete) {
    notes = [];
    saveToStorage();
    render();
  }
});

// Initial Render on Load
render();