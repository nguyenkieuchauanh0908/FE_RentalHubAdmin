import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateEmployeeLoginDetailDialogComponent } from './update-employee-login-detail-dialog.component';

describe('UpdateEmployeeLoginDetailDialogComponent', () => {
  let component: UpdateEmployeeLoginDetailDialogComponent;
  let fixture: ComponentFixture<UpdateEmployeeLoginDetailDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UpdateEmployeeLoginDetailDialogComponent]
    });
    fixture = TestBed.createComponent(UpdateEmployeeLoginDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
