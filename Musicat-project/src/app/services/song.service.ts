import { Injectable } from '@angular/core';
import { Supabase } from '../supabase';

export interface Song {
  id: string;
  title: string;
  artist: string;
  file_path: string;
  rating?: number;
}

@Injectable({ providedIn: 'root' })
export class SongService {
  constructor(private supabase: Supabase) {}

  async getSongs(): Promise<Song[]> {
    const { data, error } = await this.supabase.supabase
      .from('songs')
      .select('*')
      .order('rating', { ascending: false, nullsFirst: true });

       console.log('Songs from DB:', data, error);
    if (error) throw error;
    return data;
  }

  async getStreamingUrl(filePath: string): Promise<string> {
    const { data,error } = await this.supabase.supabase.storage// {data, error} - in case of signedUrl!!!
      .from('Organizarea')
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry can be set if using createSignedUrl 60*60

    if (error) throw error;
    return data.signedUrl;
  }
}
