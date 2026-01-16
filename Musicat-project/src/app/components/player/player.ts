import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SongService, Song } from '../../services/song.service';
import { CommonModule } from '@angular/common';

  type SortMode = 'rating' | 'title' | 'artist' | 'album';

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './player.html',
  styleUrls: ['./player.css']
})
export class PlayerComponent implements OnInit {
  songs: Song[] = [];
  currentSong?: Song;
  searchTerm: string = '';
  //for sorting:

  sortMode: SortMode = 'rating';
  

  @ViewChild('audioPlayer') audioRef!: ElementRef<HTMLAudioElement>;

  constructor(private songService: SongService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    this.songs = await this.songService.getSongs();
    // Load cover URLs for all songs
    for (const song of this.songs) {
      if (song.cover_path) {
        try {
          song.cover_url = await this.songService.getCoverUrl(song.cover_path);
        } catch (error) {
          console.error(`Failed to load cover for song ${song.id}:`, error);
          song.cover_url = "https://ih1.redbubble.net/image.5250935734.0802/raf,360x360,075,t,fafafa:ca443f4786.jpg";
        }
      } else {
        song.cover_url = "https://ih1.redbubble.net/image.5250935734.0802/raf,360x360,075,t,fafafa:ca443f4786.jpg";
      }
    }
    this.cdr.detectChanges();
  }

  async play(song: Song) {
    this.currentSong = song;

    const url = await this.songService.getStreamingUrl(song.file_path);
    const audio = this.audioRef.nativeElement;

    audio.src = url;
    audio.load();
    audio.play();
  }

  pause() {
    this.audioRef.nativeElement.pause();
  }

  onSearch(event: Event) { /* this here is something from google. should be verified */
    this.searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
  }

  get SortedSongs(): Song[] { /* i would further verify this logic. most likely it isn't updating frequently enough */
    let filteredSongs = this.songs.filter(song => 
      song.title.toLowerCase().includes(this.searchTerm) || 
      song.artist.toLowerCase().includes(this.searchTerm) ||
      (song.album && song.album.toLowerCase().includes(this.searchTerm))
    );
    
    switch (this.sortMode) {
      case 'title':
        return filteredSongs.sort((a, b) => a.title.localeCompare(b.title));
      case 'artist':
        return filteredSongs.sort((a, b) => a.artist.localeCompare(b.artist));
      case 'album':
        return filteredSongs.sort((a, b) => (a.album ?? '').localeCompare(b.album ?? ''));
      case 'rating':
      default:
        return filteredSongs.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    }
    
  }
}
