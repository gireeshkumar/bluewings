import { Component, OnInit , AfterViewChecked} from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ConversationServiceService } from '../services/conversation-service.service';
import { DragulaService } from 'ng2-dragula';

declare var $:any;
declare var ImageViewer:any;

@Component({
  selector: 'app-conversation-view',
  templateUrl: './conversation-view.component.html',
  styleUrls: ['./conversation-view.component.css']
})
export class ConversationViewComponent implements OnInit , AfterViewChecked{
  convkey: any;
  errorMessage: any;
  conversation: any;
  slides:any;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private convService: ConversationServiceService,
    private dragulaService: DragulaService) {


    // dragulaService.dropModel.subscribe((value) => {
    //   this.onDropModel(value.slice(1));
    // });
    // dragulaService.removeModel.subscribe((value) => {
    //   this.onRemoveModel(value.slice(1));
    // });

    dragulaService.drop.subscribe((value) => {
      console.log(`drop: ${value[0]}`);
      this.onDrop(value.slice(1));
      this.onDropModel(value.slice(1));
    });


  }
   ngAfterViewChecked() {
     if($('.gallery-items').length > 0){
        $('.gallery-items').popImg();
     }
   }

  ngOnInit() {

    this.route.params.subscribe(
      (params: Params) => {
        this.convkey = params['id'];

        this.convService.getConversation(this.convkey)
          .then(
          rslt => {
            this.conversation = rslt;

            this.conversation.slides.sort(function(a, b){return a.index > b.index});

            this.slides = this.conversation.slides;
            // setTimeout(function(){ $('#myimagemaptest1').rwdImageMaps(); }, 100);
          },
          error => this.errorMessage = <any>error
          );
      });

  }

  addSlides(){
     this.convService.currentConversation = this.conversation;
     this.router.navigate(['/slidesearch']);
  }

  private onDrop(args) {
    let [e, el] = args;
    // do something
  }
  private onDropModel(args) {
    let [el, target, source] = args;
    // do something else

    var idxchange = [];
    for(var i = 0; i < this.conversation.slides.length; i++){
      this.conversation.slides[i].index = i;
      idxchange.push({index: i, slide: this.conversation.slides[i].key});
    }

    // save index change
     var cp = { name: this.conversation.name, key: this.conversation.key, merge: true , slides: idxchange};
    this.convService.updateConversation(cp);
  }

  private onRemoveModel(args) {
    let [el, source] = args;
    // do something else
  }

  saveEditTitle($event) {
    var cp = { name: this.conversation.name, key: this.conversation.key, merge: true };
    this.convService.updateConversation(cp);
  }
  saveNoteEdit($event, slide) {
    console.log("Note Edited");
    // merge note / save to conversation and slide, merge = true
    // sending only the updated slide 
    var cp = {
      name: this.conversation.name, key: this.conversation.key,
      slides: [{ index: slide.index, slide: slide.key, note: slide.note }],
      merge: true
    };
    this.convService.updateConversation(cp);
  }

  deleteConversation() {
    this.convService.deleteConversation(this.conversation.key)
      .then(rslt => this.router.navigate(['/conversations']));
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
