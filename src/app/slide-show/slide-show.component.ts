import { Component, OnInit, AfterViewInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { BackendApiService } from '../services/backend-api.service';
import { ConversationServiceService } from '../services/conversation-service.service';
import { HostListener } from '@angular/core';
import { Conversation } from '../model/conversation';
import { SlideStackService } from '../services/slide-stack.service';

declare var $: any;



@Component({
  selector: 'app-slide-show',
  templateUrl: './slide-show.component.html',
  styleUrls: ['./slide-show.component.css']
})
export class SlideShowComponent implements OnInit, AfterViewInit, AfterViewChecked {

  slidekey: any;
  errorMessage: any;
  parentslide: any;
  alwaysOn = false;
  pluginactivated = false;
  conversation: Conversation = new Conversation();// dummy
  conversationIndex = -1;
  type:string = 'existing';
  conversations:any;
  selectedConv:any;


  constructor(private route: ActivatedRoute, 
              private apiservice: BackendApiService,
              private convService: ConversationServiceService,
              private slideStack: SlideStackService) { }

  ngOnInit() {
    console.log('ngOnInit');

    this.route.params.subscribe(
      (params: Params) => {

        this.loadconversations();

        this.conversation = new Conversation();
        this.conversationIndex = -1;
        this.pluginactivated = false;
        this.parentslide = null;
        this.alwaysOn = false;
        console.log('route.params.subscribe');
        console.log(params);

        // this.slidekey = params['id'];
        var keys = params['id'].split(';');
        this.slidekey = keys[0];
        if(keys.length > 1){
          var pslide = keys[1].split('=')[1];
          if(pslide === '-1'){
            // reset till here
            this.slideStack.reset(this.slidekey);
          }
        }else{
          this.slideStack.reset();
        }
        if (this.slidekey != null && this.slidekey != undefined) {
          this.apiservice.getCollection('slides', this.slidekey)
            .then(
            slide => {
              this.parentslide = slide;
              this.slideStack.push(slide);
              // setTimeout(function(){ $('#myimagemaptest1').rwdImageMaps(); }, 100);
            },
            error => this.errorMessage = <any>error
            );
        }

      }
    );
  }

  onConvChange(newValue){
    console.log(newValue);
    this.selectedConv = this.conversations[parseInt(newValue)];
    this.convService.currentConversation = this.selectedConv;
  }

  loadconversations() {
    console.log("Load conversations");
    this.convService.listConversations()
      .then(
      list => this.conversations = list,
      error => this.errorMessage = <any>error
      );
  }

   @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    console.log('Back button pressed');
  }

  makeNewConv(){
    this.selectedConv = null;
    this.convService.currentConversation = null;
    this.type = 'new';
  }
  cancelMakeNewConv(){
    this.type = 'existing';
  }
  getSlideImage(slide) {
    return (slide === null || slide === undefined ? '' : 'api/v1/file/view/' + this.parentslide.file);
  }

  ngAfterViewInit() {
  }
  ngAfterViewChecked() {
    // double check to make sure the imagemap loaded before invoking the jquery plugin
    if(this.parentslide != null && this.parentslide != undefined){

      if($('.areacomp').length > 0 && !this.pluginactivated){
        this.pluginactivated = true;
        $('#myimagemaptest1').mapTrifecta({alwaysOn: false, zoom: false, fillColor: '008800', table: false});
      }
    }
  }

  highLightMap(event){
     event.preventDefault();
     this.alwaysOn = !this.alwaysOn;
     $('#myimagemaptest1').maphilight({alwaysOn: this.alwaysOn});
  }

  saveConversation() {
    console.log(this.conversation);

    let curconv;
    if(this.selectedConv != null && this.selectedConv != undefined){
      curconv = this.selectedConv;
    }else{
      if(this.conversation.name !== null && this.conversation.name !== undefined){
          curconv = this.conversation;
      }else {
        alert('Please enter a new conversation name or select existing conversation');
        return;
      }
    }

    this.conversationIndex = this.convService.saveOrUpdateConversation(curconv.name, this.conversation.currentslide.note, this.parentslide, this.conversationIndex);

    // if(this.conversation.name !== null && this.conversation.name !== undefined){
    //   this.conversationIndex = this.convService.saveOrUpdateConversation(this.conversation, this.parentslide, this.conversationIndex);
    // }
    $('#addToConvModal').modal('hide');
    this.convService.persistConversation();
  }
  addToConversation(){
    if (this.convService.currentConversation != null){
      this.conversation.name = this.convService.currentConversation.name;
    }
    $('#addToConvModal').modal('show');
  }
}
