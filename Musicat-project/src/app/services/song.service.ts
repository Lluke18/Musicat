import { Injectable } from '@angular/core';
import { Supabase } from '../supabase';

export interface Song {
  id: string;
  title: string;
  artist: string;
  album?: string;
  file_path: string;
  rating?: number;
  cover_path?: string | null;
  cover_url?: string;

}

@Injectable({ providedIn: 'root' })
export class SongService {
  constructor(private supabase: Supabase) {}

  async getSongs(): Promise<Song[]> {
    const { data, error } = await this.supabase.supabase
      .from('songs')
      .select(`
      id,
      title,
      rating,
      file_path,
      artists:artist_id (
        name
      ),
      albums:album_id (
        title,
                cover_arts:cover_id (
          path
        )
      )
    `)
      .order('rating', { ascending: false, nullsFirst: true });

       console.log('Songs from DB:', data, error);
    if (error) throw error;
    return data.map((item: any) => {
      // Handle albums - could be single object or array
      const album = Array.isArray(item.albums) ? item.albums[0] : item.albums;
      // Handle cover_arts - could be single object or array
      const coverArt = Array.isArray(album?.cover_arts) ? album?.cover_arts[0] : album?.cover_arts;
      
      return {
        id: item.id,
        title: item.title,
        artist: item.artists?.name || 'Unknown Artist',
        album: album?.title,
        cover_path: coverArt?.path ?? null,
        file_path: item.file_path,
        rating: item.rating,
      };
    });
  }

  async getStreamingUrl(filePath: string): Promise<string> {
    const { data,error } = await this.supabase.supabase.storage// {data, error} - in case of signedUrl!!!
      .from('Organizarea')
      .createSignedUrl(filePath, 60 * 60); // 1 hour expiry can be set if using createSignedUrl 60*60

    if (error) throw error;
    return data.signedUrl;
  }

  async getCoverUrl(path: string): Promise<string> {// this is the last thing done
  const { data, error } = await this.supabase.supabase.storage
    .from('Organizarea')
    .createSignedUrl(path, 60 * 60);

  if (error) throw error;
  return data.signedUrl;
}
}
