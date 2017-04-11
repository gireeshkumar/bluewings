import {Component, Compiler, ViewContainerRef, ViewChild, Input, ComponentRef, ComponentFactory, ComponentFactoryResolver, ChangeDetectorRef} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {CalendarComponent} from '../cal/cal.component';

@Component({
  selector: 'dcl-wrapper',
  template: `<div #target></div>`
})
export class DclWrapper {

  @ViewChild('target', {read: ViewContainerRef}) target:any;
  @Input("type") type:any;
  cmpRef:ComponentRef<any>;

  private isViewInitialized:boolean = false;
  
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private compiler: Compiler,
      private cdRef:ChangeDetectorRef) {
          
      }

  updateComponent() {
    if(!this.isViewInitialized) {
      return;
    }
    if(this.cmpRef) {
      this.cmpRef.destroy();
    }

     var factories = Array.from(this.componentFactoryResolver['_factories'].keys());
    var factoryClass0:any = factories.find((x: any) => x.name === this.type);
    const factory0 = this.componentFactoryResolver.resolveComponentFactory(factoryClass0);

    // let factory = this.componentFactoryResolver.resolveComponentFactory(CalendarComponent);
    this.cmpRef = this.target.createComponent(factory0);
    // to access the created instance use
    // this.compRef.instance.someProperty = 'someValue';
    // this.compRef.instance.someOutput.subscribe(val => doSomething());
    this.cdRef.detectChanges();
  }
  
  ngOnChanges() {
    this.updateComponent();
  }
  
  ngAfterViewInit() {
    this.isViewInitialized = true;
    this.updateComponent();  
  }
  
  ngOnDestroy() {
    if(this.cmpRef) {
      this.cmpRef.destroy();
    }    
  }
}
