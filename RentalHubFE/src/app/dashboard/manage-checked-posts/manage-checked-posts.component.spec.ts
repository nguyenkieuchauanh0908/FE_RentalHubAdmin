import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCheckedPostsComponent } from './manage-checked-posts.component';

describe('ManageCheckedPostsComponent', () => {
  let component: ManageCheckedPostsComponent;
  let fixture: ComponentFixture<ManageCheckedPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageCheckedPostsComponent]
    });
    fixture = TestBed.createComponent(ManageCheckedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
