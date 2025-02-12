// Question pour l'utilisateur

let chiffre = prompt("Entrez un nombre entre 1 et 10");

//cette condition permet d'afficher dans la console les nombres en dessous de celui rentré
if (chiffre > 0 && chiffre <= 10) {
  while (chiffre >= 0) {
    console.log(chiffre);
    chiffre--;
  }
} else {
  console.log("Le nombre ne convient pas");
}
//Autre manière de l'écrire
let chiffre1 = prompt("Entrez un nombre entre 1 et 10");
if (chiffre1 > 10 || chiffre1 < 0) {
  console.log("Le nombre n'est pas entre 0 et 10");
} else {
  for (let i = chiffre1; i >= 0; i--) console.log(i);
}

// Second exo : demander à l'utilisateur un nombre jusqu'a ce qu'il devine 8
let guess = 8;
let chiffre3;
while (chiffre3 !== guess) {
  chiffre3 = prompt("Votre chiffre") * 1;
  if (chiffre3 < guess) {
    console.log("plus");
  } else if (chiffre3 > guess) {
    console.log("moins");
  }
}
console.log("bravo");
