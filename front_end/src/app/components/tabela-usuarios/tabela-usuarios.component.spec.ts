import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabelaMunicipiosComponent } from './tabela-usuarios.component';

describe('TabelaMunicipiosComponent', () => {
  let component: TabelaMunicipiosComponent;
  let fixture: ComponentFixture<TabelaMunicipiosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabelaMunicipiosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabelaMunicipiosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
