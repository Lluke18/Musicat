import { Injectable } from '@angular/core';
import { Supabase } from '../supabase';

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private supabase: Supabase) {}

  async signup(
    name: string,
    email: string,
    username: string,
    password: string
  ): Promise<User> {
    // Check if username already exists
    const { data: existingUser, error: checkError } = await this.supabase.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }

    if (existingUser) {
      throw new Error('Username already exists');
    }

    // Insert new user
    const { data, error } = await this.supabase.supabase
      .from('users')
      .insert([{ name, email, username, password }])
      .select()
      .single();

    if (error) throw error;
    return data as User;
  }

  async login(username: string, password: string): Promise<User> {
    const { data, error } = await this.supabase.supabase
      .from('users')
      .select('*')
      .eq('username', username)
      .eq('password', password)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        throw new Error('Invalid username or password');
      }
      throw error;
    }

    return data as User;
  }

  saveUserToLocalStorage(user: User): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('currentUser', JSON.stringify(user));
    }
  }

  getUserFromLocalStorage(): User | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('currentUser');
    }
  }
}
