import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostsStatisticsComponent } from './posts-statistics.component';

describe('PostsStatisticsComponent', () => {
  let component: PostsStatisticsComponent;
  let fixture: ComponentFixture<PostsStatisticsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PostsStatisticsComponent]
    });
    fixture = TestBed.createComponent(PostsStatisticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
