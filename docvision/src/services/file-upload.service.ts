import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = 'https://dococrbackend-production.up.railway.app'
  // private url = 'http://localhost:3000/api/upload';
  private url = `${this.baseUrl}/api/upload`;

  constructor(private http: HttpClient) {}

  storeFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.url, formData);
  }
}
