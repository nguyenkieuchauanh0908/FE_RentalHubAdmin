import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSensorDialogComponent } from './post-sensor-dialog.component';

describe('PostSensorDialogComponent', () => {
  let component: PostSensorDialogComponent;
  let fixture: ComponentFixture<PostSensorDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostSensorDialogComponent]
    });
    fixture = TestBed.createComponent(PostSensorDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
