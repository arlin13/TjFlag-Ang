import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TeamCreateComponent } from './team-create/team-create.component';
import { TeamListComponent } from './team-list/team-list.component';
import { AngularMaterialModule } from '../angular-material.module';
import { TeamDetailComponent } from './team-detail/team-detail.component';

@NgModule({
  declarations: [TeamCreateComponent, TeamListComponent, TeamDetailComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    RouterModule
  ]
})
export class TeamModule {}
