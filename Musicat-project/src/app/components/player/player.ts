import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { SongService, Song } from '../../services/song.service';
import { CommonModule } from '@angular/common';

  type SortMode = 'rating' | 'title' | 'artist';

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
  //for sorting:

  sortMode: SortMode = 'rating';
  

  @ViewChild('audioPlayer') audioRef!: ElementRef<HTMLAudioElement>;

  constructor(private songService: SongService, private cdr: ChangeDetectorRef) {}

  async ngOnInit() {
    this.songs = await this.songService.getSongs();
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

  get SortedSongs(): Song[] {
    const songsCopy = [...this.songs];

    switch (this.sortMode) {
      case 'title':
        return songsCopy.sort((a, b) =>
          a.title.localeCompare(b.title)
        );

      case 'artist':
        return songsCopy.sort((a, b) =>
          a.artist.localeCompare(b.artist)
        );

      case 'rating':
      default:
        return songsCopy.sort(
          (a, b) => (b.rating ?? 0) - (a.rating ?? 0)
        );
    }
  }
}
