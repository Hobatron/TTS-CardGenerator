import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MineSvgComponent } from './mine-svg.component';

describe('MineSvgComponent', () => {
  let component: MineSvgComponent;
  let fixture: ComponentFixture<MineSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MineSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MineSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
