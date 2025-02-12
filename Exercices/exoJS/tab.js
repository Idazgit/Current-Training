const notes = [12, 13, 16, 8];
for (let i in notes) {
  console.log(notes[i]);
}
//utilisable sur un tableau mais pas sur un objet (not iterable)
//Le for (of) ne fonctionne que sur des choses iterables
//Le for (in) lui va etre capable de fonctionner sur un objet
for (let note of notes) {
  console.log(note);
}
const notes2 = {
  a: 1,
  b: 3,
};
for (let i in notes2) {
  console.log(notes2[i]);
}

const person = {
  firstname: "john",
  lastname: "Doe",
};
for (let i in person) {
  console.log(person[i]);
}

const greeting = "bonjour";
// Va nous donner chaque element du mot comme un tableau
for (let letter of greeting) {
  console.log(letter);
}
// Va nous donner l'index de chaque lettre
for (let letter in greeting) {
  console.log(letter);
}
//Le letter ne peut être utilisé en dehors de la fonction car il n'existe pas

//Exercice demander a l'utilisateur un chiffre entre 1 et 10 et afficher tout les nombres en dessous du chiffre entré

let nombre = prompt("Veuillez entrer un nombre entre 1 et 10 :");

if (nombre > 0 && nombre < 10) {
  console.log("salut");
} else {
  console.log("Veuillez entrer un nombre valide entre 1 et 10");
}
