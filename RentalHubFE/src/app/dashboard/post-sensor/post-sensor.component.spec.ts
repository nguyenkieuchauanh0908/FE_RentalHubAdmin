import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostSensorComponent } from './post-sensor.component';

describe('PostSensorComponent', () => {
  let component: PostSensorComponent;
  let fixture: ComponentFixture<PostSensorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostSensorComponent]
    });
    fixture = TestBed.createComponent(PostSensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
