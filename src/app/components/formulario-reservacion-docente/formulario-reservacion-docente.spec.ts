import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioReservacionDocenteComponent } from './formulario-reservacion-docente';

describe('FormularioReservacionDocente', () => {
  let component: FormularioReservacionDocenteComponent;
  let fixture: ComponentFixture<FormularioReservacionDocenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioReservacionDocenteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioReservacionDocenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
