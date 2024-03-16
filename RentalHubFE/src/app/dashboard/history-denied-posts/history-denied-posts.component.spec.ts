import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryDeniedPostsComponent } from './history-denied-posts.component';

describe('HistoryDeniedPostsComponent', () => {
  let component: HistoryDeniedPostsComponent;
  let fixture: ComponentFixture<HistoryDeniedPostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HistoryDeniedPostsComponent]
    });
    fixture = TestBed.createComponent(HistoryDeniedPostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
