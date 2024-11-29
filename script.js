    let jugadores = [];
    let tableroFichas = [];
    let turnoActual = 0;
    let todasLasFichas = [];
    const posiciones = ['abajo', 'izquierda', 'arriba', 'derecha'];
    let filaActual = null;
    let numFichasEnFila = 0;
    const MAX_FICHAS_POR_FILA = 10;
    let direccionActual = 'derecha'; // Nueva variable para controlar la dirección
    let turnosConsecutivosPasados = 0; // Lleva el conteo de turnos donde todos pasan.
let jugadoresQueHanPasado = new Set(); // Lleva registro de jugadores que han pasado.


    function crearFichas() {
      todasLasFichas = [];
      for (let i = 0; i <= 6; i++) {
        for (let j = i; j <= 6; j++) {
          todasLasFichas.push({ numero1: i, numero2: j });
        }
      }
      todasLasFichas.sort(() => Math.random() - 0.5);
    }

    function repartirFichas(numJugadores) {
      let fichasPorJugador = 7;
      jugadores = [];
      let tieneSeisSeis = false;

      // Repartir fichas iniciales
      for (let i = 0; i < numJugadores; i++) {
        let fichasJugador = todasLasFichas.splice(0, fichasPorJugador);
        if (fichasJugador.some(f => f.numero1 === 6 && f.numero2 === 6)) {
          tieneSeisSeis = true;
        }
        jugadores.push({
          id: i,
          posicion: posiciones[i],
          fichas: fichasJugador,
        });
      }

      // Permitir comer hasta encontrar el 6-6
      while (!tieneSeisSeis && todasLasFichas.length > 0) {
        for (let jugador of jugadores) {
          if (todasLasFichas.length === 0) break;
          let ficha = todasLasFichas.shift();
          jugador.fichas.push(ficha);
          if (ficha.numero1 === 6 && ficha.numero2 === 6) {
            tieneSeisSeis = true;
            break;
          }
        }
      }
    }



    function mostrarFichasJugador(jugador) {
      const contenedor = document.getElementById(`jugador-${jugador.posicion}`);
      contenedor.innerHTML = '';

      if (jugador.id === turnoActual) {
        contenedor.classList.add('turno-actual');
      } else {
        contenedor.classList.remove('turno-actual');
      }

      const titulo = document.createElement('h3');
      titulo.textContent = `Jugador ${jugador.id + 1}`;
      contenedor.appendChild(titulo);

      const fichasDiv = document.createElement('div');
      fichasDiv.className = 'fichas-jugador';

      jugador.fichas.forEach(ficha => {
        fichasDiv.appendChild(crearFichaVisual(ficha));
      });

      contenedor.appendChild(fichasDiv);
      contenedor.style.display = 'flex';
    }
    function crearFichaVisual(ficha) {
      const fichaDiv = document.createElement("div");
      fichaDiv.classList.add("ficha");
    
      if (ficha.numero1 === ficha.numero2) {
        fichaDiv.classList.add("mula");
      }
    
      const valor1 = document.createElement("div");
      valor1.className = "ficha-value";
    
      const imagen1 = document.createElement("img");
      imagen1.src = `recursos/${ficha.numero1}.png`; // Ruta a la imagen
      imagen1.alt = ficha.numero1;
      imagen1.style.width = "100%";
      imagen1.style.height = "100%";
      valor1.appendChild(imagen1);
    
      const valor2 = document.createElement("div");
      valor2.className = "ficha-value";
    
      const imagen2 = document.createElement("img");
      imagen2.src = `recursos/${ficha.numero2}.png`; // Ruta a la imagen
      imagen2.alt = ficha.numero2;
      imagen2.style.width = "100%";
      imagen2.style.height = "100%";
      valor2.appendChild(imagen2);
    
      fichaDiv.appendChild(valor1);
      fichaDiv.appendChild(valor2);
    
      return fichaDiv;
    }
    

    function crearNuevaFila() {
      filaActual = document.createElement('div');
      filaActual.className = 'fila-fichas';

      const lineaFichas = document.getElementById('linea-fichas');
      if (direccionActual === 'derecha') {
        lineaFichas.appendChild(filaActual);
      } else {
        lineaFichas.insertBefore(filaActual, lineaFichas.firstChild);
      }

      numFichasEnFila = 0;
      direccionActual = direccionActual === 'derecha' ? 'izquierda' : 'derecha';
    }

    function colocarFicha(ficha, lado) {
        // Obtén los contenedores
        const lineaFichasPrincipal = document.getElementById('linea-fichas-principal');
        const lineaFichasIzquierda = document.getElementById('linea-fichas-izquierda');
        const lineaFichasDerecha = document.getElementById('linea-fichas-derecha');
      
        const extremoIzquierdo = tableroFichas[0] ? tableroFichas[0].numero1 : null;
        const extremoDerecho = tableroFichas[tableroFichas.length - 1] ? tableroFichas[tableroFichas.length - 1].numero2 : null;
      
        const fichaDiv = crearFichaVisual(ficha);
      
        // Decide el contenedor donde se colocará la ficha
        let contenedorDestino;
      
        if (lineaFichasPrincipal.childElementCount < MAX_FICHAS_POR_FILA) {
          contenedorDestino = lineaFichasPrincipal; // Llenar el contenedor principal primero
        } else if (lado === 'izquierda') {
          contenedorDestino = lineaFichasIzquierda; // Llenar el contenedor izquierdo
        } else if (lado === 'derecha') {
          contenedorDestino = lineaFichasDerecha; // Llenar el contenedor derecho
        }
      
        // Coloca la ficha en el contenedor correspondiente
        if (lado === 'izquierda') {
          if (ficha.numero2 === extremoIzquierdo) {
            fichaDiv.style.transform = 'rotate(270deg)';
          } else if (ficha.numero1 === extremoIzquierdo) {
            fichaDiv.style.transform = 'rotate(90deg)';
            [ficha.numero1, ficha.numero2] = [ficha.numero2, ficha.numero1];
          }
          tableroFichas.unshift(ficha);
          contenedorDestino.insertBefore(fichaDiv, contenedorDestino.firstChild);
        } else if (lado === 'centro') {
          fichaDiv.style.transform = 'rotate(0deg)';
          tableroFichas.push(ficha);
          contenedorDestino.appendChild(fichaDiv);
        } else if (lado === 'derecha') {
          if (ficha.numero1 === extremoDerecho) {
            fichaDiv.style.transform = 'rotate(270deg)';
          } else if (ficha.numero2 === extremoDerecho) {
            fichaDiv.style.transform = 'rotate(90deg)';
            [ficha.numero1, ficha.numero2] = [ficha.numero2, ficha.numero1];
          }
          tableroFichas.push(ficha);
          contenedorDestino.appendChild(fichaDiv);
        }
      
        // Espaciado entre fichas
        fichaDiv.style.margin = '15px';
      }
      
      

    function ocultarJugadoresNoUsados(numJugadores) {
      posiciones.forEach((pos, index) => {
        const contenedor = document.getElementById(`jugador-${pos}`);
        if (index >= numJugadores) {
          contenedor.style.display = 'none';
        }
      });
    }

    function actualizarInterfaz() {
      jugadores.forEach(jugador => {
        mostrarFichasJugador(jugador);
      });
    }

    function buscarMulaMayor() {
      let mulaMayor = null;
      let jugadorInicial = 0;

      jugadores.forEach((jugador, index) => {
        jugador.fichas.forEach(ficha => {
          if (ficha.numero1 === ficha.numero2) {
            if (!mulaMayor || ficha.numero1 > mulaMayor.numero1) {
              mulaMayor = ficha;
              jugadorInicial = index;
            }
          }
        });
      });

      return { ficha: mulaMayor, jugador: jugadorInicial };
    }
    function determinarGanadorPorPuntos() {
        const puntosPorJugador = jugadores.map((jugador) => {
          return jugador.fichas.reduce((total, ficha) => total + ficha.numero1 + ficha.numero2, 0);
        });
      
        const minPuntos = Math.min(...puntosPorJugador);
        const ganador = puntosPorJugador.indexOf(minPuntos);
      
        alert(`¡El juego ha terminado! El Jugador ${ganador + 1} ha ganado con ${minPuntos} puntos.`);
      }

    function jugarTurno() {
        const jugadorActual = jugadores[turnoActual];
        let fichaJugada = null;
        let ladoColocacion = null;
      
        for (let i = 0; i < jugadorActual.fichas.length; i++) {
          const ficha = jugadorActual.fichas[i];
          const extremoIzquierdo = tableroFichas[0] ? tableroFichas[0].numero1 : null;
          const extremoDerecho = tableroFichas[tableroFichas.length - 1] ? tableroFichas[tableroFichas.length - 1].numero2 : null;
      
          if (tableroFichas.length === 0) {
            fichaJugada = ficha;
            ladoColocacion = 'centro';
            break;
          } else if (ficha.numero1 === extremoIzquierdo || ficha.numero2 === extremoIzquierdo) {
            fichaJugada = ficha;
            ladoColocacion = 'izquierda';
            break;
          } else if (ficha.numero1 === extremoDerecho || ficha.numero2 === extremoDerecho) {
            fichaJugada = ficha;
            ladoColocacion = 'derecha';
            break;
          }
        }
      
        if (fichaJugada) {
          jugadorActual.fichas = jugadorActual.fichas.filter(f => f !== fichaJugada);
          colocarFicha(fichaJugada, ladoColocacion);
          registrarMovimiento(turnoActual, fichaJugada, ladoColocacion);
          actualizarProbabilidades();
      
          jugadoresQueHanPasado.clear(); // Reiniciar el registro de jugadores que han pasado.
          turnosConsecutivosPasados = 0; // Reiniciar el conteo de turnos consecutivos.
      
          if (jugadorActual.fichas.length === 0) {
            setTimeout(() => {
              alert(`¡El Jugador ${turnoActual + 1} ha ganado!`);
            }, 500);
            return;
          }
        } else {
          jugadoresQueHanPasado.add(turnoActual); // Agregar jugador al registro de pases.
      
            turnosConsecutivosPasados++; // Incrementar el conteo de turnos donde todos pasan.
          
      
          if (turnosConsecutivosPasados > 1) {
            // Terminar el juego si todos pasan por segunda vez consecutiva.
            determinarGanadorPorPuntos();
            return;
          }
        }
      
        turnoActual = (turnoActual + 1) % jugadores.length;
        actualizarInterfaz();
        setTimeout(jugarTurno, 1500);
      }
      

    function iniciarJuego() {
      const numJugadores = parseInt(document.getElementById('numJugadores').value);
      if (numJugadores < 2 || numJugadores > 4) {
        alert('El número de jugadores debe estar entre 2 y 4');
        return;
      }

      document.getElementById('setup').style.display = 'none';
      document.getElementById('juego').style.display = 'block';

      crearFichas();
      repartirFichas(numJugadores);
      ocultarJugadoresNoUsados(numJugadores);
      actualizarInterfaz();

      const mulaMayor = buscarMulaMayor();
      if (mulaMayor.ficha) {
        turnoActual = mulaMayor.jugador;
        const jugadorMula = jugadores[mulaMayor.jugador];
        jugadorMula.fichas = jugadorMula.fichas.filter(f =>
          f !== mulaMayor.ficha
        );
        colocarFicha(mulaMayor.ficha, 'centro');
        turnoActual = (turnoActual + 1) % jugadores.length;
        actualizarInterfaz();
        setTimeout(jugarTurno, 1500);
      } else {
        setTimeout(jugarTurno, 1500);
      }

      function buscarMulaMayor() {
        let mulaMayor = null;
        let jugadorInicial = 0;

        // Buscar específicamente la ficha 6-6 primero
        jugadores.forEach((jugador, index) => {
          jugador.fichas.forEach(ficha => {
            if (ficha.numero1 === 6 && ficha.numero2 === 6) {
              mulaMayor = ficha;
              jugadorInicial = index;
            }
          });
        });

        // Si no se encuentra la ficha 6-6, buscar la mula mayor general
        if (!mulaMayor) {
          jugadores.forEach((jugador, index) => {
            jugador.fichas.forEach(ficha => {
              if (ficha.numero1 === ficha.numero2) {
                if (!mulaMayor || ficha.numero1 > mulaMayor.numero1) {
                  mulaMayor = ficha;
                  jugadorInicial = index;
                }
              }
            });
          });
        }

        return { ficha: mulaMayor, jugador: jugadorInicial };
      }

    }

    function registrarMovimiento(jugador, ficha, lado) {
      const listaMovimientos = document.getElementById("lista-movimientos");
      const nuevoMovimiento = document.createElement("li");
      nuevoMovimiento.textContent = `Jugador ${jugador + 1} colocó la ficha [${ficha.numero1}|${ficha.numero2}] en el lado ${lado}`;
      listaMovimientos.appendChild(nuevoMovimiento);
    }

    function actualizarProbabilidades() {
      const probabilidadesContainer = document.getElementById("probabilidades-container");
      probabilidadesContainer.innerHTML = ""; // Limpia el contenedor

      jugadores.forEach((jugador, index) => {
        const barraContainer = document.createElement("div");
        barraContainer.className = "barra-container";

        const label = document.createElement("div");
        label.className = "jugador-label";
        label.textContent = `Jugador ${index + 1} (${jugador.fichas.length} fichas)`;

        const barra = document.createElement("div");
        barra.className = "barra";

        const progreso = document.createElement("div");
        progreso.className = "progreso";
        const porcentaje = Math.max(10, 100 - jugador.fichas.length * 15); // Ajusta el porcentaje
        progreso.style.width = `${porcentaje}%`;
        progreso.textContent = `${porcentaje}%`; // Muestra el porcentaje

        barra.appendChild(progreso);
        barraContainer.appendChild(label);
        barraContainer.appendChild(barra);
        probabilidadesContainer.appendChild(barraContainer);
      });
    }


    function regresarConfiguracion() {
      // Mostrar la pantalla de configuración
      document.getElementById("setup").style.display = "block";
      document.getElementById("juego").style.display = "none";

      // Reiniciar tablero y datos
      tableroFichas = [];
      jugadores = [];
      turnoActual = 0;
      todasLasFichas = [];

      // Limpiar elementos visuales
      document.getElementById("lista-movimientos").innerHTML = "";
      document.getElementById("linea-fichas").innerHTML = "";
      document.getElementById("probabilidades").innerHTML = "";
    }

    function jugarTurno() {
      const jugadorActual = jugadores[turnoActual];
      let fichaJugada = null;
      let ladoColocacion = null;

      for (let i = 0; i < jugadorActual.fichas.length; i++) {
        const ficha = jugadorActual.fichas[i];
        const extremoIzquierdo = tableroFichas[0] ? tableroFichas[0].numero1 : null;
        const extremoDerecho = tableroFichas[tableroFichas.length - 1] ? tableroFichas[tableroFichas.length - 1].numero2 : null;

        if (tableroFichas.length === 0) {
          fichaJugada = ficha;
          ladoColocacion = 'centro';
          break;
        } else if (ficha.numero1 === extremoIzquierdo || ficha.numero2 === extremoIzquierdo) {
          fichaJugada = ficha;
          ladoColocacion = 'izquierda';
          break;
        } else if (ficha.numero1 === extremoDerecho || ficha.numero2 === extremoDerecho) {
          fichaJugada = ficha;
          ladoColocacion = 'derecha';
          break;
        }
      }

      if (fichaJugada) {
        jugadorActual.fichas = jugadorActual.fichas.filter(f => f !== fichaJugada);
        colocarFicha(fichaJugada, ladoColocacion);
        registrarMovimiento(turnoActual, fichaJugada, ladoColocacion);
        actualizarProbabilidades();

        if (jugadorActual.fichas.length === 0) {
          setTimeout(() => {
            alert(`¡El Jugador ${turnoActual + 1} ha ganado!`);
          
          }, 500);
          return;
        }

        turnoActual = (turnoActual + 1) % jugadores.length;
        actualizarInterfaz();

        setTimeout(jugarTurno, 1500);
      } else {
        turnoActual = (turnoActual + 1) % jugadores.length;
        actualizarInterfaz();
        setTimeout(jugarTurno, 1500);
      }
    }
    function irA(seccionId) {
            document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
            document.getElementById(seccionId).classList.add('active');
        }

