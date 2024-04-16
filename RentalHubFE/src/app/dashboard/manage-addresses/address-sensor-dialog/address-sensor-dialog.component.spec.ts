import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressSensorDialogComponent } from './address-sensor-dialog.component';

describe('AddressSensorDialogComponent', () => {
  let component: AddressSensorDialogComponent;
  let fixture: ComponentFixture<AddressSensorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressSensorDialogComponent]
    });
    fixture = TestBed.createComponent(AddressSensorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
