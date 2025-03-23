import { Injectable } from '@angular/core';
import { Blog } from '../models/blog.interface';
import { HttpClient } from '@angular/common/http';  
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  private apiUrl = 'http://localhost:3000/api/blog';  // L'URL de ton API backend

  constructor(private http: HttpClient) {}

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);  // Appelle simplement l'API
  }
  getMissionMessages(missionId: number): Observable<Blog[]> {
    return this.http.get<Blog[]>(`${this.apiUrl}/getMissionMessages?missionId=${missionId}`);
  }
  

  sendMessage(messageData: { message: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/send`, messageData);
  }
}
