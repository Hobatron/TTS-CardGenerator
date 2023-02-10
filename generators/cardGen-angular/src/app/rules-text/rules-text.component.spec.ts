import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesTextComponent } from './rules-text.component';

describe('RulesTextComponent', () => {
  let component: RulesTextComponent;
  let fixture: ComponentFixture<RulesTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RulesTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
