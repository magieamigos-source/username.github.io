// WORD LISTS — add or edit these to expand variations
const lists = {
  aesthetic: ["luna","celeste","velvet","mist","nocturne","ember","serein","petal","serene","aerial","opal","silk","halo","bloom","meadow"],
  cute: ["bunny","panda","poptart","muffin","bubble","sprout","marsh","twinkle","coco","peach","berry","pudding","toffee","honey","sunny"],
  gamer: ["x","zero","vortex","blade","phantom","striker","ghost","byte","rush","shadow","nova","tank","nexus","riptide","forge"],
  soft: ["soft","cloud","whisper","petal","cuddle","dawn","butter","sigh","plush","murmur","moss","blush","snug","velour","haze"],
  dark: ["raven","void","abyss","noir","grim","thorn","bleak","crypt","obscura","midnight","shade","onset","eclipse","rix","gloom"],
  emoji: ["✨","🌙","☁️","🌸","🔥","🌊","🍑","🍒","⭐️","🖤","💫","🌿","🍓","🦋","🌙"],
  oneword: ["solace","aether","thimble","quell","ember","sepia","zenith","lilt","hallow","rift","zephyr","cinder","briar","glade","sable"]
};

// UI elements
const modeEl = document.getElementById('mode');
const generateBtn = document.getElementById('generateBtn');
const usernameEl = document.getElementById('username');
const copyBtn = document.getElementById('copyBtn');
const saveBtn = document.getElementById('saveBtn');
const favListEl = document.getElementById('favList');
const noFavsEl = document.getElementById('noFavs');
const downloadBtn = document.getElementById('downloadBtn');
const addNumberEl = document.getElementById('addNumber');
const lengthEl = document.getElementById('length');

// localStorage key
const STORAGE_KEY = 'aesthetic_username_favs_v1';

// load favorites
let favorites = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
renderFavorites();

// Generate logic
function randomItem(arr){ return arr[Math.floor(Math.random()*arr.length)]; }

function generateUsername(){
  const mode = modeEl.value;
  let name = '';

  if(mode === 'oneword'){
    name = randomItem(lists.oneword);
  } else if(mode === 'emoji'){
    // emoji mode: word + emoji or multiple emoji
    const part = randomItem(lists.aesthetic.concat(lists.cute));
    const emo = randomItem(lists.emoji);
    name = part + emo;
  } else if(mode === 'gamer'){
    // gamer: base + suffix or prefix + number
    const base = randomItem(lists.gamer);
    const tweak = randomItem(['X','_','Pro','_99','HQ','RX','Z']);
    name = base + tweak;
  } else {
    // aesthetic, cute, soft, dark: combine two words
    const pool = lists[mode];
    const pool2 = lists.aesthetic.concat(lists.cute, lists.soft, lists.dark);
    const p1 = randomItem(pool);
    const p2 = randomItem(pool2.filter(x => x !== p1));
    name = p1 + p2;
  }

  // Add number if enabled
  if(addNumberEl.checked){
    const len = Math.max(1, Math.min(4, parseInt(lengthEl.value||2)));
    const num = Math.floor(Math.random() * Math.pow(10,len));
    name = name + (num === 0 ? '' : num); // avoid trailing zero-only if 0
  }

  // Format: lowercase, remove spaces, keep emoji
  usernameEl.textContent = formatName(name);
}

// format helper
function formatName(s){
  // preserve emoji and letters, remove spaces
  return String(s).replace(/\s+/g,'').toLowerCase();
}

// copy
copyBtn.addEventListener('click', async () => {
  const text = usernameEl.textContent || '';
  if(!text || text.includes('press Generate')) return;
  try{
    await navigator.clipboard.writeText(text);
    copyBtn.textContent = 'Copied!';
    setTimeout(()=> copyBtn.textContent = 'Copy',1200);
  }catch(e){
    copyBtn.textContent = 'Copy (allowed?)';
    setTimeout(()=> copyBtn.textContent = 'Copy',1200);
  }
});

// save favorite
saveBtn.addEventListener('click', () => {
  const name = usernameEl.textContent || '';
  if(!name || name.includes('press Generate')) return;
  if(!favorites.includes(name)){
    favorites.unshift(name);
    if(favorites.length>100) favorites = favorites.slice(0,100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    renderFavorites();
    saveBtn.textContent = 'Saved!';
    setTimeout(()=> saveBtn.textContent = 'Save',900);
  } else {
    saveBtn.textContent = 'Already saved';
    setTimeout(()=> saveBtn.textContent = 'Save',900);
  }
});

// render favorites
function renderFavorites(){
  favListEl.innerHTML = '';
  if(!favorites.length){
    noFavsEl.style.display = 'block';
    return;
  }
  noFavsEl.style.display = 'none';
  favorites.forEach((f, i) => {
    const li = document.createElement('li');
    li.textContent = f;
    // remove button
    const rm = document.createElement('button');
    rm.textContent = '✕';
    rm.title = 'Remove';
    rm.style.marginLeft = '8px';
    rm.style.border='none';
    rm.style.background='transparent';
    rm.style.cursor='pointer';
    rm.addEventListener('click', () => {
      favorites.splice(i,1);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
      renderFavorites();
    });
    li.appendChild(rm);
    favListEl.appendChild(li);
  });
}

// download favorites (txt)
downloadBtn.addEventListener('click', () => {
  if(!favorites.length) return alert('No favorites to download.');
  const blob = new Blob([favorites.join('\n')], {type:'text/plain;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'favorites_usernames.txt';
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

// generate on click and allow Enter key for quick use
generateBtn.addEventListener('click', generateUsername);
document.addEventListener('keydown', (e)=> {
  if(e.key === 'Enter') generateUsername();
});

// initial sample
generateUsername();
