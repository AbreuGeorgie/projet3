import { genererFigure } from "./work.js";

let modal = null;
let globalFigures = []

// const found = globalFigures.find(id => id === 10);
function creePoubelle() {
    //création du logo poubelle dans le boutton
    const boutonPoubelle = document.createElement("button")
    const logoPoubelle = document.createElement("i");
    boutonPoubelle.className = "bouton-poubelle";
    logoPoubelle.className = "fa-solid fa-trash-can";

    //on rattache le logo au bouton poubelle
    boutonPoubelle.appendChild(logoPoubelle);
    return boutonPoubelle;
}
function supprimerCallback(work) {
    return function (e) {
        const elementParent = e.target.parentElement;
        if ("workId" in elementParent.dataset === true) {
            const id = elementParent.dataset.workId
            let token = window.sessionStorage.getItem("token")
            fetch('http://localhost:5678/api/works/' + id, {
                method: 'DELETE',
                headers: {
                    'Authorization': `bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            })
                .then(res => {
                    const workSupprime = globalFigures.filter((work, index, arr) => {
                        if (work.id == id) {
                            arr.splice(index, 1);
                            return true;
                        }
                        return false;
                    })
                    console.log("Work supprimé ", workSupprime)
                    console.log("Tous les nouveaux Work", globalFigures)
                })
        }
        gallerieModal.removeChild(elementParent.parentElement);
    }
}
function genererFigureModal(work) {

    const projetArchitecte = document.createElement("figure");
    const gallerieModal = document.querySelector(".gallery-modal");

    //création des images et nom des projets
    const imageProjet = document.createElement("img");
    imageProjet.crossOrigin = "anonymous";
    imageProjet.src = work.imageUrl;
    imageProjet.alt = work.title;
    const nomProjet = document.createElement("figcaption");
    nomProjet.innerText = "éditer";

    const boutonPoubelle = creePoubelle();
    boutonPoubelle.dataset.workId = work.id;

    // on rattache les projets de l'architecte à la gallerie
    gallerieModal.appendChild(projetArchitecte);

    //ratachement des images et noms des projets aux projets de l'architecte
    projetArchitecte.appendChild(imageProjet);
    projetArchitecte.appendChild(nomProjet);
    projetArchitecte.appendChild(boutonPoubelle);

    //supprimer des éléments de la gallerie
    boutonPoubelle.addEventListener("click", supprimerCallback(work))
    
};

//---------------------------------- FOCUSABLE -------------------------//

//variable qui permet d'identifier les différents éléments focusables 
const focusableSelector = "button, a, input, textarea";
let focusables = []

//fonction qui va permettre de selectionner les elements focusable
const focusInModal = function (e) {
    e.preventDefault()
    let index = focusables.findIndex(f => f === modal.querySelector(":focus"))
    if (e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }
    if (index < 0) {
        index = focusables.length - 1
    }
    focusables[index].focus();
}

//fonction qui écoute les cliques du clavier et permet de fermer la modal ou selectionner un element focusable avec tab
window.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === "Esc") {
        closeModal(e)
    }
    if (e.key === "Tab" && modal !== null) {
        focusInModal(e);
    }
})

//--------------------- OUVERTURE MODALE ----------------------------//


export const openModal = function (e, figures) {
    globalFigures = figures
    figures.forEach((figure) => {
        genererFigureModal(figure);
    });
    e.preventDefault();
    modal = document.querySelector(e.target.getAttribute("href")) // cible l'id modal1
    const boutonClose = document.querySelector(".js-close-modal")
    boutonClose.innerHTML = "x"
    focusables = Array.from(modal.querySelectorAll(focusableSelector)) //Array.from pour avoir les éléments focusables dans un tableau
    focusables[0].focus() //permet de selectionner le premier élément focusable avec tab
    modal.style.display = null // enlève de display none attribué dans le HTML
    modal.removeAttribute("aria-hidden")// on retire le masquage d'élément pour les lecteurs d'écran (accessibilité)
    modal.setAttribute("aria-modal", "true")//permet d'indiquer aux technologies d'assistance que les fenetre situées sous la boite de dialogue ne font pas partie de la boite modal (accessibilité)
    modal.addEventListener("click", closeModal)//permet de fermer la fenetre lors du click
    modal.querySelector(".js-close-modal").addEventListener("click", closeModal)//permet de fermer la modal lors du clique sur le bouton
    modal.querySelector(".js-modal-stop").addEventListener("click", stopPropagation)//permet de stopper la propagation de fermeture lors du clique a l'interieur de la modale
}

/* --------------------- FERMETURE MODALE ---------------------------- */

const closeModal = function (e) {
    if (modal === null) return  //si la modale s'affiche
    e.preventDefault();
    document.querySelector(".gallery-modal").innerHTML = "";
    modal.style.display = "none"; // ne plus afficher la modale
    modal.setAttribute("aria-hidden", "true"); //on masque la modale pour les lecteurs d'écran (accessibilité)
    modal.removeAttribute("aria-modal"); // on indique les fenetres sous la modale redevienne active (accessibilité)
    modal.removeEventListener("click", closeModal); // on retire l'écoute du clique 
    modal.querySelector(".js-close-modal").removeEventListener("click", closeModal); //on retire la fermeture de la modale
    modal.querySelector(".js-modal-stop").removeEventListener("click", stopPropagation); // on retire le stop de propagation pour la fermeture
    modal = null; // on remet la valeur de la modal a null
    retourPageAccueilModale();
    console.log("ici", globalFigures)
    const gallerie = document.querySelector(".gallery");
    gallerie.innerHTML = ""
    globalFigures.forEach((figure) => {
        genererFigure(figure); // pour chaque projet => generer projet
    });
}

/* -------------------------STOP PROPAGATION------------------------ */

const stopPropagation = function (e) {
    e.stopPropagation()
}


/* ------ PASSER DE LA "PREMIERE" PAGE MODALE A LA "DEUXIEME" ------- */

//constante de la page modale ajouter projets
const boutonAjouterProjet = document.getElementById("ajouter-projets");
const boutonRetour = document.querySelector(".fleche-retour");
const ajouterSupprimerProjets = document.getElementById("ajouter-supprimer");
const boutonValider = document.getElementById("valider");
const ajoutProjet = document.getElementById("ajout-projets");
const titreModal = document.getElementById("titre-modal");
const gallerieModal = document.querySelector(".gallery-modal")
const titre = document.getElementById("ajouter-titre");
const imgPreview = document.getElementById('img-preview');

//fonction pour passer de la première à la deuxième page
const ajouterDesProjets = function () {
    titreModal.innerText = "Ajout photo";

    gallerieModal.style.display = "none";
    ajoutProjet.style.display = "block";
    boutonRetour.style.display = "block";
    boutonAjouterProjet.style.display = "none";
    ajouterSupprimerProjets.style.display = "none";
    boutonValider.style.display = "block";
};


/* ------ RETOURNER DE LA "DEUXIEME" PAGE MODALE A LA "PREMIERE" ------- */
const retourPageAccueilModale = function () {
    titreModal.innerText = "Galerie photo";
    gallerieModal.style.display = "grid";
    ajoutProjet.style.display = "none";
    boutonRetour.style.display = "none";
    ajouterSupprimerProjets.style.display = "flex";
    boutonAjouterProjet.style.display = "block";
    boutonValider.style.display = "none";
    titre.value = "";
    reinitialiserAjouterPhoto()
};

boutonAjouterProjet.addEventListener("click", ajouterDesProjets);
boutonRetour.addEventListener("click", retourPageAccueilModale);

/* -------------SELECTIONNER L'IMAGE DU NOUVEAU PROJET--------------- */

const photoSelector = document.getElementById('file');
const textAjouterPhoto = document.getElementById("ajout-photo");
const pngJpg = document.getElementById("legende-photo");
const logoImage = document.getElementById("logo-image");

photoSelector.addEventListener('change', event => {
    /* const files = event.target.files  */
    /*     const imgPreview = document.getElementById('img-preview'); */
    textAjouterPhoto.style.display = "none";
    pngJpg.style.display = "none";
    logoImage.style.display = "none";
    imgPreview.style.display = "block";
    imgPreview.src = URL.createObjectURL(event.target.files[0]);
    imgPreview.onload = function () {
        URL.revokeObjectURL(imgPreview.src) // free memory
    }
})

const reinitialiserAjouterPhoto = function () {
    textAjouterPhoto.style.display = null;
    pngJpg.style.display = null;
    logoImage.style.display = null;
    imgPreview.style.display = null;
    imgPreview.src = ""
}


/* ------------------ AJOUTER LE NOUVEAU PROJET -------------------------- */

async function callApiAjouterFigure(workForm) {
    console.log(workForm)
    let token = window.sessionStorage.getItem("token")
    console.log("tokenAjouterProjet", token)
    const response = await fetch('http://localhost:5678/api/works', {
        method: 'POST',
        headers: {
            'Authorization': `bearer ${token}`
        },
        body: workForm
    })
    return response
};


//activation/desactivation bouton valider
const boutonEnvoyerForm = function () {

    const photo = document.getElementById("file");
    const titre = document.getElementById("ajouter-titre");
    const valider = document.getElementById("valider")

    titre.addEventListener("change", function () {
        if (photo.value != "" && titre.value != "") {
            valider.removeAttribute("disabled");
            valider.style.backgroundColor = "#1D6154"
        }
    })

    photo.addEventListener("change", function () {
        if (photo.value != "" && titre.value != "") {
            valider.removeAttribute("disabled");
            valider.style.backgroundColor = "#1D6154"
        }
    })
}

boutonEnvoyerForm()

// envoi du formulaire avec method POST
const ajouterProjet = function () {
    const formAjoutProjets = document.querySelector("#ajout-projets"); //reccuperation du formulaire

    formAjoutProjets.addEventListener("submit", function (event) {
        event.preventDefault();

        const title = event.target.querySelector("#ajouter-titre").value
        const image = document.querySelector("input[type='file']");
        const workForm = new FormData();

        workForm.append("image", image.files[0]);
        workForm.append("title", title);
        workForm.append("category", parseInt(
            event.target.querySelector("#choisir-categorie").value
        ))

        const afficherNouveauProjet = document.createElement("figure");
        const gallerieModal = document.querySelector(".gallery-modal");

        const imageProjet = document.createElement("img");
        imageProjet.crossOrigin = "anonymous";
        const nomProjet = document.createElement("figcaption");
        nomProjet.innerText = "editer";
        



        // appel à l'api
        callApiAjouterFigure(workForm)
            .then((res) => {
                if (!res.ok) { //si la connexion ne se fait pas
                    res.json().then((body) => {
                        throw body.message
                    }).catch((error) => {
                        console.log(error);
                        alert(error);
                    });
                }
                res.json().then((body) => {
                    console.log(body)
                    globalFigures.push(body)
                    imageProjet.src = body.imageUrl
                    imageProjet.alt = title;
                    afficherNouveauProjet.appendChild(imageProjet)
                    afficherNouveauProjet.appendChild(nomProjet)
                    gallerieModal.appendChild(afficherNouveauProjet);
                    const boutonPoubelle = creePoubelle();
                    boutonPoubelle.dataset.workId = body.id;
                    afficherNouveauProjet.appendChild(boutonPoubelle);
                    
                    //supprimer des éléments de la gallerie
                    boutonPoubelle.addEventListener("click", supprimerCallback(body))
                    
                    retourPageAccueilModale();
                })
            });
    })
}

ajouterProjet();



//--------------------------------------------------------------------



