/* =====================================================
   CONFIGURACION RAPIDA - edita aqui sin tocar el resto
   ===================================================== */
const CONFIG = {
  introText: "Hay algo que queria mostrarte.<br>Tocalo y dejalo florecer.",
  finalMessageHTML: `Como un lirio entre los espinos, es<br>
    mi amada entre las doncellas.<br>
    Feliz Cumpleaños.`,
  signature: "&mdash; Valeria Luna",
  musicEnabled: true,
  musicFile: "cancion.mp3",  // pon aqui el nombre exacto de tu archivo, debe estar en esta misma carpeta
  photos: ["foto1.jpeg", "foto2.jpeg", "foto3.jpeg", "foto4.jpeg"], // pon aqui los nombres de tus fotos (hasta 5), colocalas en esta misma carpeta
  // tiempos en milisegundos, contados desde que se toca "Abrir"
  timeConvergeStart: 150,     // cuando empiezan a converger las particulas de luz
  timePlayingClass: 750,      // cuando arranca el armado de la flor (petalo por petalo)
  timeAmbientStart: 3600,     // cuando empiezan a flotar petalos/luces por la pantalla
  timeToFinalScreen: 10000     // cuando aparece la pantalla final
};

document.querySelector('#finalScreen p').innerHTML = CONFIG.finalMessageHTML;
document.querySelector('#finalScreen .signature').innerHTML = CONFIG.signature;
document.querySelector('.intro-text').innerHTML = CONFIG.introText;

/* ---------- collage de fotos flotando en la pantalla final ---------- */
const photoCollage = document.getElementById('photoCollage');
CONFIG.photos.slice(0, 5).forEach((filename, i) => {
  const wrap = document.createElement('div');
  wrap.className = `collagePhoto slot${i}`;
  const img = document.createElement('img');
  img.src = filename;
  img.alt = '';
  img.onerror = () => { wrap.remove(); }; // si falta el archivo, simplemente no se muestra
  wrap.appendChild(img);
  photoCollage.appendChild(wrap);
});

/* ---------- destellos sutiles de fondo ---------- */
const sparkleField = document.getElementById('sparkleField');
sparkleField.style.position = 'absolute';
sparkleField.style.inset = '0';
for(let i=0;i<50;i++){
  const s = document.createElement('div');
  s.className = 'bgSpark';
  const size = Math.random()*2+1;
  s.style.width = size+'px';
  s.style.height = size+'px';
  s.style.left = Math.random()*100+'%';
  s.style.top = Math.random()*80+'%';
  s.style.animationDelay = (Math.random()*4)+'s';
  sparkleField.appendChild(s);
}

const openBtn = document.getElementById('openBtn');
const replayBtn = document.getElementById('replayBtn');
const intro = document.getElementById('intro');
const scene = document.getElementById('scene');
const bloomGroup = document.getElementById('bloomGroup');
const finalScreen = document.getElementById('finalScreen');
const stage = document.getElementById('stage');
const muteBtn = document.getElementById('muteBtn');

// referencias a los intervalos del ambiente flotante, para poder detenerlos al reiniciar
let petalInterval = null;
let dotInterval = null;
let sequenceTimeouts = [];

function playSequence(){
  scene.classList.add('show');

  // 1) particulas de luz que convergen al centro, como si invocaran la flor
  sequenceTimeouts.push(setTimeout(convergeSparkles, CONFIG.timeConvergeStart));

  // 2) la flor se arma petalo por petalo (definido en petalBloom, en style.css)
  sequenceTimeouts.push(setTimeout(()=> scene.classList.add('playing'), CONFIG.timePlayingClass));

  // 3) una vez armada, flota suavemente y empieza el ambiente (petalos + luces)
  sequenceTimeouts.push(setTimeout(()=>{
    bloomGroup.classList.add('floating');
    startFloatingAmbience();
  }, CONFIG.timeAmbientStart));

  // 4) transicion a la pantalla final
  sequenceTimeouts.push(setTimeout(()=>{
    scene.classList.add('leaving');
    sequenceTimeouts.push(setTimeout(()=> finalScreen.classList.add('show'), 900));
  }, CONFIG.timeToFinalScreen));
}

openBtn.addEventListener('click', () => {
  intro.classList.add('hidden');
  if(CONFIG.musicEnabled){ startMusic(); muteBtn.classList.add('show'); }
  playSequence();
});

replayBtn.addEventListener('click', () => {
  // cancelar cualquier paso pendiente de la vuelta anterior
  sequenceTimeouts.forEach(clearTimeout);
  sequenceTimeouts = [];
  if(petalInterval) clearInterval(petalInterval);
  if(dotInterval) clearInterval(dotInterval);

  // quitar petalos/particulas que hayan quedado flotando en pantalla
  document.querySelectorAll('.floatPetal, .lightDot, .convergeDot').forEach(el => el.remove());

  // ocultar la pantalla final y la flor, y devolver la flor a su estado de capullo cerrado
  finalScreen.classList.remove('show');
  scene.classList.remove('leaving', 'playing', 'show');
  bloomGroup.classList.remove('floating');

  // pequena pausa para que se note el reinicio, y volver a reproducir
  setTimeout(playSequence, 500);
});

