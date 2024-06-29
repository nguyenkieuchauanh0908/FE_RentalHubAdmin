import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumPostSensorDialogComponent } from './forum-post-sensor-dialog.component';

describe('ForumPostSensorDialogComponent', () => {
  let component: ForumPostSensorDialogComponent;
  let fixture: ComponentFixture<ForumPostSensorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForumPostSensorDialogComponent]
    });
    fixture = TestBed.createComponent(ForumPostSensorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
