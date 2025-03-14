import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrancheDetailsComponent } from './branche-details.component';

describe('BrancheDetailsComponent', () => {
  let component: BrancheDetailsComponent;
  let fixture: ComponentFixture<BrancheDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrancheDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BrancheDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
