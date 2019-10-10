import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms'
import { HttpClientModule } from '@angular/common/http'

import { ParticlesModule } from 'angular-particle'

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
const config: SocketIoConfig = { url: 'http://'+localStorage.getItem("SERVER_PATH"), options: {} };

//192.168.8.102:9091

import { AppComponent } from './app.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { MenuComponent } from './components/menu/menu.component';
import { MenuCreateGameComponent } from './components/menu-create-game/menu-create-game.component';
import { MenuJoinGameComponent } from './components/menu-join-game/menu-join-game.component';
import { MenuManageAccountComponent } from './components/menu-manage-account/menu-manage-account.component';
import { GamePlayComponent } from './components/game-play/game-play.component';
import { MenuMyStatisticsComponent } from './components/menu-my-statistics/menu-my-statistics.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { GamePlayWaitComponent } from './components/game-play-wait/game-play-wait.component';
import { ServerErrorComponent } from './components/server-error/server-error.component';

const appRoutes: Routes = [
  { path: 'landing', component: LandingPageComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'game-play', component: GamePlayComponent },
  { path: 'service-error', component: ServerErrorComponent },
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent },
]

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    MenuComponent,
    MenuCreateGameComponent,
    MenuJoinGameComponent,
    MenuManageAccountComponent,
    GamePlayComponent,
    MenuMyStatisticsComponent,
    NotFoundComponent,
    GamePlayWaitComponent,
    ServerErrorComponent,
  ],
  imports: [
    BrowserModule,
    ParticlesModule,
    FormsModule,
    RouterModule.forRoot(appRoutes),
    HttpClientModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
