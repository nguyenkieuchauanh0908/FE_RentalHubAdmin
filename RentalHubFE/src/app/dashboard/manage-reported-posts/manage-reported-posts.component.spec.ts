import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageReportedPostsComponent } from './manage-reported-posts.component';

describe('ManageReportedPostsComponent', () => {
  let component: ManageReportedPostsComponent;
  let fixture: ComponentFixture<ManageReportedPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageReportedPostsComponent]
    });
    fixture = TestBed.createComponent(ManageReportedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
