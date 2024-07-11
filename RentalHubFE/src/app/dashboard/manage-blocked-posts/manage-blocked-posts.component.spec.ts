import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBlockedPostsComponent } from './manage-blocked-posts.component';

describe('ManageBlockedPostsComponent', () => {
  let component: ManageBlockedPostsComponent;
  let fixture: ComponentFixture<ManageBlockedPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageBlockedPostsComponent]
    });
    fixture = TestBed.createComponent(ManageBlockedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
