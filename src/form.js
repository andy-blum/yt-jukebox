import { JukeboxItem } from "./JukeboxItem.js";
export function initForm() {
  const form = document.getElementById('add_song');

  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const videoUrlInput = document.getElementById('video-url');
    const videoUrl = videoUrlInput.value.trim();

    const labelInput = document.getElementById('label');
    const label = labelInput.value.trim();

    if (videoUrl) {
      try {
        new JukeboxItem(videoUrl, label);
        videoUrlInput.value = '';
        labelInput.value = '';
      } catch (error) {
        console.error('Error adding video to jukebox:', error);
      }
    }
  });

}
