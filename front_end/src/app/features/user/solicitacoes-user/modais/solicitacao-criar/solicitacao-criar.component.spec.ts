import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacaoCriarModalComponent } from './solicitacao-criar.component'; 

describe('SolicitacaoCriarModalComponent', () => {
  let component: SolicitacaoCriarModalComponent;
  let fixture: ComponentFixture<SolicitacaoCriarModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitacaoCriarModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacaoCriarModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
