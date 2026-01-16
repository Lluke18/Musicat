import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { PlaylistService, Playlist } from '../../services/playlist.service';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-playlist',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './playlist.html',
  styleUrl: './playlist.css',
})
export class PlaylistComponent implements OnInit {
  playlists: Playlist[] = [];
  currentUser: User | null = null;
  isCreating = false;
  newPlaylistName = '';
  newPlaylistDescription = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private playlistService: PlaylistService,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    this.currentUser = this.authService.getUserFromLocalStorage();
    if (this.currentUser) {
      await this.loadPlaylists();
    }
  }

  async loadPlaylists() {
    if (!this.currentUser) return;
    
    try {
      this.isLoading = true;
      this.playlists = await this.playlistService.getPlaylistsByUserId(this.currentUser.id);
    } catch (error: any) {
      console.error('Failed to load playlists:', error);
      this.errorMessage = error.message || 'Failed to load playlists';
    } finally {
      this.isLoading = false;
    }
  }

  startCreating() {
    if (!this.currentUser) {
      this.errorMessage = 'Please log in to create playlists';
      return;
    }
    this.isCreating = true;
    this.newPlaylistName = '';
    this.newPlaylistDescription = '';
    this.errorMessage = '';
  }

  cancelCreating() {
    this.isCreating = false;
    this.newPlaylistName = '';
    this.newPlaylistDescription = '';
    this.errorMessage = '';
  }

  async createPlaylist() {
    if (!this.currentUser) {
      this.errorMessage = 'Please log in to create playlists';
      return;
    }

    if (!this.newPlaylistName.trim()) {
      this.errorMessage = 'Playlist name is required';
      return;
    }

    try {
      this.isLoading = true;
      this.errorMessage = '';
      const playlist = await this.playlistService.createPlaylist(
        this.newPlaylistName.trim(),
        this.newPlaylistDescription.trim() || null,
        this.currentUser.id
      );
      this.playlists.unshift(playlist);
      this.cancelCreating();
    } catch (error: any) {
      console.error('Failed to create playlist:', error);
      this.errorMessage = error.message || 'Failed to create playlist';
    } finally {
      this.isLoading = false;
    }
  }

  async deletePlaylist(id: number) {
    if (!confirm('Are you sure you want to delete this playlist?')) {
      return;
    }

    try {
      this.isLoading = true;
      await this.playlistService.deletePlaylist(id);
      this.playlists = this.playlists.filter(p => p.id !== id);
    } catch (error: any) {
      console.error('Failed to delete playlist:', error);
      this.errorMessage = error.message || 'Failed to delete playlist';
    } finally {
      this.isLoading = false;
    }
  }
}
