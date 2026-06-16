import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalSolicitacaoAdminComponent } from './modal-solicitacao.component';

describe('ModalSolicitacaoAdminComponent', () => {
  let component: ModalSolicitacaoAdminComponent;
  let fixture: ComponentFixture<ModalSolicitacaoAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalSolicitacaoAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalSolicitacaoAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
