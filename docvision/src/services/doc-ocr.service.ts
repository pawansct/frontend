// ocr.service.ts
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DocOcrService {

  private apiUrl = environment.apiUrl || 'https://openrouter.ai/api/v1/chat/completions';
  private apiKey = environment.apiKey || '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';

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) { }

  callOcrApi(imageUrl: string) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.apiKey}`
    });

    const body = {
      model: 'google/gemma-3-27b-it:free',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `You are an intelligent OCR assistant. Extract all clearly visible and readable text from the document image below. Do not guess missing or unclear text.If the document contains any personal or identity information such as:- Name
- Date of Birth
- Gender
- Address
- Document Type
- ID Number

Return the extracted information in the following JSON format:

{
  "name": "",
  "date_of_birth": "",
  "gender": "",
  "address": "",
  "document_type": "",
  "id_number": "",
  "raw_text": ""
}
The \`raw_text\` field should include the full readable content of the document as plain text. Fill only the fields that can be confidently extracted from the image.`
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl
              }
            }
          ]
        }
      ]
    };

    return this.http.post(this.apiUrl, body, { headers });
  }
}
