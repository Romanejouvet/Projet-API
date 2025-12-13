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

    const authorId = authorData.key.split("/").pop();

    imageElement.src = `https://covers.openlibrary.org/a/olid/${authorId}-L.jpg`;
    imageElement.alt = `Photo de ${authorData.name}`;

    

    nameAuthorElement.textContent = authorData.name ?? "Nom inconnu";
    biographyElement.textContent =
      typeof authorData.bio === "string"
        ? authorData.bio
        : authorData.bio?.value || "Aucune biographie disponible";

    document.querySelector("main").appendChild(cloneauthor);
  } catch (error) {
    console.error("Erreur :", error);
  }
}

author();
