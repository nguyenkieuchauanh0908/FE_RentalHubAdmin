import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostSensorDialogComponent } from './host-sensor-dialog.component';

describe('HostSensorDialogComponent', () => {
  let component: HostSensorDialogComponent;
  let fixture: ComponentFixture<HostSensorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HostSensorDialogComponent]
    });
    fixture = TestBed.createComponent(HostSensorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
