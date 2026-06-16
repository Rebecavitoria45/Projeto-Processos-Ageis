import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalKitDetalhesComponent } from './modal-kit-detalhe.component';

describe('ModalKitDetalhesComponent', () => {
  let component: ModalKitDetalhesComponent;
  let fixture: ComponentFixture<ModalKitDetalhesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalKitDetalhesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalKitDetalhesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
