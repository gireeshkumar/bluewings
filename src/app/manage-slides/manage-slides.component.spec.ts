import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSlidesComponent } from './manage-slides.component';

describe('ManageSlidesComponent', () => {
  let component: ManageSlidesComponent;
  let fixture: ComponentFixture<ManageSlidesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageSlidesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageSlidesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
