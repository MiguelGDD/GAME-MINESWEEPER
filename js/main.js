

var COLUMNAS 			= 10;
var RENGLONES 			= 10;
var TODAS 				= COLUMNAS * RENGLONES;
var MINAS 				= COLUMNAS * 2;
var VECINOS				= 8;

/*
   Los vecinos son el el numero de celdas que rodean una celda un ejemplo
   0 0 0
   0 1 0
   0 0 0

   El 1 vendria siendo una celda y los 0 las celdas que lo rodean
*/
var MATRIZ_RENGLON = 20;
var MATRIZ_COLUMNA = 320;
var ANCHO_CUADRO = 40;
var numeroMinas = 0;
var minasEncontradas = 0;
var minasMarcadas = 0;
var CUBIERTO = 0;
var DESCUBIERTO = 1;
var MARCA_MINA = 2;
var BOMBA = 9;
var OK = 14;
var celdas_array = new Array();
var colorTecla = "#D1D1D1";
var colorMargen = "#7C99AC";
var colorVoltea = "#1C658C";
var banderaMarca;

function Celda(ren, col, x, y, w, h, i, minas, estado){
	this.ren = ren;
	this.col = col;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
	this.i = i;
	this.minas = minas;
	this.estado = estado;
	this.dibuja = dibujaCelda;
	this.voltea = volteaCelda;
	this.marca = marcaCelda;
}
function Bandera(){
	this.x = 610;
	this.y = 445;
	this.w = 280;
	this.h = 30;
	this.estado = false;	
}
function dibujaCelda(){
	ctx.fillStyle = colorTecla;
	ctx.strokeStyle = colorMargen;
	ctx.fillRect(this.x, this.y, this.w, this.h);
	ctx.strokeRect(this.x, this.y, this.w, this.h);
}
function marcaCelda(){
	ctx.save();
	ctx.fillStyle = colorTecla;
	ctx.strokeStyle = colorMargen;
	ctx.fillRect(this.x, this.y, this.w, this.h);
	ctx.strokeRect(this.x, this.y, this.w, this.h);
	ctx.fillStyle = "red";
	ctx.font = "bold 20px Courier";
	if(this.estado==0){
		ctx.fillText("?", this.x+this.w/2-5, this.y+this.h/2+5);
		this.estado = MARCA_MINA;
		minasMarcadas++;
		MINAS--;
		if(MINAS == 0) {
			findelJuego();
		}
	} else if(this.estado==MARCA_MINAS){
		ctx.fillText("", this.x+this.w/2-5, this.y+this.h/2+5);
		this.estado = CUBIERTO;;
		minasMarcadas--;
		MINAS++;
	}
	ctx.restore();
	marcador();
}
function volteaCelda(){
	ctx.save();
	ctx.fillStyle = colorVoltea;
	ctx.strokeStyle = colorMargen;
	ctx.fillRect(this.x, this.y, this.w, this.h);
	ctx.strokeRect(this.x, this.y, this.w, this.h);
	//
	ctx.fillStyle = "#7C99AC";
	ctx.font = "bold 20px Courier";
	if(this.minas==BOMBA){
		ctx.fillText("*", this.x+this.w/2-5, this.y+this.h/2+5);
	} else if(this.minas==0){
		ctx.fillText(" ", this.x+this.w/2-5, this.y+this.h/2+5);
	} else if(this.minas==OK){
		ctx.fillText("OK", this.x+this.w/2-6, this.y+this.h/2+5);
	} else {
		ctx.fillText(this.minas, this.x+this.w/2-5, this.y+this.h/2+5);
	}
}
function marcador(){
	ctx.clearRect(50, 440, 850, 40);
	ctx.strokeStyle = colorMargen;
	ctx.strokeRect(50, 440, 850, 40);
	ctx.fillStyle = "black";
	ctx.font = "bold 20px Courier";
	ctx.fillText("MINAS", 80, 465);
	ctx.fillText("MARCADAS", 240, 465);
	ctx.fillText("ENCONTRADAS", 420, 465);
	ctx.fillStyle = "#1C658C";
	ctx.font = "bold 20px Courier";
	ctx.fillText(MINAS, 160, 465);
	ctx.fillText(minasMarcadas, 350, 465);
	ctx.fillText(minasEncontradas, 570, 465);
	estadoBandera()
	ctx.fillStyle = "black";
}
function estadoBandera(){
	ctx.save();
	ctx.clearRect(banderaMarca.x, banderaMarca.y, banderaMarca.w, banderaMarca.h);
	if(banderaMarca.estado){
		ctx.fillStyle = "white";
		ctx.fillText("BANDERA MARCA", 640, 465);
		ctx.fillStyle = "#DA1212";	
		ctx.fillText(banderaMarca.estado, 810, 465);
	} else {
		ctx.fillStyle = "black";
		ctx.fillText("BANDERA MARCA", 640, 465);
		ctx.fillStyle = "#1C658C";	
		ctx.fillText(banderaMarca.estado, 810, 465);
	}
	ctx.restore();
}
function tablero(){
	banderaMarca = new Bandera();
	MATRIZ_COLUMNA = (canvas.width - (COLUMNAS*ANCHO_CUADRO))/2
	for (i=0; i<RENGLONES; i++) {	
		for (j=0; j<COLUMNAS; j++) {
			ii = j + i * COLUMNAS;	
			x = MATRIZ_COLUMNA + j * ANCHO_CUADRO;	
			y = MATRIZ_RENGLON + i * ANCHO_CUADRO;	
			var celda = new Celda(i, j, x, y, ANCHO_CUADRO, ANCHO_CUADRO, ii, 0, 0);
			celdas_array.push(celda);
			celda.dibuja();
		}
	}
}
function ajusta(xx, yy){
	var posCanvas = canvas.getBoundingClientRect();
	var x = xx - posCanvas.left;
	var y = yy - posCanvas.top;
	return {x:x, y:y}
	
}
function selecciona(e){
	var pos = ajusta(e.clientX, e.clientY);	
	var x = pos.x;
	var y = pos.y;
	var celda;
	//
	for(var i=0; i<celdas_array.length; i++){
		celda = celdas_array[i];
		if(celda.x > 0){
			if((x > celda.x)&&(x < celda.x + celda.w)&&(y > celda.y)&&(y< celda.y + celda.h)){
				break;	
			}
		}
	}
	if(i<celdas_array.length){
		if(banderaMarca.estado){
			celda.marca();
		} else {
			celda.voltea();
			if(celda.minas==BOMBA){
				findelJuego()
			} else if(celda.estado==CUBIERTO){
				buscaBlanco(i);
			}
		}
	} else if((x > banderaMarca.x)&&(x < banderaMarca.x + banderaMarca.w)&&(y > banderaMarca.y)&&(y< banderaMarca.y + banderaMarca.h)){
		banderaMarca.estado = !banderaMarca.estado;
		estadoBandera();	
	}
}

