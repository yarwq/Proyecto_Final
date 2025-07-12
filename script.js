const dinoTypes = ['T-Rex', 'Triceratops', 'Stegosaurus', 'Pterodactyl', 'Brachiosaurus'];

let score = 0;

function createDino(name) {
  const div = document.createElement('div');
  div.className = 'dino';
  div.textContent = name;
  div.setAttribute('draggable', true);

  div.addEventListener('dragstart', () => {
    div.classList.add('dragging');
    div.dataset.dragging = name;
  });

  div.addEventListener('dragend', () => {
    div.classList.remove('dragging');
    delete div.dataset.dragging;
  });

  return div;
}

function drawHand() {
  const handContainer = document.getElementById('hand-container');
  handContainer.innerHTML = '';

  const dinos = [];
  for (let i = 0; i < 3; i++) {
    const dinoName = dinoTypes[Math.floor(Math.random() * dinoTypes.length)];
    const dino = createDino(dinoName);
    dinos.push(dino);
    handContainer.appendChild(dino);
  }
}

function setupZones() {
  const zones = document.querySelectorAll('.zone');

  zones.forEach(zone => {
    zone.addEventListener('dragover', e => {
      e.preventDefault();
    });

    zone.addEventListener('drop', e => {
      const draggingDino = document.querySelector('.dino.dragging');
      if (draggingDino) {
        zone.appendChild(draggingDino);
        updateScore();
      }
    });
  });
}

function updateScore() {
  const zooZones = document.querySelectorAll('.zone');
  let total = 0;
  zooZones.forEach(zone => {
    total += zone.querySelectorAll('.dino').length;
  });
  score = total;
  document.getElementById('score').textContent = `Score: ${score}`;
}

drawHand();
setupZones();
