import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDeniedPostsComponent } from './manage-denied-posts.component';

describe('ManageDeniedPostsComponent', () => {
  let component: ManageDeniedPostsComponent;
  let fixture: ComponentFixture<ManageDeniedPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageDeniedPostsComponent]
    });
    fixture = TestBed.createComponent(ManageDeniedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
