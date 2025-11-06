import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioReservacionEstudianteComponent } from './formulario-reservacion-estudiante';

describe('FormularioReservacionEstudiante', () => {
  let component: FormularioReservacionEstudianteComponent;
  let fixture: ComponentFixture<FormularioReservacionEstudianteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioReservacionEstudianteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioReservacionEstudianteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
