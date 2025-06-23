import { TestBed } from '@angular/core/testing';

import { DocOcrService } from './doc-ocr.service';

describe('DocOcrService', () => {
  let service: DocOcrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocOcrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
