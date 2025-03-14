import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSupllierComponent } from './add-supllier.component';

describe('AddSupllierComponent', () => {
  let component: AddSupllierComponent;
  let fixture: ComponentFixture<AddSupllierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddSupllierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddSupllierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
