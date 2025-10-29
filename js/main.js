const gaits = [
      { name: "Lifts foot high and slams it down due to loss of sensation.Often seen in peripheral neuropathy or sensory ataxia", gif: "./videos/Stamping.mp4" },
      { name: "Lifts knee high to avoid dragging the foot (foot drop).Common in peroneal nerve injury or Charcot-Marie-Tooth disease", gif: "./videos/Steppage.mp4" },
      { name: "Sways side to side with each step due to weak hip muscles.Typical in muscular dystrophy or bilateral hip dislocation", gif: "./videos/Drunken.mp4" }
    ];

    let matches = 0;

    function shuffle(arr) {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    /* ---------- NAME CARD ---------- */
    function createName(gait) {
      const div = document.createElement('div');
      const span = document.createElement('span');
      span.className = 'gait-span';
      span.innerHTML = `<div data-aos="fade-up" data-aos-delay="600">${gait.name}</div>`;
      div.className = 'gait-name';
      div.appendChild(span);
      div.draggable = true;

      div.addEventListener('dragstart', e => {
        e.dataTransfer.setData('text/plain', gait.name);
        div.classList.add('dragging');
      });
      div.addEventListener('dragend', () => div.classList.remove('dragging'));

      return div;
    }

    /* ---------- GIF CARD ---------- */
    function createGif(gait) {
      const div = document.createElement('div');
      div.className = 'gait-gif';
      div.dataset.name = gait.name;

      const vid = `
      <video autoplay muted loop playsinline data-aos="fade-up" data-aos-delay="600" style="
    width: 100%;
    height: 100%;
    object-fit: cover;
">
            <source src="${gait.gif}" type="video/mp4">
            Your browser does not support the video tag.
        </video>
      `
      div.innerHTML=vid;

      div.addEventListener('dragover', e => {
        if (!div.classList.contains('matched')) e.preventDefault();
      });

      div.addEventListener('drop', e => {
        e.preventDefault();
        if (div.classList.contains('matched')) return;

        const droppedName = e.dataTransfer.getData('text/plain');
        if (!droppedName) return;

        if (droppedName === gait.name) {
          // correct
          div.classList.add('matched');
          const nameEl = [...document.querySelectorAll('.gait-name')]
                          .find(n => n.textContent === droppedName);
          if (nameEl) {
            nameEl.classList.add('matched');
            nameEl.draggable = false;
          }
          matches++;
          if (matches === gaits.length) {
            document.getElementById('message').textContent =
              'Congratulations! You matched all gaits! 🎉';
          }
        } else {
          // wrong
          div.classList.add('not-matched');
          const nameEl = [...document.querySelectorAll('.gait-name')]
                          .find(n => n.textContent === droppedName);
          if (nameEl) {
            nameEl.classList.add('not-matched');
            nameEl.draggable = false;
          }
          const msg = document.getElementById('message');
          msg.textContent = 'Wrong match – try again!';
        }
      });

      return div;
    }

    /* ---------- INITIALISE ---------- */
    function initGame() {
      const namesDiv = document.getElementById('names');
      const gifsDiv  = document.getElementById('gifs');
      namesDiv.innerHTML = '';
      gifsDiv.innerHTML  = '';
      document.getElementById('message').textContent = '';
      matches = 0;

      const nameOrder = shuffle(gaits);
      const gifOrder  = shuffle(gaits);

      nameOrder.forEach(g => namesDiv.appendChild(createName(g)));
      gifOrder .forEach(g => gifsDiv .appendChild(createGif (g)));
    }

    document.getElementById('reset').onclick = initGame;

    // start the first round
    initGame();