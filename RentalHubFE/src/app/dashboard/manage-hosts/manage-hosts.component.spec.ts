import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageHostsComponent } from './manage-hosts.component';

describe('ManageHostsComponent', () => {
  let component: ManageHostsComponent;
  let fixture: ComponentFixture<ManageHostsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ManageHostsComponent]
    });
    fixture = TestBed.createComponent(ManageHostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
