import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeesStatisticsComponent } from './employees-statistics.component';

describe('EmployeesStatisticsComponent', () => {
  let component: EmployeesStatisticsComponent;
  let fixture: ComponentFixture<EmployeesStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmployeesStatisticsComponent]
    });
    fixture = TestBed.createComponent(EmployeesStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
