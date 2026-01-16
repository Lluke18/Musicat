import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Friendship } from './friendship';

describe('Friendship', () => {
  let component: Friendship;
  let fixture: ComponentFixture<Friendship>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Friendship]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Friendship);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
