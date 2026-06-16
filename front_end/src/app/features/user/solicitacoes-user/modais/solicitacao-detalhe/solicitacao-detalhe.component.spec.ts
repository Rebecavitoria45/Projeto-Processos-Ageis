import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacaoDetalhesModalComponent } from './solicitacao-detalhe.component';

describe('SolicitacaoDetalhesModalComponent', () => {
  let component: SolicitacaoDetalhesModalComponent;
  let fixture: ComponentFixture<SolicitacaoDetalhesModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitacaoDetalhesModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacaoDetalhesModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
