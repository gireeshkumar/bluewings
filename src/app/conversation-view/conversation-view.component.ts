import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
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

  constructor(private route: ActivatedRoute, private router: Router, private convService: ConversationServiceService) { }

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
  saveEditTitle($event){
    var cp = { name: this.conversation.name, key: this.conversation.key, merge: true};
    this.convService.updateConversation(cp);
  }
  saveNoteEdit($event, slide){
    console.log("Note Edited");
    // merge note / save to conversation and slide, merge = true
    // sending only the updated slide 
    var cp = { name: this.conversation.name, key: this.conversation.key, 
              slides: [{ index: slide.index, slide: slide.key, note: slide.note }] , 
            merge: true};
    this.convService.updateConversation(cp);
  }

  deleteConversation(){
    this.convService.deleteConversation(this.conversation.key)
      .then(rslt=> this.router.navigate(['/conversations']));
  }

  deleteSlide(slide, index) {
    this.conversation.slides.splice(index, 1);
    console.log(this.conversation);

    this.saveConversation();
  }

  saveConversation() {
    // copy / clone for save
    var cp = { name: this.conversation.name, key: this.conversation.key, slides: [] };

    for (var i = 0; i < this.conversation.slides.length; i++) {
      var sld = this.conversation.slides[i];
      cp.slides.push({ index: sld.index, slide: sld.key, note: sld.note });
    }

    this.convService.updateConversation(cp);
  }

}
