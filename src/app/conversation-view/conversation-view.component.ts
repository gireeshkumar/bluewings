import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ConversationServiceService } from '../services/conversation-service.service';

@Component({
  selector: 'app-conversation-view',
  templateUrl: './conversation-view.component.html',
  styleUrls: ['./conversation-view.component.css']
})
export class ConversationViewComponent implements OnInit {
  convkey: any;
  errorMessage: any;
  conversation: any;

  constructor(private route: ActivatedRoute, private convService: ConversationServiceService) { }

  ngOnInit() {

    this.route.params.subscribe(
      (params: Params) => {
        this.convkey = params['id'];

        this.convService.getConversation(this.convkey)
          .then(
          rslt => {
            this.conversation = rslt;
            // setTimeout(function(){ $('#myimagemaptest1').rwdImageMaps(); }, 100);
          },
          error => this.errorMessage = <any>error
          );
      });

  }

}
