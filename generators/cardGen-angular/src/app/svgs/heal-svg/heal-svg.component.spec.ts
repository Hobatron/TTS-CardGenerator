import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HealSvgComponent } from './heal-svg.component';

describe('HealSvgComponent', () => {
  let component: HealSvgComponent;
  let fixture: ComponentFixture<HealSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HealSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HealSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
