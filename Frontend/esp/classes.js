// classes.js

class GameElement {
  constructor(nombre, imagen) {
    this.nombre = nombre;
    this.imagen = imagen;
  }
  toPlain() {
    return { __type: this.constructor.name, nombre: this.nombre, imagen: this.imagen };
  }
}

class Dino extends GameElement {
  constructor(nombre, imagen, especie = null) {
    super(nombre, imagen);
    this.especie = especie || nombre;
  }
  descripcion() {
    return `${this.nombre} (${this.especie})`;
  }
}

class Recinto {
  constructor(nombre, pais = '', area = '') {
    this.nombre = nombre;
    this.pais = pais;
    this.area = area;
    this.capacidad = Infinity;
  }
  canAccept(dino, zoo) {
    const count = (zoo[this.nombre] || []).length;
    return count < this.capacidad;
  }
}

class Rio extends Recinto {
  constructor() { super('rio'); }
  canAccept(dino, zoo) { return true; }
}

class Moscu extends Recinto {
  constructor() { super('moscu', 'rusia', 'ciudad'); }
  canAccept(dino, zoo) {
    const hasSame = (zoo[this.nombre] || []).some(d => d.nombre === dino.nombre);
    return !hasSame;
  }
}

class Cheliabinsk extends Recinto {
  constructor() { super('cheliabinsk', 'rusia', 'ciudad'); this.capacidad = 1; }
  canAccept(dino, zoo) {
    for (let z in zoo) {
      if (z !== this.nombre && zoo[z].some(dd => dd.nombre === dino.nombre)) return false;
    }
    return super.canAccept(dino, zoo);
  }
}

const tiposDeDinosData = [
  { nombre: 'T-Rex', imagen: 'red.png' },
  { nombre: 'Triceratops', imagen: 'green.png' },
  { nombre: 'Stego', imagen: 'light blue.png' },
  { nombre: 'Ptera', imagen: 'blue.png' },
  { nombre: 'Bronto', imagen: 'Yellow.png' },
  { nombre: 'Raptor', imagen: 'violet.png' }
];

function crearDinoRandom() {
  const t = tiposDeDinosData[Math.floor(Math.random() * tiposDeDinosData.length)];
  return new Dino(t.nombre, t.imagen, t.nombre);
}

window.GameElement = GameElement;
window.Dino = Dino;
window.Recinto = Recinto;
window.Rio = Rio;
window.Moscu = Moscu;
window.Cheliabinsk = Cheliabinsk;
window.crearDinoRandom = crearDinoRandom;
