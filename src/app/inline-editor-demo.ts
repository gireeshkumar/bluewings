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
  </div>`
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