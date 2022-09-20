import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { User } from '../shared/user.class';

import {ToastController} from '@ionic/angular';
import { LoadingController } from '@ionic/angular';

import { Plugins } from '@capacitor/core';
const {SplashScreen} = Plugins;

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  user: User = new User();  
  public load: boolean = true;
  public favoriteSeason = false;

  public spanPassw: boolean = false;
  public spanCorreo: boolean = false;

  constructor(
    private router:Router, 
    private authSvc: AuthService, 
    public toastController: ToastController,
    public loadingController: LoadingController) 
  {}

  ngOnInit() {
  }

  async onLogin(){
    if(this.user.email == null || this.user.email == undefined || this.user.email == ""){
      this.spanCorreo = true;
      this.ErrorLoginCamposVacios();    
    }
    if(this.user.password == null || this.user.password == undefined || this.user.password == ""){
      this.spanPassw = true;
      this.ErrorLoginCamposVacios(); 
    }
    
    if(this.user.email != undefined && this.user.password != undefined && this.user.email != "" && this.user.password != ""){
      this.load = false;

      const user = await this.authSvc.onLogin(this.user);
      if(user != undefined){
        setTimeout(() => {
          this.load = true;


          this.authSvc.logeado = {
            email: this.user.email,
            password: this.user.password
          }

          this.spanCorreo = false;
          this.spanPassw = false;
          localStorage.setItem('email',this.user.email);
          this.user = new User();  
          
          this.favoriteSeason = false;
          this.router.navigateByUrl('/menu');
        }, 500);        
      }else{
        this.load = true;
        this.ErrorLoginToast();
      }
    }
  }

  async ErrorLoginCamposVacios() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Ingrese todos los campos.',
      duration: 1100,
      color: 'warning'
    });
    toast.present();
  }

  async ErrorLoginToast() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Correo y/o Contraseña no son correctos.',
      duration: 1100,
      color: 'danger'
    });
    toast.present();
  }

  async SpinnerLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-custom-class',
      spinner: 'crescent',
      duration: 500,
    });
    await loading.present();

    const { role, data } = await loading.onDidDismiss();    
  }

  private setInputEmailPassword(){
    document.getElementById("email").setAttribute('value',this.user.email);
    document.getElementById("password").setAttribute('value',this.user.password); 
  }

  private autoLogin(userAuto: number)
  {
    switch(userAuto){
      case 1:      
        this.user.email = "usuario@usuario.com";
        this.user.password = "333333";  
        this.setInputEmailPassword();       
      break;

      case 2:
        this.user.email = "invitado@invitado.com";
        this.user.password = "222222";
        this.setInputEmailPassword();   
      break;

      case 3:
        this.user.email = "admin@admin.com";
        this.user.password = "111111";
        this.setInputEmailPassword();   
      break;
    }
    //this.onLogin();
  }
}
