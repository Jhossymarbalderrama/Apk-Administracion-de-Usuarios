import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AltaUsuariosPageRoutingModule } from './alta-usuarios-routing.module';

import { AltaUsuariosPage } from './alta-usuarios.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AltaUsuariosPageRoutingModule
  ],
  declarations: [AltaUsuariosPage]
})
export class AltaUsuariosPageModule {}
