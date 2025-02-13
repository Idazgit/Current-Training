//exercice fonction crée un nombre aléatoire entre 0 & 10
// 3 essaie pour deviner le nombre
// isRight(n)
//crée une fonction guess()
/*
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
}*/
// fonction pour les nombres premier
function isPremier(n) {
  if (n < 2) {
    return false;
  }
  for (let i = n - 1; i > 1; i--) {
    if (n % i === 0) {
      return false;
    }
  }
  return true;
}
console.log(isPremier(0));
console.log(isPremier(1));
console.log(isPremier(2));
console.log(isPremier(3));
console.log(isPremier(11));
console.log(isPremier(12));
