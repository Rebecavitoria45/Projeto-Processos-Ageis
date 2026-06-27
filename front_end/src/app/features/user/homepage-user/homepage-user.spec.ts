import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomepageMunicipioComponent } from './homepage-user';

describe('HomepageUser', () => {
  let component: HomepageMunicipioComponent;
  let fixture: ComponentFixture<HomepageMunicipioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomepageMunicipioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomepageMunicipioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
