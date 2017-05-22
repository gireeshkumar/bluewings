
export class Conversation{
  name:String;
  currentslide:any = {};
  slides = [];
  key:string;

  push(slide, note, index = -1){
    if(index === -1){
        this.slides.push({slide: slide, note: note, index: this.slides.length});
        return this.slides.length - 1;
    }else{
       this.slides[index] = {slide: slide, note: note, index: index};
       return index;
    }
  }
}