function generaMinas(){
	var celda;
	do{
		i = Math.floor(Math.random()*celdas_array.length);						
		celda = celdas_array[i];
		if(celda.minas != BOMBA){
			celda.minas = BOMBA;
			console.log(celda.ren+", "+celda.col+": "+celda.minas);
			numeroMinas++;
		}
	}while(numeroMinas<MINAS)
}

function calculaVecinos(){
	var celda;
	for(i=0;i<celdas_array.length;i++){
		celda = celdas_array[i];
		console.log("Minas antes "+celda.minas);
		if(celda.minas!=BOMBA){	
			for(j=0;j<VECINOS;j++){			
				celda.minas += verificaVecino(i,j);		
			}
		}
		console.log("Minas despues "+celda.minas);
	}	
}

function verificaVecino(indice, vecino){
	console.log("Verifica vecino de la celda "+indice+" vecino "+vecino+" ");
	var SALIDA = 0;
	var iVecino = indiceVecino(indice, vecino);			
	var celda;
	if(iVecino>0){
		var celda = celdas_array[iVecino];
		if(celda.minas==BOMBA){	
			SALIDA = 1;
		}
	}
	console.log("cuadro "+SALIDA);
	return SALIDA
}

function indiceVecino(numCelda, numVecino){
	var renglonVecino = celdas_array[numCelda].ren;		
	var columnaVecino = celdas_array[numCelda].col;	
	if(numVecino==0){								
		renglonVecino--;							
		columnaVecino--;
	} else if(numVecino==1){
		renglonVecino--;
	} else if(numVecino==2){
		renglonVecino--;
		columnaVecino++;
	} else if(numVecino==3){
		columnaVecino++;
	} else if(numVecino==4){
		renglonVecino++;
		columnaVecino++;
	} else if(numVecino==5){
		renglonVecino++;
	} else if(numVecino==6){
		renglonVecino++;
		columnaVecino--;
	} else if(numVecino==7){
		columnaVecino--;
	}
	if(columnaVecino < 0 || columnaVecino == COLUMNAS){
		return -1;								
	}
	if(renglonVecino < 0 || renglonVecino == RENGLONES){
		return -1;
	}
	return columnaVecino + renglonVecino * COLUMNAS;
}

function buscaBlanco(numCelda){
	console.log("Entro a buscaBlanco "+numCelda);
	for(var i=0; i<VECINOS; i++){	
		iVecino = indiceVecino(numCelda, i);
		if(iVecino>-1){	
			columnaVecino = celdas_array[iVecino].col;	
			renglonVecino = celdas_array[iVecino].ren;	
			celda = celdas_array[iVecino];
			console.log("Minas en el cuadro "+iVecino+": "+celda.minas+" "+celda.ren+" "+celda.col);
			if(celda.minas==0){							
				console.log("Estado en el cuadro "+iVecino+": "+celda.estado);
				if(celda.estado == CUBIERTO){	
					celda.voltea();	
					celda.estado = DESCUBIERTO;	
					buscaBlanco(iVecino);				
				}
			} else {
				if(celda.minas!= BOMBA && celda.estado == CUBIERTO){					
					celda.voltea();
					celda.estado = DESCUBIERTO;
				}
			}
		}
	}
	return 0
}

function findelJuego(){
	var INDICE,columnaVecino, columnaVecino, i, j, mc, myMinas
	for (i=0; i<RENGLONES; i++) {
		for (j=0; j<COLUMNAS; j++) {
			INDICE = j + i * COLUMNAS;		
			columnaVecino = celdas_array[INDICE].col;
			renglonVecino = celdas_array[INDICE].ren;
			celda = celdas_array[INDICE];
			if(celda.minas==BOMBA && celda.estado==MARCA_MINA){
				minasEncontradas++;
				celda.minas = OK;							
			}
			celda.voltea();	
			celda.estado = DESCUBIERTO;					
		}
	}

	marcador();			
}
window.onload = function(){
	canvas = document.getElementById("miCanvas");
	if(canvas && canvas.getContext){
		ctx = canvas.getContext("2d");
		if(ctx){
			tablero();
			generaMinas();
			calculaVecinos();
			marcador();
			canvas.addEventListener("click",selecciona,false);
		} else {
			alert("Error al crear tu contexto");	
		}
	}
}