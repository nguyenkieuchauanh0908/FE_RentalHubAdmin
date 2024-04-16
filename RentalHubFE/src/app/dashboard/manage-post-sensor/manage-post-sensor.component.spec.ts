import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePostSensorComponent } from './manage-post-sensor.component';

describe('ManagePostSensorComponent', () => {
  let component: ManagePostSensorComponent;
  let fixture: ComponentFixture<ManagePostSensorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManagePostSensorComponent]
    });
    fixture = TestBed.createComponent(ManagePostSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
