const searchParams = new URLSearchParams(window.location.search);
const authorURL = searchParams.get("author");

async function author() {
  if (!authorURL) {
    console.error("Pas d'auteur");
    return;
  }

  try {
    const template = document.getElementById("book-author-template");
    const cloneauthor = template.content.cloneNode(true);

    const authorResponse = await fetch(
      `https://openlibrary.org/authors/${authorURL}.json`
    );

    const authorData = await authorResponse.json();
    console.log(authorData);

    const nameAuthorElement = cloneauthor.querySelector("#author-name");
    const biographyElement = cloneauthor.querySelector("#Biography");
    const imageElement = cloneauthor.querySelector("#author-face");

    imageElement.src = `https://covers.openlibrary.org/a/olid/${authorURL}-L.jpg`;

    nameAuthorElement.textContent = authorData.name ?? "Nom inconnu";

    if (authorData.bio == undefined || authorData.bio.value == null) {
      biographyElement.textContent = authorData.bio;
    } else {
      biographyElement.textContent =
        authorData.bio.value || "Aucune biographie disponible";
    }

    document.querySelector("main").appendChild(cloneauthor);
  } catch (error) {
    console.error("Erreur :", error);
  }
}



async function getBookListAuthor() {
  if (!getBookListAuthorURL) {
    console.error("Pas d'ouvrages");
    return;
  }

  try { 

  }
  catch (error) {
    console.error("Erreur :", error);
  }
  
}

author();
getBookListAuthor();



