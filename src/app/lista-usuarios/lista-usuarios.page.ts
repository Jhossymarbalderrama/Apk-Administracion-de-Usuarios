import { Component, OnInit } from '@angular/core';
import { timeStamp } from 'console';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.page.html',
  styleUrls: ['./lista-usuarios.page.scss'],
})
export class ListaUsuariosPage implements OnInit {

  public listaUsuarios: any = [];

  public load: boolean = true; //bakcdrop y spinner

  constructor(public fireStore: FirestoreService, public auth: AuthService) 
  {
    this.fireStore.traerListaUsuarios().subscribe(value =>{
      this.listaUsuarios = value;
      this.listaUsuarios.sort(this.ordenamiento);      
    });    
  }


  ordenamiento(a: any, b:any){
    if (a.apellidos > b.apellidos) {
      return 1;
    }
    if (a.apellidos < b.apellidos) {
      return -1;
    }

    return 0;
  }

  ngOnInit() {
    setTimeout(() => {
      this.load = false;
    }, 1000);
  }

}
