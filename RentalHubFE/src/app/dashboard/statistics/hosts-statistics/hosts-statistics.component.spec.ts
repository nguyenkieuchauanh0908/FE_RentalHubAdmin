import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostsStatisticsComponent } from './hosts-statistics.component';

describe('HostsStatisticsComponent', () => {
  let component: HostsStatisticsComponent;
  let fixture: ComponentFixture<HostsStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostsStatisticsComponent]
    });
    fixture = TestBed.createComponent(HostsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