/* ---------- particulas que convergen hacia el centro antes de florecer ---------- */
function convergeSparkles(){
  const rect = document.getElementById('flowerSvg').getBoundingClientRect();
  const cx = rect.left + rect.width/2;
  const cy = rect.top + rect.height/2;
  const count = 14;
  for(let i=0;i<count;i++){
    const angle = (Math.PI*2*i)/count + Math.random()*0.3;
    const radius = rect.width*0.55 + Math.random()*30;
    const startX = cx + Math.cos(angle)*radius;
    const startY = cy + Math.sin(angle)*radius;
    const el = document.createElement('div');
    el.className = 'convergeDot';
    el.style.left = startX+'px';
    el.style.top = startY+'px';
    stage.appendChild(el);
    const anim = el.animate([
      { transform:'translate(0,0) scale(0.6)', opacity:0 },
      { transform:'translate(0,0) scale(1.1)', opacity:1, offset:0.25 },
      { transform:`translate(${cx-startX}px, ${cy-startY}px) scale(0.2)`, opacity:0 }
    ], { duration: 700 + Math.random()*300, easing:'cubic-bezier(.3,.6,.2,1)', delay: Math.random()*150 });
    anim.onfinish = () => el.remove();
  }
}

/* ---------- petalos y luces flotando por toda la pantalla (ambiente continuo) ---------- */
function startFloatingAmbience(){
  spawnFloatingPetal();
  petalInterval = setInterval(spawnFloatingPetal, 900);
  spawnLightDot();
  dotInterval = setInterval(spawnLightDot, 500);
}

function spawnFloatingPetal(){
  const el = document.createElement('div');
  el.className = 'floatPetal';
  const size = 13 + Math.random()*13;
  const startX = Math.random()*100;
  const duration = 9 + Math.random()*6;
  const drift = (Math.random()-0.5)*160;
  const rotStart = Math.random()*360;
  const rotEnd = rotStart + (Math.random()>0.5?1:-1)*(180+Math.random()*180);
  el.style.left = startX+'vw';
  el.innerHTML = `<svg width="${size}" height="${size*1.2}" viewBox="0 0 24 30">
      <path d="M12,0 C2,8 2,20 12,30 C22,20 22,8 12,0 Z" fill="#f2a0c4" opacity="0.75"/>
    </svg>`;
  stage.appendChild(el);
  const anim = el.animate([
    { transform:`translate(0,-40px) rotate(${rotStart}deg)`, opacity:0 },
    { transform:`translate(${drift*0.3}px, 30vh) rotate(${(rotStart+rotEnd)/2}deg)`, opacity:0.85, offset:0.5 },
    { transform:`translate(${drift}px, 110vh) rotate(${rotEnd}deg)`, opacity:0 }
  ], { duration: duration*1000, easing:'ease-in-out' });
  anim.onfinish = () => el.remove();
}

function spawnLightDot(){
  const el = document.createElement('div');
  el.className = 'lightDot';
  const startX = Math.random()*100;
  const duration = 4 + Math.random()*3;
  el.style.left = startX+'vw';
  el.style.top = (60+Math.random()*30)+'vh';
  stage.appendChild(el);
  const anim = el.animate([
    { transform:'translateY(0) scale(0.6)', opacity:0 },
    { transform:'translateY(-60px) scale(1)', opacity:0.9, offset:0.4 },
    { transform:'translateY(-140px) scale(0.5)', opacity:0 }
  ], { duration: duration*1000, easing:'ease-out' });
  anim.onfinish = () => el.remove();
}

/* ---------- musica: reproduce tu propio archivo, colocado en esta misma carpeta ---------- */
const bgMusic = document.getElementById('bgMusic');
bgMusic.src = CONFIG.musicFile;
let musicPlaying = false;

function startMusic(){
  bgMusic.volume = 0;
  bgMusic.play().then(()=>{
    musicPlaying = true;
    // entrada suave de volumen
    let v = 0;
    const fadeIn = setInterval(()=>{
      v += 0.05;
      bgMusic.volume = Math.min(v, 0.7);
      if(v >= 0.7) clearInterval(fadeIn);
    }, 100);
  }).catch(err=>{
    // si el navegador bloquea el autoplay o no encuentra el archivo, no rompe el resto de la pagina
    console.warn('No se pudo reproducir la musica. Revisa que "'+CONFIG.musicFile+'" este en la carpeta del proyecto.', err);
  });
}

function stopMusic(){
  musicPlaying = false;
  let v = bgMusic.volume;
  const fadeOut = setInterval(()=>{
    v -= 0.08;
    bgMusic.volume = Math.max(v, 0);
    if(v <= 0){ clearInterval(fadeOut); bgMusic.pause(); }
  }, 80);
}

muteBtn.addEventListener('click', () => {
  if(musicPlaying){
    stopMusic();
    muteBtn.textContent = '\u2715';
  } else {
    startMusic();
    muteBtn.textContent = '\u266A';
  }
});
