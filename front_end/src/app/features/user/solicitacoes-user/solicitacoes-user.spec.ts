import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolicitacoesUser } from './solicitacoes-user';

describe('SolicitacoesUser', () => {
  let component: SolicitacoesUser;
  let fixture: ComponentFixture<SolicitacoesUser>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolicitacoesUser]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SolicitacoesUser);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
