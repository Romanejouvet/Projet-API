const isbn = '9782070248100';

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
    clone.querySelector(
      "#book-author"
    ).href = `./pages/author-page.html?author=${authorIdParam}`;


    // récupérer la description
    const workKey = bookData.works?.[0]?.key;
    if (workKey) {
      const workResponse = await fetch(
        `https://openlibrary.org${workKey}.json`
      );
      const workData = await workResponse.json();

      const description =
        workData.description?.value ||
        workData.description ||
        "Aucune description disponible.";

      clone.querySelector("#book-description").textContent =
        description;
    }

    document.querySelector("main").appendChild(clone);

  } catch (error) {
    console.error("Error fetching last release:", error);
  }

}

getLastRelease();

/*
   template for last release
    <template id="last-release-template">
      <div id="last-release">
        <img src="./medias/img/placeholder.jpeg" alt="Cover Image" />
        <section id="book-info">
          <a id="book-link" href="#"><h3 id="book-title">Book Title</h3></a>
          <a id="book-author" href="#">Author Name</a>
          <p id="book-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </section>
      </div>
    </template>

*/



