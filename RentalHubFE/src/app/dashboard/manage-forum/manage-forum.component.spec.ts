import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageForumComponent } from './manage-forum.component';

describe('ManageForumComponent', () => {
  let component: ManageForumComponent;
  let fixture: ComponentFixture<ManageForumComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageForumComponent]
    });
    fixture = TestBed.createComponent(ManageForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
