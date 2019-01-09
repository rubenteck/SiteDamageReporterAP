import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllDefectsComponent } from './all-defects.component';

describe('AllDefectsComponent', () => {
  let component: AllDefectsComponent;
  let fixture: ComponentFixture<AllDefectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllDefectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllDefectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
