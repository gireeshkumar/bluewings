import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImagemapeditorComponent } from './imagemapeditor.component';

describe('ImagemapeditorComponent', () => {
  let component: ImagemapeditorComponent;
  let fixture: ComponentFixture<ImagemapeditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImagemapeditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImagemapeditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
