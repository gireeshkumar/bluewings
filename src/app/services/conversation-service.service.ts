import { Injectable } from '@angular/core';
import { Conversation } from '../model/conversation';
import { BackendApiService } from './backend-api.service';

@Injectable()
export class ConversationServiceService {

  currentconv: Conversation;

  constructor(private backendApiService: BackendApiService) { }

  getCurrentConversation() {
    return this.currentconv;
  }

  getConversation(key){
    return this.backendApiService.getCollection('conversation', key);
  }

  listConversations(){
   return this.backendApiService.getCollection('conversation');    
  }

  saveOrUpdateConversation(conv: Conversation, slide: any, index = -1) {
    if (this.currentconv === null || this.currentconv === undefined) {
      this.currentconv = new Conversation();
    }
    this.currentconv.name = conv.name;
    return this.currentconv.push(slide.key, conv.currentslide.note, index);
  }


updateResult(rslt){
   this.currentconv = new Conversation();
   this.currentconv.name = rslt.name;
   this.currentconv.key = rslt.key;
   this.currentconv.slides = rslt.slides;
}
  persistConversation() {
    if (this.currentconv != null) {
      delete this.currentconv.currentslide;
      if (this.currentconv.key != null && this.currentconv.key != undefined) {
        this.backendApiService.updateCollection('conversation', this.currentconv.key, this.currentconv).then(rslt => console.log('updated:'+rslt) , err => console.log(err));
      } else {
        this.backendApiService.insertCollection('conversation', this.currentconv).then(rslt => this.updateResult(rslt), err => console.log(err));
      }
    }

  }

}
