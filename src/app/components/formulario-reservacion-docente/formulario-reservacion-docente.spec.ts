import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioReservacionDocente } from './formulario-reservacion-docente';

describe('FormularioReservacionDocente', () => {
  let component: FormularioReservacionDocente;
  let fixture: ComponentFixture<FormularioReservacionDocente>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioReservacionDocente]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioReservacionDocente);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
