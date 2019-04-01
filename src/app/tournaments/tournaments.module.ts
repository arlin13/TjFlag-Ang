import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TournamentCreateComponent } from './tournament-create/tournament-create.component';
import { TournamentListComponent } from './tournament-list/tournament-list.component';
import { TournamentDetailComponent } from './tournament-detail/tournament-detail.component';
import { AngularMaterialModule } from '../angular-material.module';

@NgModule({
  declarations: [
    TournamentCreateComponent,
    TournamentListComponent,
    TournamentDetailComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class TournamentModule {}
