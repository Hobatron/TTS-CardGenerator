import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsablesComponent } from './usables.component';

describe('UsablesComponent', () => {
  let component: UsablesComponent;
  let fixture: ComponentFixture<UsablesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UsablesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
