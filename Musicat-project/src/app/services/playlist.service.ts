import { Injectable } from '@angular/core';
import { Supabase } from '../supabase';

export interface Playlist {
  id: number;
  name: string;
  description?: string | null;
  user_id: string;
  created_at?: string;
}

@Injectable({ providedIn: 'root' })
export class PlaylistService {
  constructor(private supabase: Supabase) {}

  async getPlaylistsByUserId(userId: string): Promise<Playlist[]> {
    const { data, error } = await this.supabase.supabase
      .from('playlists')
      .select('*')
      .eq('user_id', userId)

    if (error) throw error;
    return data as Playlist[];
  }

  async createPlaylist(name: string, description: string | null, userId: string): Promise<Playlist> {
    const { data, error } = await this.supabase.supabase
      .from('playlists')
      .insert([{ 
        name, 
        description: description || null,
        user_id: userId 
      }])
      .select()
      .single();

    if (error) throw error;
    return data as Playlist;
  }

  async updatePlaylist(id: number, name: string, description: string | null): Promise<Playlist> {
    const { data, error } = await this.supabase.supabase
      .from('playlists')
      .update({ 
        name, 
        description: description || null 
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as Playlist;
  }

  async deletePlaylist(id: number): Promise<void> {
    const { error } = await this.supabase.supabase
      .from('playlists')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
