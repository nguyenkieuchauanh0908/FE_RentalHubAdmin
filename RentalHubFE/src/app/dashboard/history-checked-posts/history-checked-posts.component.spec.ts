import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryCheckedPostsComponent } from './history-checked-posts.component';

describe('HistoryCheckedPostsComponent', () => {
  let component: HistoryCheckedPostsComponent;
  let fixture: ComponentFixture<HistoryCheckedPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryCheckedPostsComponent]
    });
    fixture = TestBed.createComponent(HistoryCheckedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
