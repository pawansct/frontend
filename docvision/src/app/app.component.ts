import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { DocOcrService } from '../services/doc-ocr.service';
import { FileUploadService } from '../services/file-upload.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDividerModule
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private ocrService: DocOcrService, private fileUploadService: FileUploadService) { }
  title = 'DocVision';
  selectedLanguage = 'English';
  extractedText: any = [];
  isProcessing = false;
  selectedFile: File | null = null;

  languages = [
    { value: 'en', label: 'English' }
  ];

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.isProcessing = true;
    if (file) {
      this.selectedFile = file;
      this.fileUploadService.storeFile(file).subscribe({
        next: (res: any) => {
          if (res) {
            console.log('File Upload successful:', res);
            let fileUrl = res?.fileUrl?.Location
            this.processImage(fileUrl);
          }
        },
        error: (err) => {
          console.error('File Upload failed:', err);
        }
      });

    }
  }


  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.isProcessing = true;
      if (file) {
        this.selectedFile = file;
        this.fileUploadService.storeFile(file).subscribe({
          next: (res: any) => {
            if (res) {
              console.log('File Upload successful:', res);
              let fileUrl = res?.fileUrl?.Location
              this.processImage(fileUrl);
            }
          },
          error: (err) => {
            console.error('File Upload failed:', err);
          }
        });

      }


    }
  }

  processImage(imageUrl: any) {
    this.extractedText = '';
    this.ocrService.callOcrApi(imageUrl).subscribe({
      next: (res: any) => {
        if (res) {
          console.log("content ++++++", res.choices?.[0]?.message?.content)
          this.isProcessing = false;
          const content = res.choices?.[0]?.message?.content;
          let parsedContent = '';

          try {
            const cleaned = content.replace(/```json|```/g, '').trim();
            const obj = JSON.parse(cleaned);
            parsedContent = Object.entries(obj)
              .map(([key, value]) => `${key}: ${value ?? ''}`)
              .join('\n');
          } catch (err) {
            parsedContent = content.trim();
          }

          this.extractedText = parsedContent;
        }
      },
      error: err => {
        console.error('OCR API error', err);
        this.isProcessing = false;
      }
    });

  }

  chooseFile() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  clearText() {
    this.extractedText = '';
    this.selectedFile = null;
  }

  copyText() {
    if (this.extractedText) {
      navigator.clipboard.writeText(this.extractedText);
    }
  }

  downloadText() {
    if (this.extractedText) {
      const blob = new Blob([this.extractedText], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'extracted-text.txt';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }

  onCameraCapture(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files?.length) {
    const file = input.files[0];
    console.log('Captured image:', file);
    // handle file upload or processing
      if (file) {
        this.selectedFile = file;
        this.fileUploadService.storeFile(file).subscribe({
          next: (res: any) => {
            if (res) {
              console.log('File Upload successful:', res);
              let fileUrl = res?.fileUrl?.Location
              this.processImage(fileUrl);
            }
          },
          error: (err) => {
            console.error('File Upload failed:', err);
          }
        });

      }

  }
}

}
