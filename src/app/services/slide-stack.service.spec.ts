import { TestBed, inject } from '@angular/core/testing';

import { SlideStackService } from './slide-stack.service';

describe('SlideStackService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SlideStackService]
    });
  });

  it('should ...', inject([SlideStackService], (service: SlideStackService) => {
    expect(service).toBeTruthy();
  }));
});
