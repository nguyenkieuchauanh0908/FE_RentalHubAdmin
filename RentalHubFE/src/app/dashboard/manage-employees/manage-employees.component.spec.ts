import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageEmployeesComponent } from './manage-employees.component';

describe('ManageEmployeesComponent', () => {
  let component: ManageEmployeesComponent;
  let fixture: ComponentFixture<ManageEmployeesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageEmployeesComponent]
    });
    fixture = TestBed.createComponent(ManageEmployeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
