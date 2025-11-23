const template = document.querySelector('template');

export class JukeboxItem {
  constructor(videoUrl, label) {
    this.videoId = this.extractVideoID(videoUrl);
    if (!this.videoId) {
      throw new Error('Invalid YouTube URL');
    }
    this.label = label || 'Untitled';
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

  createListItem() {
    const listItem = template.content.firstElementChild.cloneNode(true);
    listItem.querySelector('.label').textContent = this.label;

    const player = listItem.querySelector('#player');
    player.id = `${player.id}-${Date.now()}`;

    const playButton = listItem.querySelector('.play-button');
    playButton.addEventListener('click', () => this.playVideo());

    const removeButton = listItem.querySelector('.remove-button');
    removeButton.addEventListener('click', () => this.removeItem(listItem));

    const pauseButton = listItem.querySelector('.pause-button');
    pauseButton.addEventListener('click', () => this.pauseVideo());

    const volumeSlider = listItem.querySelector('#volume');
    volumeSlider.addEventListener('input', (event) => this.setVolume(event.target.value));

    const jukeboxList = document.getElementById('jukebox-list');
    jukeboxList.appendChild(listItem);

    setTimeout(() => {
      this.player = new YT.Player(player.id, {
        height: '100',
        width: '100',
        videoId: this.videoId,
        playerVars: {
          'controls': 0,
        },
        events: {}
      });
    }, 10);
  }

  playVideo() {
    // this.player.loadVideoById(this.videoId);
    this.player.playVideo();
  }

  pauseVideo() {
    this.player.pauseVideo();
  }

  setVolume(volume) {
    this.player.setVolume(volume);
  }

  removeItem(listItem) {
    listItem.remove();
  }
}
