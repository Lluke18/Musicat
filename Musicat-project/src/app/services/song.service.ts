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

interface CachedUrl {
  url: string;
  expiresAt: number;
}

@Injectable({ providedIn: 'root' })
export class SongService {
  private coverUrlCache = new Map<string, CachedUrl>();
  private readonly CACHE_EXPIRY_BUFFER = 5 * 60 * 1000; // 5 minutes before expiry to refresh
  private readonly CACHE_STORAGE_KEY = 'musicat_cover_urls';
  private readonly COVER_URL_EXPIRY_HOURS = 24; // 24 hours expiry for cover images

  constructor(private supabase: Supabase) {
    this.loadCacheFromStorage();
  }

  private loadCacheFromStorage(): void {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }
      const stored = localStorage.getItem(this.CACHE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        // Only load non-expired entries
        for (const [path, cached] of Object.entries(parsed)) {
          const cacheEntry = cached as CachedUrl;
          if (cacheEntry.expiresAt > now) {
            this.coverUrlCache.set(path, cacheEntry);
          }
        }
      }
    } catch (error) {
      console.warn('Failed to load cover URL cache from storage:', error);
    }
  }

  private saveCacheToStorage(): void {
    try {
      if (typeof localStorage === 'undefined') {
        return;
      }
      const cacheObj: Record<string, CachedUrl> = {};
      this.coverUrlCache.forEach((value, key) => {
        cacheObj[key] = value;
      });
      localStorage.setItem(this.CACHE_STORAGE_KEY, JSON.stringify(cacheObj));
    } catch (error) {
      console.warn('Failed to save cover URL cache to storage:', error);
    }
  }

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

  async getCoverUrl(path: string): Promise<string> {
    if (!path) {
      throw new Error('Cover path is required');
    }

    // Check cache first
    const cached = this.coverUrlCache.get(path);
    const now = Date.now();
    
    // Return cached URL if it exists and hasn't expired (with buffer)
    if (cached && cached.expiresAt > (now + this.CACHE_EXPIRY_BUFFER)) {
      return cached.url;
    }

    // Generate new signed URL with longer expiry for covers
    const { data, error } = await this.supabase.supabase.storage
      .from('Organizarea')
      .createSignedUrl(path, this.COVER_URL_EXPIRY_HOURS * 60 * 60);

    if (error) throw error;
    
    // Cache the URL with expiry time
    const expiresAt = now + (this.COVER_URL_EXPIRY_HOURS * 60 * 60 * 1000);
    this.coverUrlCache.set(path, {
      url: data.signedUrl,
      expiresAt: expiresAt
    });
    
    // Persist to localStorage
    this.saveCacheToStorage();
    
    return data.signedUrl;
  }

  // Clear cache if needed (e.g., on logout)
  clearCoverCache(): void {
    this.coverUrlCache.clear();
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(this.CACHE_STORAGE_KEY);
      }
    } catch (error) {
      console.warn('Failed to clear cover URL cache from storage:', error);
    }
  }
}
