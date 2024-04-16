import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentReasonDialogComponent } from './comment-reason-dialog.component';

describe('CommentReasonDialogComponent', () => {
  let component: CommentReasonDialogComponent;
  let fixture: ComponentFixture<CommentReasonDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CommentReasonDialogComponent]
    });
    fixture = TestBed.createComponent(CommentReasonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
