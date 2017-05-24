import {Component} from '@angular/core';

@Component({
    selector: 'my-component',
    template: `
    <div>
        <inline-editor type="text" [(ngModel)]="editableText" (onSave)="saveEditable($event)" name="editableText1" size="8"></inline-editor>
    </div>
    <div>
        <inline-editor type="password" [(ngModel)]="editablePassword" (onSave)="saveEditable($event)"></inline-editor>
    </div>
    <div>
        <inline-editor type="textarea" [(ngModel)]="editableTextArea" (onSave)="saveEditable($event)"> </inline-editor>
    </div>
    <div>
        <inline-editor type="select" [(ngModel)]="editableSelect" (onSave)="saveEditable($event)" [options]="editableSelectOptions"
        value="valor"></inline-editor>
  </div>
  
  
  <div>
    <div class='wrapper'>
      <div class='container' [dragula]='"first-bag"'>
        <div>You can move these elements between these two containers</div>
        <div>Moving them anywhere else isn't quite possible</div>
        <div>There's also the possibility of moving elements around in the same container, changing their position</div>
      </div>
      
      <div class='container' [dragula]='"first-bag"'>
        <div>This is the default use case. You only need to specify the containers you want to use</div>
        <div>More interactive use cases lie ahead</div>
        <div>Make sure to check out the <a href='https://github.com/bevacqua/dragula#readme'>documentation on GitHub!</a></div>
      </div>
    </div>
  </div>
  

  `
})
export class MyComponent {
  title = 'My component!';

  editableText = 'myText';
  editablePassword = 'myPassword';
  editableTextArea = 'Text in text area';
  editableSelect = 2;
  editableSelectOptions =[
    {value: 1, text: 'status1'},
    {value: 2, text: 'status2'},
    {value: 3, text: 'status3'},
    {value: 4, text: 'status4'}
  ];

  saveEditable(value) {
    //call to http service
    console.log('http.service: ' + value);
  }
}