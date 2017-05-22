import { TestBed, inject } from '@angular/core/testing';

import { ConversationServiceService } from './conversation-service.service';

describe('ConversationServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConversationServiceService]
    });
  });

  it('should ...', inject([ConversationServiceService], (service: ConversationServiceService) => {
    expect(service).toBeTruthy();
  }));
});
