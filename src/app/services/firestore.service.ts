import { Injectable, OnInit } from '@angular/core';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService implements OnInit{

  public listaUsuariosCollectionReference: any;
  public listaUsuarios: Observable<any>;

  public listaUsuariosArray: any = [];

  constructor(public FireStore: AngularFirestore, public AngularFS : AngularFireStorage) 
  {
    this.listaUsuariosCollectionReference = this.FireStore.collection<any>('listaUsuarios');
    this.listaUsuarios = this.listaUsuariosCollectionReference.valueChanges({idField: 'id'});
  }


  ngOnInit(){
    this.traerListaUsuarios().subscribe(value=>{  
      this.listaUsuariosArray = value;
    });
  }

  traerListaUsuarios(){
    return this.listaUsuarios;
  }

  async crearUsuario(dato: any){
    return await this.FireStore.collection('listaUsuarios').add(dato);
  }
}
