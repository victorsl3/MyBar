import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
import { Chart } from 'chart.js';
import { GlobalProvider } from '../../providers/global/global';

@IonicPage()
@Component({
  selector: 'page-dashboard',
  templateUrl: 'dashboard.html',
})
export class DashboardPage {

  @ViewChild('graficaBurnout') graficaBurnout;
  graficaBurnoutChart: Chart;

  @ViewChild('graficaAE') graficaAE;
  graficaAEChart: Chart;
  @ViewChild('graficaD') graficaD;
  graficaDChart: Chart;
  @ViewChild('graficaRP') graficaRP;
  graficaRPChart: Chart;

  resultadoPreguntas: { ae: number, d: number, rp: number, q: string };
  indice: number;

  porcentajeBurnout: number;
  porcentajeAE: number;
  porcentajeD: number;
  porcentajeRP: number;

  detalles: boolean;

  constructor(public navCtrl: NavController, public global: GlobalProvider) {
    this.porcentajeBurnout = 0;
    this.detalles = false;
    this.indice = 0;
    this.resultadoPreguntas = this.global.resultadoPreguntas;
  }

  ionViewDidLoad() {
    this.calcularDatosGraficas();
    this.graficas();
  }

  ionViewWillEnter() {
    this.detalles = false;
    this.indice = 0;
    this.resultadoPreguntas = this.global.resultadoPreguntas;
    this.actualizarGraficas();
  }

  /* CALCULAR DATOS GRAFICAS */
  calcularDatosGraficas() {
    if (this.resultadoPreguntas.ae > 26 && this.resultadoPreguntas.d > 9 && this.resultadoPreguntas.rp < 34) {
      this.porcentajeBurnout = Math.round(
        ((this.resultadoPreguntas.ae + this.resultadoPreguntas.d - this.resultadoPreguntas.rp) * 100) / 84
      );
    } else {
      this.porcentajeBurnout = 0;
    }
    this.porcentajeAE = Math.round((this.resultadoPreguntas.ae * 100) / 54);
    this.porcentajeD = Math.round((this.resultadoPreguntas.d * 100) / 30);
    this.porcentajeRP = Math.round((this.resultadoPreguntas.rp * 100) / 48);
  }
  /* FIN CALCULAR DATOS GRAFICAS */

  /* GRAFICAS */
  graficas() {
    this.graficaBurnoutChart = new Chart(this.graficaBurnout.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.porcentajeBurnout, 100 - this.porcentajeBurnout],
          backgroundColor: [
            '#DE3831',
            '#D7D8DC'
          ]
        }],
      },
      options: {
        cutoutPercentage: 90,
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        tooltips: { enabled: false },
        hover: { mode: null },
      }
    });
    this.graficaAEChart = new Chart(this.graficaAE.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.porcentajeAE, 100 - this.porcentajeAE],
          backgroundColor: [
            '#DE3831',
            '#D7D8DC'
          ]
        }],
      },
      options: {
        cutoutPercentage: 86,
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        tooltips: { enabled: false },
        hover: { mode: null },
      }
    });
    this.graficaDChart = new Chart(this.graficaD.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.porcentajeD, 100 - this.porcentajeD],
          backgroundColor: [
            '#DE3831',
            '#D7D8DC'
          ]
        }],
      },
      options: {
        cutoutPercentage: 86,
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        tooltips: { enabled: false },
        hover: { mode: null },
      }
    });
    this.graficaRPChart = new Chart(this.graficaRP.nativeElement, {
      type: 'doughnut',
      data: {
        datasets: [{
          data: [this.porcentajeRP, 100 - this.porcentajeRP],
          backgroundColor: [
            '#DE3831',
            '#D7D8DC'
          ]
        }],
      },
      options: {
        cutoutPercentage: 86,
        elements: {
          arc: {
            borderWidth: 0
          }
        },
        tooltips: { enabled: false },
        hover: { mode: null },
      }
    });
  }
  /* FIN GRAFICAS */

  /* ACTUALIZAR GRAFICAS */
  actualizarGraficas() {
    this.calcularDatosGraficas();
    this.graficaBurnoutChart.data.datasets[0].data[0] = this.porcentajeBurnout;
    this.graficaBurnoutChart.data.datasets[0].data[1] = 100 - this.porcentajeBurnout;
    this.graficaBurnoutChart.update();
    this.graficaAEChart.data.datasets[0].data[0] = this.porcentajeAE;
    this.graficaAEChart.data.datasets[0].data[1] = 100 - this.porcentajeAE;
    this.graficaAEChart.update();
    this.graficaDChart.data.datasets[0].data[0] = this.porcentajeD;
    this.graficaDChart.data.datasets[0].data[1] = 100 - this.porcentajeD;
    this.graficaDChart.update();
    this.graficaRPChart.data.datasets[0].data[0] = this.porcentajeRP;
    this.graficaRPChart.data.datasets[0].data[1] = 100 - this.porcentajeRP;
    this.graficaRPChart.update();
  }
  /* ACTUALIZAR GRAFICAS */

  /* ATRAS */
  atras() {
    if (this.indice < this.global.resultadosPreguntas.length - 1) {
      this.indice++;
      this.resultadoPreguntas = this.global.resultadosPreguntas[(this.global.resultadosPreguntas.length - 1) - this.indice];
      this.actualizarGraficas();
    }
  }
  /* FIN ATRAS */

  /* SIGUIENTE */
  siguiente() {
    if (this.indice > 0) {
      this.indice--;
      this.resultadoPreguntas = this.global.resultadosPreguntas[(this.global.resultadosPreguntas.length - 1) - this.indice];
      this.actualizarGraficas();
    }
  }
  /* FIN SIGUIENTE */

}
