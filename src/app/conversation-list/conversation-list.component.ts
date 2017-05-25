import { Component, OnInit } from '@angular/core';
import { ConversationServiceService } from '../services/conversation-service.service';

@Component({
  selector: 'app-conversation-list',
  templateUrl: './conversation-list.component.html',
  styleUrls: ['./conversation-list.component.css']
})
export class ConversationListComponent implements OnInit {

  conversations: any;
  errorMessage: any;

  constructor(private convService: ConversationServiceService) { }

  ngOnInit() {
    this.loadconversations();
  }
  loadconversations() {
    this.convService.listConversations()
      .then(
      list => this.conversations = list,
      error => this.errorMessage = <any>error
      );
  }
  deleteConversation(key, index) {

    var r = confirm('Are you sure you want to delete this conversation - '+this.conversations[index].name);
      if (r == true) {
          this.convService.deleteConversation(key)
            .then(rslt => this.loadconversations());
      }
  }
}