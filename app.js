const audio = document.getElementById('audio');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const songTitle = document.getElementById('song-title');
const artistElement = document.getElementById('artist');
const albumElement = document.getElementById('album');
const playIcon = document.getElementById('play-icon');
const fileInput = document.getElementById('file-input');
const albumArtImg = document.getElementById('album-art-img');

let playlist = [];
let currentSongIndex = 0;

function loadSong(index) {
    const song = playlist[index];
    audio.src = URL.createObjectURL(song);
    extractMetadata(song);
}

function extractMetadata(file) {
    jsmediatags.read(file, {
        onSuccess: function(tag) {
            const { title, artist, album, picture } = tag.tags;

            songTitle.textContent = title || file.name;
            artistElement.textContent = `Artist: ${artist || 'Unknown'}`;
            albumElement.textContent = `Album: ${album || 'Unknown'}`;

            if (picture) {
                const { data, format } = picture;
                let base64String = "";
                for (let i = 0; i < data.length; i++) {
                    base64String += String.fromCharCode(data[i]);
                }
                albumArtImg.src = `data:${format};base64,${window.btoa(base64String)}`;
            } else {
                albumArtImg.src = 'default-album-art.svg';
            }
        },
        onError: function(error) {
            console.log('Error reading tags:', error.type, error.info);
            songTitle.textContent = file.name;
            artistElement.textContent = 'Artist: Unknown';
            albumElement.textContent = 'Album: Unknown';
            albumArtImg.src = 'default-album-art.svg';
        }
    });
}

function playSong() {
    audio.play();
    playIcon.src = 'pause-icon.svg';
    playIcon.alt = 'Pause';
}

function pauseSong() {
    audio.pause();
    playIcon.src = 'play-icon.svg';
    playIcon.alt = 'Play';
}

playBtn.addEventListener('click', () => {
    if (audio.paused) {
        playSong();
    } else {
        pauseSong();
    }
});

prevBtn.addEventListener('click', () => {
    if (playlist.length > 0) {
        currentSongIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        loadSong(currentSongIndex);
        playSong();
    }
});

nextBtn.addEventListener('click', () => {
    if (playlist.length > 0) {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        playSong();
    }
});

audio.addEventListener('ended', () => {
    if (playlist.length > 0) {
        currentSongIndex = (currentSongIndex + 1) % playlist.length;
        loadSong(currentSongIndex);
        playSong();
    }
});

fileInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    playlist = files.filter(file => file.type.startsWith('audio/'));
    
    if (playlist.length > 0) {
        currentSongIndex = 0;
        loadSong(currentSongIndex);
        playSong();
    }
});

// Register service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(registration => console.log('Service Worker registered'))
        .catch(error => console.log('Service Worker registration failed:', error));
}