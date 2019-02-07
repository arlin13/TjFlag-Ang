import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { PostListComponent } from './posts/post-list/post-list.component';
import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PlayerListComponent } from './players/player-list/player-list.component';
import { PlayerCreateComponent } from './players/player-create/player-create.component';
import { HomeComponent } from './home/home.component';
import { TeamListComponent } from './teams/team-list/team-list.component';
import { TeamCreateComponent } from './teams/team-create/team-create.component';
import { TeamDetailComponent } from './teams/team-detail/team-detail.component';
import { CourtListComponent } from './courts/court-list/court-list.component';
import { CourtCreateComponent } from './courts/court-create/court-create.component';
import { CourtDetailComponent } from './courts/court-detail/court-detail.component';
import { PlayerDetailComponent } from './players/player-detail/player-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'auth', loadChildren: './auth/auth.module#AuthModule' },
  { path: 'create', component: PostCreateComponent, canActivate: [AuthGuard] },
  {
    path: 'edit/:postId',
    component: PostCreateComponent,
    canActivate: [AuthGuard]
  },
  { path: 'players', component: PlayerListComponent },
  {
    path: 'players/create',
    component: PlayerCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'players/edit/:playerId',
    component: PlayerCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'players/detail/:playerId',
    component: PlayerDetailComponent
  },
  { path: 'teams', component: TeamListComponent },
  {
    path: 'teams/create',
    component: TeamCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'teams/edit/:teamId',
    component: TeamCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'teams/detail/:teamId',
    component: TeamDetailComponent
  },
  { path: 'courts', component: CourtListComponent },
  {
    path: 'courts/create',
    component: CourtCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'courts/edit/:courtId',
    component: CourtCreateComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'courts/detail/:courtId',
    component: CourtDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
