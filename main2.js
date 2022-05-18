var componentes = {
  NmrDeLinhas: 14,
  NmrDeColunas: 18,
  NmrDeBombas: 40,
  bomba: "X",
  vivo: true,
  cores: {
    1: "blue",
    2: "orange",
    3: "green",
    4: "purple",
    5: "maroon",
    6: "turquoise",
    7: "black",
    8: "grey",
  },
};

function ComeçoDoJogo() {
  componentes.bombas = ImprimirBombas();
  document.getElementById("field").appendChild(CriarTabela());
}

function ImprimirBombas() {

  var i
  var linhas = [];

  for (i = 0; i < componentes.NmrDeBombas; i++) {
    BombaÚnica(linhas);
  }
console.log("imprimir", linhas)
  return linhas;
}


function BombaÚnica(bombas) {
  var nlinhas
  var ncolunas
  var linha
  var coluna;
  
  nlinhas = Math.floor(Math.random() * componentes.NmrDeLinhas);
  ncolunas = Math.floor(Math.random() * componentes.NmrDeColunas);

  linha = bombas[nlinhas];

  if (!linha) {
    linha = [];
    bombas[nlinhas] = linha;
  }

  coluna = linha[ncolunas];

  if (!coluna) {
    linha[ncolunas] = true;
    return;
  } else {
    BombaÚnica(bombas);
  }
}

function quadradoID(i, j) {
  return "quadrado-" + i + "-" + j;
}

function CriarTabela() {
  var table, linha, td, i, j;
  table = document.createElement("table");

  for (i = 0; i < componentes.NmrDeLinhas; i++) {
    linha = document.createElement("tr");
    for (j = 0; j < componentes.NmrDeColunas; j++) {
      td = document.createElement("td");
      td.id = quadradoID(i, j);
      linha.appendChild(td);
      AdicionarQuadrados(td, i, j);
    }
    table.appendChild(linha);
  }
  return table;
}

//appendChild =anexar filho

//adicionar ouvintes quadrados
function AdicionarQuadrados(td, i, j) {
  td.addEventListener("mousedown", function (event) {
    if (!componentes.vivo) {
      return;
    }
    componentes.mousewhiches += event.which;
    if (event.which === 3) {
      return;
    }
    if (this.senalizar) {
      return;
    }
    this.style.backgroundColor = "lightGrey";
  });
  //bombs
  td.addEventListener("mouseup", function (event) {
    if (!componentes.vivo) {
      return;
    }

    if (this.Clique && componentes.mousewhiches == 4) {
      CliquesSeguidos(this, i, j);
    }

    componentes.mousewhiches = 0;

    if (event.which === 3) {
      if (this.Clique) {
        return;
      }
      if (this.senalizar) {
        this.senalizar = false;
        this.textContent = "";
      } else {
        this.senalizar = true;
        this.textContent = componentes.flag;
      }

      event.preventDefault();
      event.stopPropagation();

      return false;
    } else {
      QuadradoNoClique(this, i, j);
    }
  });

  td.oncontextmenu = function () {
    return false;
  };
}
function QuadradoNoClique(quadrado, i, j) {
  if (!componentes.vivo) {
    return;
  }

  if (quadrado.senalizar) {
    return;
  }

  quadrado.Clique = true;

  if (componentes.bombas[i][j]) {
    quadrado.style.color = "red";
    quadrado.textContent = componentes.bomba;
    game_over();
  } else {
    quadrado.style.backgroundColor = "lightGrey";
    NmrDeBombas = adjacentBombs(i, j);
    if (NmrDeBombas) {
      quadrado.style.color = componentes.cores[NmrDeBombas];
      quadrado.textContent = NmrDeBombas;
    } else {
      BombasPorPerto(i, j);
    }
  }
}

function adjacentBombs(linha, coluna) {
  var i, j, NmrDeBombas;
  NmrDeBombas = 0;

  for (i = -1; i < 2; i++) {
    for (j = -1; j < 2; j++) {
      if (
        componentes.bombas[linha + i] &&
        componentes.bombas[linha + i][coluna + j]
      ) {
        NmrDeBombas++;
      }
    }
  }
  return NmrDeBombas;
}

function BandeirasPorPerto(linha, coluna) {
  var i, j, NmrDeBandeiras;
  NmrDeBandeiras = 0;

  for (i = -1; i < 2; i++) {
    for (j = -1; j < 2; j++) {
      quadrado = document.getElementById(quadradoID(linha + i, coluna + j));
      if (!!quadrado && quadrado.senalizar) {
        NmrDeBandeiras++;
      }
    }
  }
  return NmrDeBandeiras;
}

function BombasPorPerto(linha, coluna) {
  var i, j, quadrado;

  for (i = -1; i < 2; i++) {
    for (j = -1; j < 2; j++) {
      if (i === 0 && j === 0) {
        continue;
      }
      quadrado = document.getElementById(quadradoID(linha + i, coluna + j));
      if (!!quadrado && !quadrado.Clique && !quadrado.senalizar) {
        QuadradoNoClique(quadrado, linha + i, coluna + j);
      }
    }
  }
}

function CliquesSeguidos(quadrado, linha, coluna) {
  if (BandeirasPorPerto(linha, coluna) === adjacentBombs(linha, coluna)) {
    BombasPorPerto(linha, coluna);
  }
}

function game_over() {
  componentes.vivo = false;
  document.getElementById("lost").style.display = "block";
}

function recarregar() {
  window.location.reload();
}
//adicionar ouvinte de eventos
window.addEventListener("load", function () {
  document.getElementById("lost").style.display = "none";
  ComeçoDoJogo();
});
