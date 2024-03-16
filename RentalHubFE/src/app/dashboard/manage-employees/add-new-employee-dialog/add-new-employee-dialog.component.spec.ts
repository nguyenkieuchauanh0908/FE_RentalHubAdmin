import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewEmployeeDialogComponent } from './add-new-employee-dialog.component';

describe('AddNewEmployeeDialogComponent', () => {
  let component: AddNewEmployeeDialogComponent;
  let fixture: ComponentFixture<AddNewEmployeeDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddNewEmployeeDialogComponent]
    });
    fixture = TestBed.createComponent(AddNewEmployeeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
