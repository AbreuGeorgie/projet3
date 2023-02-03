async function callApiWorks() {
	const response = await fetch('http://localhost:5678/api/works');
	if (!response.ok) {
		throw new Error(`HTTP error! status: ${response.status}`);
	}
	const data = await response.json();
    console.log("Les donnees", data)
    return data
}

function genererFigure(work) {

    const projetArchitecte = document.createElement("figure");
    const gallerie = document.querySelector(".gallery");

    //création des images et nom des projets
    const imageProjet = document.createElement("img");
    imageProjet.crossOrigin = "anonymous";
    imageProjet.src = work.imageUrl;
    imageProjet.alt = work.title;
    const nomProjet = document.createElement("figcaption");
    nomProjet.innerText = work.title;

    // on rattache les projets de l'architecte à la gallerie
    gallerie.appendChild(projetArchitecte);

    //ratachement des images et noms des projets aux projets de l'architecte
    projetArchitecte.appendChild(imageProjet);
    projetArchitecte.appendChild(nomProjet);
};


callApiWorks().then((figures) => {
    const filtres = new Set(["Tout"]);      
    
    figures.forEach((figure) => {
        filtres.add(figure.category.name);
        genererFigure(figure);
    });
    console.log("categorie", filtres); 

    
    filtres.forEach((filtre) => { 
        const boutonFiltre = document.createElement("button");
        const conteneurFiltres = document.querySelector("#filtres"); // a mettre dans une fonction car sinon est répété 4 fois

        boutonFiltre.innerText = filtre; 
        conteneurFiltres.appendChild(boutonFiltre);

        console.log("conteneurfiltres", conteneurFiltres);

        boutonFiltre.addEventListener("click", function () {
            const projetsFiltrees = filtres.filter(function (filt) { //filtres (mon "tableau set").filter n'est pas une focntion
                return filt.filtres == filtre;
            });
        
            });
        });
    });









