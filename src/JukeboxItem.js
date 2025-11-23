const template = document.querySelector('template');

export class JukeboxItem {
  constructor(videoUrl, label) {
    this.videoId = this.extractVideoID(videoUrl);
    this.id = `item-${Math.random().toString(36).slice(2)}`;

    if (!this.videoId) {
      throw new Error('Invalid YouTube URL');
    }
    this.label = label || '';
    this.createListItem();

    if (!window.jukebox) {
      window.jukebox = [];
    }
    window.jukebox.push(this);
  }

  extractVideoID(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }

  injectVideo() {

    this.player = new YT.Player(`${this.id}-player`, {
      height: '0',
      width: '0',
      videoId: this.videoId,
      playerVars: {
        'controls': 0,
      },
      events: {
        'onReady': this.videoReady.bind(this),
      }
    });

  }

  createListItem() {
    this.listItem = template.content.firstElementChild.cloneNode(true);
    this.listItem.id = this.id;

    this.listItem.querySelector('.label').textContent = this.label;

    const player = this.listItem.querySelector('#player');
    player.id = `${this.id}-player`;

    const playPauseButton = this.listItem.querySelector('.play-pause');
    playPauseButton.addEventListener('click', () => this.togglePlayPause());

    const removeButton = this.listItem.querySelector('.remove-button');
    removeButton.addEventListener('click', () => this.removeItem(this.listItem));

    const volumeSlider = this.listItem.querySelector('.volume');
    volumeSlider.addEventListener('input', (event) => this.setVolume(event.target.value));

    const thumbnailImg = this.listItem.querySelector('.thumbnail');
    thumbnailImg.src = `https://img.youtube.com/vi/${this.videoId}/default.jpg`;

    const jukeboxList = document.getElementById('jukebox-list');
    jukeboxList.appendChild(this.listItem);

    setTimeout(() => {
      this.injectVideo();
    }, 100);
  }

  videoReady() {
    if (!this.label) {
      this.listItem.querySelector('.label').textContent = this.player.videoTitle;
    }
  }

  togglePlayPause() {
    const playerState = this.player.getPlayerState();
    if (playerState === YT.PlayerState.PLAYING) {
      this.player.pauseVideo();
    } else {
      this.player.playVideo();
    }
  }

  setVolume(volume) {
    this.player.setVolume(volume);
  }

  removeItem(listItem) {
    listItem.remove();
  }
}
