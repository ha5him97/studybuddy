// ---------- Dark/Light Mode ----------
const themeToggleButtons = document.querySelectorAll('#theme-toggle');
themeToggleButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
  });
});
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

// ---------- Motivation Page ----------
const quoteEl = document.getElementById('quote');
const customQuoteInput = document.getElementById('custom-quote');
const saveQuoteBtn = document.getElementById('save-quote');
const newQuoteBtn = document.getElementById('new-quote');

if (quoteEl) {
  async function fetchQuote() {
    try {
      const res = await fetch('https://api.quotable.io/random');
      const data = await res.json();
      quoteEl.textContent = data.content;
    } catch {
      quoteEl.textContent = "Stay motivated and keep learning!";
    }
  }

  newQuoteBtn.addEventListener('click', fetchQuote);

  saveQuoteBtn.addEventListener('click', () => {
    const customQuote = customQuoteInput.value.trim();
    if (customQuote) {
      localStorage.setItem('customQuote', customQuote);
      quoteEl.textContent = customQuote;
      customQuoteInput.value = '';
    }
  });

  if (localStorage.getItem('customQuote')) {
    quoteEl.textContent = localStorage.getItem('customQuote');
  } else {
    fetchQuote();
  }
}

// ---------- Timetable Page ----------
const tableBody = document.querySelector('#table tbody');
const addRowBtn = document.getElementById('add-row');

function saveTimetable() {
  if (!tableBody) return;
  const rows = [];
  tableBody.querySelectorAll('tr').forEach(tr => {
    const subject = tr.querySelector('.subject-input').value;
    const time = tr.querySelector('.time-input').value;
    rows.push({ subject, time });
  });
  localStorage.setItem('timetable', JSON.stringify(rows));
}

function loadTimetable() {
  if (!tableBody) return;
  const rows = JSON.parse(localStorage.getItem('timetable')) || [];
  rows.forEach(row => addRow(row.subject, row.time));
}

