import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaSaidasComponent } from './tabela-produto.component'; 

describe('TabelaProdutoComponent', () => {
  let component: TabelaSaidasComponent;
  let fixture: ComponentFixture<TabelaSaidasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaSaidasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelaSaidasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
