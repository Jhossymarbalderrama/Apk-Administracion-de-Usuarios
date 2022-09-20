import { Component, OnInit } from '@angular/core';
import {ToastController} from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { FirestoreService } from '../services/firestore.service';

import { ScannerService } from '../services/scanner.service';
import { PhotoService } from '../services/photo.service';
import { Router } from '@angular/router';
import {MenuPage} from '../menu/menu.page';

@Component({
  selector: 'app-alta-usuarios',
  templateUrl: './alta-usuarios.page.html',
  styleUrls: ['./alta-usuarios.page.scss'],
})


export class AltaUsuariosPage implements OnInit {

  //Objeto a dar de Alta si esta todo OK!
  public datos: any = {
    apellidos: "",
    clave: "",
    correo: "",
    dni: 0,
    nombres: "",
    pathFoto: ""
  }

  //Spinner
  public load: boolean = false;

  //Datos Formulario
  public apellidos: string;
  public nombres: string;
  public dni: number;
  public correo: string;
  public clave: string;
  public reingresoClave:string;

  public fotoSacada: boolean = false;
  public pathFoto: any;

  constructor(
    public toastController: ToastController,
    public FirestoreService: FirestoreService,
    public scanner: ScannerService,
    public photoService: PhotoService,
    private router:Router,
    private menu :MenuPage
  )
  { 
    this.fotoSacada = false;
  }

  ngOnInit() {  
        
  }

  async ErrorToastApellidos() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Ingrese Apellidos',
      duration: 1100,
      color: 'danger'
    });
    toast.present();
  }

  async ErrorToastNombres() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Ingrese Nombres',
      duration: 1100,
      color: 'danger'
    });
    toast.present();
  }

  async ErrorToastDNI() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Ingrese DNI',
      duration: 1100,
      color: 'danger'
    });
    toast.present();
  }

  async ErrorToastDNIRango() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'DNI Invalido',
      duration: 1100,
      color: 'danger'
    });
    toast.present();
  }

  async ErrorToastCorreo() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Ingrese Correo',
      duration: 1100,
      color: 'danger'
    });
    toast.present();
  }

  async ErrorToastCorreoInvalido() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Correo Invalido',
      duration: 1100,
      color: 'danger'
    });
    toast.present();
  }

  async ErrorToastClave() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Ingrese Clave',
      duration: 1100,
      color: 'danger'
    });
    toast.present();
  }

  async ErrorToastReingreseClave() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Reigrese la Clave',
      duration: 1100,
      color: 'danger'
    });
    toast.present();
  }

  async ErrorToastDatosVacios() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Datos Incorrectos',
      duration: 1100,
      color: 'danger'
    });
    toast.present();
  }
  
  async SuccessToastDato() {
    const toast = await this.toastController.create({
      position: 'top',
      message: 'Usuario dado de Alta!!!',
      duration: 1100,
      color: 'success'
    });
    toast.present();
  }

  onRedirect(redirectTo: string){
    switch (redirectTo) {
      case 'listaUsuarios':        
        break;
    }
  }

  onAgregarUsuario(){
    let validar:boolean = true;    

      //Valido Reigreso Clave
      if(this.reingresoClave == null || this.reingresoClave == undefined || this.reingresoClave == ""){             
        this.ErrorToastReingreseClave();            
        validar = false;
      }else{
        if(this.reingresoClave != this.clave){      
          this.ErrorToastReingreseClave();     
          validar = false;     
        }
      }

      //Valido Clave
      if(this.clave == null || this.clave == undefined || this.clave == ""){     
        this.ErrorToastClave();
        validar = false;
      }

      //Valido Correo
      if(this.correo == null || this.correo == undefined || this.correo == ""){     
        this.ErrorToastCorreo();
        validar = false;
      }else{
        if(!this.validarCorreo(this.correo)){
            this.ErrorToastCorreoInvalido();
            validar = false;
        }
      }
    
      //Valido DNI
        if(this.dni == null || this.dni == undefined){      
          this.ErrorToastDNI();
          validar = false;
        }else{
          let dniString =  this.dni.toString();
          if(dniString.length > 8){
            this.ErrorToastDNIRango();
            validar = false;
          }
        }

      

      //Valido Nombre
      if(this.nombres == null || this.nombres == undefined || this.nombres == ""){     
        this.ErrorToastNombres();
        validar = false;
      }

      //Valido Apellido
      if(this.apellidos == null || this.apellidos == undefined || this.apellidos == ""){     
        this.ErrorToastApellidos();
        validar = false;
      }
    
      //Si es true validar Doy de alta al Usuario Nuevo
      if(validar){
        
        
        this.datos.apellidos = this.apellidos;
        this.datos.clave = this.clave;
        this.datos.correo = this.correo;
        this.datos.dni = this.dni;
        this.datos.nombres = this.nombres;
        this.datos.pathFoto = this.photoService.pathFoto;

        //console.log(this.datos);

        //Creo el nuevo Usuario en la BD
        this.FirestoreService.crearUsuario(this.datos);
        
        this.photoService.pathFoto = "";
        
        this.load = true;
        setTimeout(() => {     
          this.load = false;

          this.SuccessToastDato(); 
          this.menu.onRedirect('listaUsuarios');
        }, 1000);
            
      }
  }  

  validarCorreo(correo: string) {
    let esCorreo: boolean = false;

    let emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;

    if (emailRegex.test(correo)) {
      esCorreo = true;
    }

    return esCorreo;
  }



  onScannerDNI(){
    this.scanner.startScanner().then((datosDNI)=>{
      this.scanner.stopScan();       
      let datosDNIqr = datosDNI.split("@",);  

      //LLeno los datos del qr en el Formulario

      /*
        datosDNI[->]:
        0: Nro Tramite
        1: Apellido
        2: Nombre
        3: Sexo (M/F)
        4: DNI
        5: Ejemplas(A)
        6: Fecha Nacimiento
        7: Fecha de Emision
        8: Ni idea jajaja
      */

      document.getElementById("apellidos").setAttribute('value',datosDNIqr[1].toLowerCase());
      document.getElementById("nombres").setAttribute('value',datosDNIqr[2].toLowerCase()); 
      document.getElementById("dni").setAttribute('value',datosDNIqr[4]); 
    });
  }

  onSubirFoto(){    
    this.photoService.addNewToGallery();

    this.pathFoto = this.photoService.pathFoto;
    this.fotoSacada= true;
  }

}
