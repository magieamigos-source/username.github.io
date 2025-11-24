const words1 = [
    "soft", "moon", "pink", "angel", "dreamy", "velvet", "cloudy", "vibe", 
    "sunny", "peachy", "shadow", "rosy", "quiet", "vintage", "midnight"
];

const words2 = [
    "blossom", "vibes", "star", "kitty", "heart", "rose", "skies",
    "aura", "whisper", "dreams", "sparkle", "lover", "mist", "smile"
];

function generateUsername() {
    const part1 = words1[Math.floor(Math.random() * words1.length)];
    const part2 = words2[Math.floor(Math.random() * words2.length)];
    const number = Math.floor(Math.random() * 999);

    const username = part1 + part2 + number;

    document.getElementById("output").innerText = username;
}
