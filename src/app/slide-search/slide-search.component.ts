import { Component, OnInit } from '@angular/core';
import { BackendApiService } from '../services/backend-api.service';

declare var elasticlunr: any;

@Component({
  selector: 'app-slide-search',
  templateUrl: './slide-search.component.html',
  styleUrls: ['./slide-search.component.css']
})


//
export class SlideSearchComponent implements OnInit {

  listview = 'grid';
  slides = null;
  gridclass = 'grid-group-item';
  jsondata: any;
  index: any;
  searchkeywords: string;
  datamap: any = {};

  constructor(apiservice: BackendApiService) {
    apiservice.getJSON().subscribe(data => {
      this.jsondata = data, this.loadData(), error => console.log(error)
    });
  }

  loadData() {
    this.index = elasticlunr(function () {
      this.addField('keywords');
      this.setRef('refid');
    });

    var decks = this.jsondata.deck;
    for (let deck of decks) {
      this.datamap[deck.id] = deck;
      for (let page of deck.pages) {
        let key = deck.id + '#' + page.id;
        page.refid = key;
        page.deckid = deck.id;
        console.log(page);
        this.index.addDoc(page);

        this.datamap[key] = page;
      }
    }

  }

  ngOnInit() {

  }

  doSearch() {
    const rslt = this.index.search(this.searchkeywords);
    console.log(rslt);

    const slidelist = [];
    for (const rc of rslt) {
      slidelist.push(this.datamap[rc.ref])
    }
    this.slides = slidelist;
  }

  changeDisplay(event, view) {
    event.preventDefault();
    event.stopPropagation();
    alert('view: ' + view);

    this.gridclass = (view === 'list' ? 'list-group-item' : 'grid-group-item');
  }

}




// $(document).ready(function() {
//     $('#list').click(function(event){event.preventDefault();$('#products .item').addClass('list-group-item');});
//     $('#grid').click(function(event){event.preventDefault();$('#products .item').removeClass('list-group-item');$('#products .item').addClass('grid-group-item');});
// });