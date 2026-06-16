import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelausuariosComponent } from './tabela-usuarios.component';

describe('TabelausuariosComponent', () => {
  let component: TabelausuariosComponent;
  let fixture: ComponentFixture<TabelausuariosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelausuariosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelausuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