function addRow(subject='', time='') {
  if (!tableBody) return;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td><input type="text" class="subject-input" value="${subject}"></td>
    <td><input type="text" class="time-input" value="${time}"></td>
    <td><button class="delete-row">Delete</button></td>
  `;
  tr.querySelector('.delete-row').addEventListener('click', () => {
    tr.remove();
    saveTimetable();
  });
  tr.querySelectorAll('input').forEach(input => {
    input.addEventListener('input', saveTimetable);
  });
  tableBody.appendChild(tr);
  saveTimetable();
}

if (addRowBtn) {
  addRowBtn.addEventListener('click', () => addRow());
  loadTimetable();
}

// ---------- Chapter Progress Page ----------
const subjectsContainer = document.getElementById('subjects-container');

if (subjectsContainer) {
  // Sample subjects and chapters with start-end pages
  const subjectsData = {
    "English": [
        ["A Very Old Man with Enormous Wings", 8, 18],
        ["In the Attic", 19, 28],
        ["Friends, Romans, Countrymen", 29, 46],
        ["Breaking Barriers, I Will Fly", 47, 52],
        ["A Phoenix Rises", 53, 60],
        ["The Seedling", 61, 74],
        ["Another Day in Paradise", 75, 77],
        ["War", 78, 85],
        ["A Piece of String", 86, 105],
        ["Shakuntalam", 121, 131],
        ["Trills and Thrills: Birdwatching in India", 132, 137],
        ["The Wild Swans at Coole", 138, 152],
        ["Beloved", 153, 160],
        ["Preference Nationale", 161, 167],
        ["Mirror", 168, 185]
    ],
    "History": [
        ["Humanism", 7, 26],
        ["Liberty Equality Fraternity", 27, 46],
        ["Social Analysis", 47, 64],
        ["Wealth and the World", 65, 86],
        ["Public Opinion in Democracy", 87, 102],
        ["Mass Movement for Freedom", 111, 130],
        ["The Glimpses of Free India", 131, 154],
        ["Democracy: An Indian Experience", 155, 180],
        ["Know the Indian Social System", 181, 202]
    ],
    "Geography": [
        ["Weather and Climate", 7, 34],
        ["Climatic Region and Climate Change", 35, 56],
        ["From the Rainy Forest to the Land of Permaforest", 57, 82],
        ["Consumer: Rights and Protection", 83, 101],
        ["Money and Economy", 102, 123],
        ["The Changing Earth", 135, 157],
        ["Indian Economy: Growth and Transformation", 158, 182],
        ["Towards Sustainability", 183, 206]
    ],
    "Biology": [
        ["Genetics of Life", 7, 34],
        ["Paths of Evolution", 35, 70],
        ["Behind Sensations", 71, 103],
        ["Chemoreception in Organisms", 111, 134],
        ["Immunity and Healthcare", 135, 166],
        ["Biology and Technology", 167, 183]
    ],
    "Maths": [
        ["Arithmetic Sequence", 7, 30],
        ["Circles and Angles", 31, 58],
        ["Arithmetic Sequence and Algebra", 59, 72],
        ["Mathematics of Chances", 73, 84],
        ["Second Degree Equations", 85, 96],
        ["Trigonometry", 97, 126],
        ["Coordinates", 127, 150],
        ["Tangents", 159, 188],
        ["Polynomials and Equations", 189, 206],
        ["Circles and Lines", 207, 224],
        ["Geometry and Angles", 225, 254],
        ["Solids", 255, 276],
        ["Statistics", 277, 288]
    ],
    "Chemistry": [
        ["Nomenclature of Organic Compounds and Isomerism", 7, 23],
        ["Chemical Reactions of Organic Compounds", 33, 48],
        ["Periodic Table and Electron Configuration", 49, 72],
        ["Gas Laws and Mole Concept", 73, 92],
        ["Electrochemistry", 103, 120],
        ["Metals", 121, 140],
        ["Some Compounds of Industrial Importance", 141, 165]
    ],
    "Physics": [
        ["Sound Waves", 7, 26],
        ["Lenses", 27, 48],
        ["The World of Colours and Vision", 49, 69],
        ["Magnetic Effect of Electric Current", 69, 85],
        ["Heating Effect of Electricity", 86, 100], // You can adjust pages
        ["Magnetic Induction in Real Life", 101, 115] // You can adjust pages
    ]
    };


  function saveProgress() {
    const progressData = {};
    subjectsContainer.querySelectorAll('.subject').forEach(sub => {
      const subjectName = sub.dataset.name;
      progressData[subjectName] = [];
      sub.querySelectorAll('.chapter').forEach(ch => {
        const currentPage = parseInt(ch.querySelector('.current-page').value) || 0;
        progressData[subjectName].push(currentPage);
      });
    });
    localStorage.setItem('chapterProgress', JSON.stringify(progressData));
  }

  function loadProgress() {
    const saved = JSON.parse(localStorage.getItem('chapterProgress')) || {};
    for (const subjectName in subjectsData) {
      addSubject(subjectName, subjectsData[subjectName], saved[subjectName] || []);
    }
  }

  function addSubject(subjectName, chapters, savedProgress=[]) {
    const subDiv = document.createElement('div');
    subDiv.classList.add('subject');
    subDiv.dataset.name = subjectName;
    subDiv.innerHTML = `<h3>${subjectName}</h3>`;
    chapters.forEach((ch, i) => {
      const [title, start, end] = ch;
      const current = savedProgress[i] || start;
      const chDiv = document.createElement('div');
      chDiv.classList.add('chapter');
      chDiv.innerHTML = `
        <p>${title} (${start}-${end})</p>
        <input type="number" class="current-page" value="${current}" min="${start}" max="${end}">
        <div class="progress-container"><div class="progress-bar"></div></div>
      `;
      const input = chDiv.querySelector('.current-page');
      input.addEventListener('input', () => {
        const val = Math.min(Math.max(parseInt(input.value) || start, start), end);
        input.value = val;
        const percent = Math.round(((val-start)/(end-start))*100);
        chDiv.querySelector('.progress-bar').style.width = percent + '%';
        saveProgress();
      });
      // Initialize progress bar
      const percent = Math.round(((current-start)/(end-start))*100);
      chDiv.querySelector('.progress-bar').style.width = percent + '%';
      subDiv.appendChild(chDiv);
    });
    subjectsContainer.appendChild(subDiv);
  }

  loadProgress();
}
