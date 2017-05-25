import { Injectable } from '@angular/core';
import { Conversation } from '../model/conversation';
import { BackendApiService } from './backend-api.service';

@Injectable()
export class ConversationServiceService {

  currentconv: Conversation;

  constructor(private backendApiService: BackendApiService) { }


  get currentConversation(): Conversation {
    return this.currentconv;
  }
  set currentConversation(conv: Conversation) {
    this.currentconv = conv;
  }

  getConversation(key) {
    return this.backendApiService.getCollection('conversation', key);
  }

  listConversations() {

    this.backendApiService.getCollection('conversation').then(rslt => console.log("get conversation result" + rslt));

    return new Promise((resolve, reject) => {
      this.backendApiService.getCollection('conversation')
        .then(rslt => resolve(this.mapResult(rslt)),
        err => reject(err));
    });

  }

  saveOrUpdateConversation(name: any, note: any, slide: any, index = -1) {
    if (this.currentconv === null || this.currentconv === undefined) {
      this.currentconv = new Conversation();
    }
    this.currentconv.name = name;
    return this.currentconv.push(slide.key, note, index);
  }
  deleteConversation(key) {
    return this.backendApiService.deleteCollection('conversation', key);
  }
  mapResult(rsltlist) {
    for (var i = 0; i < rsltlist.length; i++) {
      const convtmp = new Conversation();
      convtmp.name = rsltlist[i].name;
      convtmp.key = rsltlist[i].key;
      convtmp.slides = rsltlist[i].slides;
      rsltlist[i] = convtmp;
    }
    return rsltlist;
  }
  updateResult(rslt) {
    this.currentconv = new Conversation();
    this.currentconv.name = rslt.name;
    this.currentconv.key = rslt.key;
    this.currentconv.slides = rslt.slides;
  }
  updateConversation(conv) {
    this.backendApiService.updateCollection('conversation', conv.key, conv).then(rslt => console.log('updated:' + rslt), err => console.log(err));
  }
  persistConversation() {
    if (this.currentconv != null) {
      delete this.currentconv.currentslide;
      if (this.currentconv.key != null && this.currentconv.key != undefined) {
        this.updateConversation(this.currentconv);
      } else {
        this.backendApiService.insertCollection('conversation', this.currentconv).then(rslt => this.updateResult(rslt), err => console.log(err));
      }
    }

  }

}
