import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { GlobalProvider } from '../../providers/global/global';
import { DatabaseProvider } from '../../providers/database/database';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  formulario: { email: string, password: string };
  loading: any;
  observable: any;

  constructor(public navCtrl: NavController, public fireAuth: AngularFireAuth, public toastCtrl: ToastController,
    public global: GlobalProvider, public database: DatabaseProvider, public loadingCtrl: LoadingController) {
    this.formulario = { email: '', password: '' };
  }

  ionViewDidLoad() {
  }

  /* LOGIN FIREBASE */
  login() {
    this.loading = this.loadingCtrl.create({
      content: 'Cargando'
    });
    this.loading.present().then(() => {
      this.fireAuth.auth.signInWithEmailAndPassword(this.formulario.email, this.formulario.password)
        .then(resultado => {
          this.observable = Observable.combineLatest(this.database.preguntas(), this.database.recomendaciones(),
            this.database.usuarioRegistradoBD(resultado.uid), this.database.encuestasUltimas(resultado.uid)).subscribe(resultados => {
              this.global.questions = resultados[0];
              this.global.recommendations = resultados[1];
              if (resultados[2] == null) {
                this.navCtrl.setRoot('RegistroPage', { idUsuario: resultado.uid, email: this.formulario.email, password: this.formulario.password });
                this.loading.dismiss();
              } else {
                this.global.usuario = resultados[2];
                this.global.resultadoPreguntas = this.global.usuario.ultimaencuesta;
                for (let resultadoPreguntas of resultados[3]) {
                  var encuesta: any = resultadoPreguntas;
                  this.global.resultadosPreguntas.push(encuesta.encuesta);
                }
                this.navCtrl.setRoot('TabGeneralPage');
                this.loading.dismiss();
              }
            });
        })
        .catch(error => {
          var mensaje: string = '';
          error.code == 'auth/user-not-found' || error.code == 'auth/invalid-email' ? mensaje = 'Usuario no válido' : mensaje = 'Contraseña no válida';
          this.loading.dismiss();
          this.toast(mensaje);
        });
    });
  }
  /* FIN LOGIN FIREBASE */

  /* TOAST MENSAJE LOGIN ERROR */
  toast(mensaje: string) {
    let toastMensaje = this.toastCtrl.create({
      message: mensaje,
      duration: 2500,
      position: 'bottom',
      dismissOnPageChange: true
    });
    toastMensaje.present();
  }
  /* FIN TOAST MENSAJE LOGIN ERROR */

  ionViewWillUnload() {
    this.observable.unsubscribe();
  }

}
