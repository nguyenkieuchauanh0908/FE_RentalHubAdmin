import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersStatisticsComponent } from './users-statistics.component';

describe('UsersStatisticsComponent', () => {
  let component: UsersStatisticsComponent;
  let fixture: ComponentFixture<UsersStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersStatisticsComponent]
    });
    fixture = TestBed.createComponent(UsersStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
