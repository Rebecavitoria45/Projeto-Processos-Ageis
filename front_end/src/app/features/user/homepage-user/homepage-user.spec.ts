import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageUser } from './homepage-user';

describe('HomepageUser', () => {
  let component: HomepageUser;
  let fixture: ComponentFixture<HomepageUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
