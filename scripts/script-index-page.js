// script-index-page.js

const isbn = '9782738208590'; // ISBN codé en dur

async function getLastRelease() {
  try {
    const recommanded_book = await isbnApi(isbn);
    console.log("Last release:", recommanded_book);

    const template = document.getElementById("last-release-template");
    if (!template) {
      console.error("Template introuvable !");
      return;
    }

    const clone = template.content.cloneNode(true);
    const lastRelease = clone.querySelector("#last-release");
    const imgElement = clone.querySelector("img");
    const titleElement = clone.querySelector("#book-title");
    const linkElement = clone.querySelector("#book-link");
    const authorElement = clone.querySelector("#book-author");
    const descriptionElement = clone.querySelector("#book-description");

    // Titre et lien
    titleElement.textContent = recommanded_book.title || "Titre inconnu";
    linkElement.href = `./pages/book-page.html?isbn=${recommanded_book.isbn_13 ? recommanded_book.isbn_13[0] : isbn}`;

    // Auteur
    let authorName = "Auteur inconnu";
    let authorIdParam = "";
    const authorKey = recommanded_book.authors?.[0]?.key;

    if (authorKey) {
      const authorResponse = await fetch(`https://openlibrary.org${authorKey}.json`);
      const authorData = await authorResponse.json();
      authorName = authorData.name || authorName;
      authorIdParam = authorKey.replace("/authors/", "");
    }
    authorElement.textContent = authorName;
    authorElement.href = `./pages/author-page.html?author=${authorIdParam}`;

    // Description
    const bookResponse = await fetch(`https://openlibrary.org${recommanded_book.key}.json`);
    const bookData = await bookResponse.json();
    const workKey = bookData.works?.[0]?.key;

    if (workKey) {
      const workResponse = await fetch(`https://openlibrary.org${workKey}.json`);
      const workData = await workResponse.json();
      const description =
        workData.description?.value?.split("-")[0] ||
        workData.description ||
        "Aucune description disponible.";
      descriptionElement.textContent = description;
    }

    // Cover
    if (recommanded_book.covers?.length > 0) {
      const coverUrl = `https://covers.openlibrary.org/b/id/${recommanded_book.covers[0]}-L.jpg`;
      imgElement.src = coverUrl;

      // Fonction pour gérer le background mobile
      function updateBackground() {
        if (window.matchMedia("(max-width: 600px)").matches) {
          lastRelease.style.backgroundImage = `url(${coverUrl})`;
        } else {
          lastRelease.style.backgroundImage = "";
        }
      }

      updateBackground();
      window.addEventListener("resize", updateBackground);
    }

    // Ajouter au DOM
    document.querySelector("#last-release-template-container").appendChild(clone);

  } catch (error) {
    console.error("Error fetching last release:", error);
  }
}

document.addEventListener("DOMContentLoaded", getLastRelease);
