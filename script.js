// Check if dark mode is enabled from localStorage
const storedTheme = localStorage.getItem('theme');

if (storedTheme) {
    document.body.classList.add(storedTheme);
    const currentTheme = storedTheme === 'dark-theme' ? '🌞' : '🌙';
    document.getElementById('theme-toggle').textContent = currentTheme;
} else {
    document.body.classList.add('dark-theme');
    localStorage.setItem('theme', 'dark-theme');
    document.getElementById('theme-toggle').textContent = '🌞';
}

document.getElementById('theme-toggle').addEventListener('click', () => {
    document.body.classList.toggle('dark-theme');
    const currentTheme = document.body.classList.contains('dark-theme') ? '🌞' : '🌙';
    document.getElementById('theme-toggle').textContent = currentTheme;
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark-theme' : 'light-theme');
});

// Typewriter effect for name
const nameElement = document.getElementById('name');
const nameText = "Vijayavarman Arunasalam Harikrishnan!";
let index = 0;

function typeName() {
    if (index < nameText.length) {
        nameElement.innerHTML += nameText.charAt(index);
        index++;
        setTimeout(typeName, 50);
    }
}

window.onload = typeName;

// Bat animation
const numBats = 30;
const batContainer = document.getElementById('bat-fly-container');

function getRandomValue(min, max) {
  return Math.random() * (max - min) + min;
}

function createBat() {
  const bat = document.createElement('img');
  bat.src = 'bat-icon.svg';
  bat.classList.add('bat');

  bat.style.left = `${getRandomValue(0, 100)}vw`;
  bat.style.top = `${getRandomValue(0, 100)}vh`;

  const x1 = getRandomValue(-300, 300); const y1 = getRandomValue(-300, 300);
  const x2 = getRandomValue(-500, 500); const y2 = getRandomValue(-500, 500);
  const x3 = getRandomValue(-700, 700); const y3 = getRandomValue(-700, 700);
  const x4 = getRandomValue(-1000, 1000); const y4 = getRandomValue(-1000, 1000);

  bat.style.setProperty('--x1', `${x1}px`);
  bat.style.setProperty('--y1', `${y1}px`);
  bat.style.setProperty('--x2', `${x2}px`);
  bat.style.setProperty('--y2', `${y2}px`);
  bat.style.setProperty('--x3', `${x3}px`);
  bat.style.setProperty('--y3', `${y3}px`);
  bat.style.setProperty('--x4', `${x4}px`);
  bat.style.setProperty('--y4', `${y4}px`);

  batContainer.appendChild(bat);
  bat.addEventListener('animationiteration', () => { bat.remove(); });
}

for (let i = 0; i < numBats; i++) { createBat(); }
