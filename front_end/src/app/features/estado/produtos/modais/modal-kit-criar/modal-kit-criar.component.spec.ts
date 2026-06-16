import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalKitComponent } from './modal-kit-criar.component';

describe('ModalKitComponent', () => {
  let component: ModalKitComponent;
  let fixture: ComponentFixture<ModalKitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalKitComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalKitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
