import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Select2CustomComponent } from './select2-custom.component';

describe('Select2CustomComponent', () => {
  let component: Select2CustomComponent;
  let fixture: ComponentFixture<Select2CustomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Select2CustomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Select2CustomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
