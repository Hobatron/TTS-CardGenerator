import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoverSvgComponent } from './discover-svg.component';

describe('DiscoverSvgComponent', () => {
  let component: DiscoverSvgComponent;
  let fixture: ComponentFixture<DiscoverSvgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DiscoverSvgComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscoverSvgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
