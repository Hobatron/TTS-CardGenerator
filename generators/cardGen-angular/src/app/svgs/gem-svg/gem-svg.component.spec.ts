import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GemSvgComponent } from './gem-svg.component';

describe('GemSvgComponent', () => {
  let component: GemSvgComponent;
  let fixture: ComponentFixture<GemSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GemSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GemSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
