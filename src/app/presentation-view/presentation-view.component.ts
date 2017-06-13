import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ConversationServiceService } from '../services/conversation-service.service';

declare var Reveal: any;

@Component({
  selector: 'app-presentation-view',
  templateUrl: './presentation-view.component.html',
  styleUrls: ['./presentation-view.component.css']
})
export class PresentationViewComponent implements OnInit, AfterViewChecked {
  convkey: any;
  conversation: any;
  slides: any;

  errorMessage: any;
  initialized = false;

  constructor(private route: ActivatedRoute,
    private convService: ConversationServiceService) {
  }

  ngOnInit() {

    this.route.params.subscribe(
      (params: Params) => {
        this.convkey = params['id'];

        this.convService.getConversation(this.convkey)
          .then(
          rslt => {
            this.conversation = rslt;

            this.conversation.slides.sort(function (a, b) { return a.index > b.index });

            this.slides = this.conversation.slides;
            // setTimeout(function(){ $('#myimagemaptest1').rwdImageMaps(); }, 100);
          },
          error => this.errorMessage = <any>error
          );
      });
  }

  ngAfterViewChecked() {
    if (this.slides !== null && this.slides !== undefined && this.slides.length > 0)
      if (!this.initialized) {
        Reveal.initialize({ embedded: true, height: "100%", margin: 0, minScale: 1, maxScale: 1 });
        this.initialized = true;
      }

  }

}
