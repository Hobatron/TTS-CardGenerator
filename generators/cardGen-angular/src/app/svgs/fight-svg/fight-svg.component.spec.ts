import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FightSvgComponent } from './fight-svg.component';

describe('FightSvgComponent', () => {
  let component: FightSvgComponent;
  let fixture: ComponentFixture<FightSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FightSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FightSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
