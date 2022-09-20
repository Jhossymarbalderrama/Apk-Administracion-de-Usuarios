import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../services/auth.service';
import { PhotoService } from '../services/photo.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  public administrador: boolean = true;
  public titulo:string;
  public load: boolean = true;

  private titulo_alta: string = "Alta de Usuarios";
  private titulo_lista: string = "Lista Usuarios";

  public esAdmin:string;
  public menu: boolean = false;
  public alta: boolean = true;
  public lista: boolean = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    public authService: AuthService,
    public photoService: PhotoService
  ) {    
    this.verificarUsuario();
  }

  ngOnInit() {
  }

  verificarUsuario(){
    //this.esAdmin = localStorage.getItem('email');
    this.esAdmin = this.authService.logeado.email;    

    switch (this.esAdmin) {
      case "admin@admin.com":
        this.menu = true;      
        this.alta = true;
        this.lista = false;

        this.onRedirect('listaUsuarios');              
        break;
      default:
        this.menu = false; 
        this.onRedirect('listaUsuarios');        
        break;
    }
  }

  onRedirect(redirect: string){
    switch (redirect) {
      case 'listaUsuarios':
        this.administrador = false;

        this.lista = false;
        this.alta = true;
        this.titulo = this.titulo_lista;
        break;
      case 'altaUsuarios':
        this.administrador = true;
        this.photoService.pathFoto = "";

        this.alta = false;
        this.lista = true;
        this.titulo = this.titulo_alta;
       
        break;
      case 'desloguear':
        this.load = false;

        setTimeout(() => {
          this.load = true;
          this.menu = false; 
          localStorage.removeItem('email');
          this.afAuth.signOut();
          this.router.navigateByUrl('/login');  
        }, 1000);
        break;      
    }
  }  
}
