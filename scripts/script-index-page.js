// script-index-page.js

const isbn = '9782738208590';  // ISBN random codé en dur (un peu ghetto mais bon)

async function getLastRelease() { // use code below to load the last release
  try {
    const recommanded_book = await isbnApi(isbn);
    console.log("Last release:", recommanded_book);
    const template = document.getElementById("last-release-template");
    const clone = template.content.cloneNode(true);

    // récupérer le titre
    clone.querySelector("#book-title").textContent = recommanded_book.title || "Titre inconnu";
    // récupérer le lien vers la page du livre
    clone.querySelector("#book-link").href = `./pages/book-page.html?isbn=${recommanded_book.isbn_13 ? recommanded_book.isbn_13[0] : isbn}`;

    // récupérer la cover
    if (recommanded_book.covers) {
      const coverUrl = `https://covers.openlibrary.org/b/id/${recommanded_book.covers[0]}-L.jpg`;
      clone.querySelector("img").src = coverUrl;
    }

    // récupérer plus d'infos pour avoir la description et l'auteur
    const bookResponse = await fetch(
      `https://openlibrary.org${recommanded_book.key}.json`
    );
    const bookData = await bookResponse.json();

    // récupérer l'auteur (la c'est les problemes)
    const authorKey = recommanded_book.authors?.[0]?.key;
    let authorName = "Auteur inconnu";
    let authorIdParam = "";

    if (authorKey) {
      const authorResponse = await fetch(
        `https://openlibrary.org${authorKey}.json`
      );
      const authorData = await authorResponse.json();

      authorName = authorData.name || authorName;

      authorIdParam = authorKey.replace("/authors/", "");
    }
    clone.querySelector("#book-author").textContent = `${authorName}`;
    clone.querySelector("#book-author").href = `./pages/author-page.html?author=${authorIdParam}`;


    // récupérer la description
    const workKey = bookData.works?.[0]?.key;
    if (workKey) {
      const workResponse = await fetch(
        `https://openlibrary.org${workKey}.json`
      );
      const workData = await workResponse.json();

      const description =
        workData.description?.value.split("-")[0] ||
        workData.description ||
        "Aucune description disponible.";

      clone.querySelector("#book-description").textContent =
        description;
    }

    document.querySelector("#last-release-template-container").appendChild(clone);

  } catch (error) {
    console.error("Error fetching last release:", error);
  }

}

getLastRelease();




