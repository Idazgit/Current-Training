//exercice fonction crée un nombre aléatoire entre 0 & 10
// 3 essaie pour deviner le nombre
// isRight(n)
//crée une fonction guess()

function randomNumber() {
  return Math.floor(Math.random() * 11);
}
const nombreADeviner = randomNumber();

console.log(nombreADeviner);

function guess() {
  let nombre = prompt("entre un nombre") * 1;
  return isRight(nombre);
}
function isRight(n) {
  return nombreADeviner === n;
}
for (let i = 0; i < 3; i++) {
  if (guess()) {
    console.log("Bravo");
    break;
  } else if (i === 2) {
    console.log("Vous avez perdu");
  }
}
