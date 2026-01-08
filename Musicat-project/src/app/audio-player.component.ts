import { Component, ElementRef, viewChild, signal } from '@angular/core';

@Component({
  selector: 'audio-player',
  standalone: true,
  template: `
    <div class="audio-card">
      <audio 
  #audioElement 
  src="/songtest.mp3"
  controls
  crossorigin="anonymous"
  (timeupdate)="onTimeUpdate()"
  (loadedmetadata)="onMetadataLoaded()"
  (ended)="onEnded()"> </audio>
  `
})
export class AudioPlayerComponent {
  // 1. Get the Native Audio Object
  // We use viewChild.required to ensure it exists before we try to play
  audioRef = viewChild.required<ElementRef<HTMLAudioElement>>('audioElement');

  // 2. Reactive State (Signals)
  isPlaying = signal(false);
  currentTime = signal(0);
  duration = signal(0);

  // 3. Playback Logic
  togglePlay() {
    const audio = this.audioRef().nativeElement;

    if (audio.paused) {
      audio.play();
      this.isPlaying.set(true);
    } else {
      audio.pause();
      this.isPlaying.set(false);
    }
  }

  // 4. Events: Update Progress
  onTimeUpdate() {
    const audio = this.audioRef().nativeElement;
    this.currentTime.set(audio.currentTime);
  }

  // Set duration once metadata (file length) is loaded
  onMetadataLoaded() {
    const audio = this.audioRef().nativeElement;
    this.duration.set(audio.duration);
  }

  // Reset UI when track finishes
  onEnded() {
    this.isPlaying.set(false);
    this.currentTime.set(0);
  }

  // 5. Seek functionality (User drags slider)
  seek(event: Event) {
    const input = event.target as HTMLInputElement;
    const audio = this.audioRef().nativeElement;
    
    // Update audio position
    audio.currentTime = Number(input.value);
  }

  // Utility: Format seconds into MM:SS
  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }
}