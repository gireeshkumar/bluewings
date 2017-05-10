import { Component, OnInit } from '@angular/core';
import { BackendApiService } from '../services/backend-api.service';

declare var elasticlunr: any;
declare var Reveal: any;
declare var Deslider: any;

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
  viewtype = 'search';
  selectedDeck = null;

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

  doView(deckid, slideid) {
    console.log('deckid: ' + deckid);
    console.log('slideid: ' + slideid);

    this.selectedDeck = this.datamap[deckid];

    this.viewtype = 'view';


    var imgSources = [];
    var index = 0;
    var i = 0;

    for (let page of this.selectedDeck.pages) {
      imgSources.push({link:'/assets/imgs/' + page.image});
      if(page.id === slideid){
        index = i;
      }
      i++;
    }

    var containerId = '#deslider-container';

    var options = {
      auto: {
        speed: 3000,
        pauseOnHover: true,
      },
      fullScreen: true,
      swipe: true,
      pagination: true,
      repeat: true,
      index: index
    };

    var initSlides = function () {
      var myDeslider = new Deslider(imgSources, containerId, options);
    }

    setTimeout(initSlides, 1000);



    /*
    Reveal.initialize({
			width: "100%",
			
			height: "800px",
			
			margin: 0,
			
		    // Display controls in the bottom right corner
		    controls: true,

		    // Display a presentation progress bar
		    progress: false,

		    // Push each slide change to the browser history
		    history: false,

		    // Enable keyboard shortcuts for navigation
		    keyboard: true,

		    // Enable the slide overview mode
		    overview: true,

		    // Vertical centering of slides
		    center: true,

		    // Loop the presentation
		    loop: false,

		    // Change the presentation direction to be RTL
		    rtl: false,

		    // Number of milliseconds between automatically proceeding to the 
		    // next slide, disabled when set to 0, this value can be overwritten
		    // by using a data-autoslide attribute on your slides
		    autoSlide: 0,

		    // Enable slide navigation via mouse wheel
		    mouseWheel: false,

		    // Apply a 3D roll to links on hover
		    rollingLinks: true,

		    // Transition style
		    transition: 'default', // default/cube/page/concave/zoom/linear/fade/none
			
		});
	Reveal.slide(0);
  */
  }
  doSearch() {
    this.viewtype = 'search';
    const rslt = this.index.search(this.searchkeywords);
    console.log(rslt);

    const slidelist = [];
    for (const rc of rslt) {
      slidelist.push(this.datamap[rc.ref])
    }
    this.slides = slidelist;
    //alert('done');

    //this.doView();
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