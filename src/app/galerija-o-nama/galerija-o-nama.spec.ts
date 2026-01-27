import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalerijaONama } from './galerija-o-nama';

describe('GalerijaONama', () => {
  let component: GalerijaONama;
  let fixture: ComponentFixture<GalerijaONama>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalerijaONama]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalerijaONama);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
