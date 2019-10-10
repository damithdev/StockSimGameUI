import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GamePlayWaitComponent } from './game-play-wait.component';

describe('GamePlayWaitComponent', () => {
  let component: GamePlayWaitComponent;
  let fixture: ComponentFixture<GamePlayWaitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamePlayWaitComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamePlayWaitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
