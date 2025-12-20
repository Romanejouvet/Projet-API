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

    document.getElementById("infos-author").appendChild(cloneauthor);
  } catch (error) {
    console.error("Erreur :", error);
  }
}

async function getBookListAuthor() {
  try {
    const BookAuthorResponse = await fetch(
      `https://openlibrary.org/authors/${authorURL}/works.json?limit=10`
    );

    const BookAuthorData = await BookAuthorResponse.json();
    console.log(BookAuthorData);

    const authorResponse = await fetch(
      `https://openlibrary.org/authors/${authorURL}.json`
    );
    const authorData = await authorResponse.json();
    const authorName = authorData.name || "Auteur inconnu";

    const template = document.getElementById("book-list-template");

    const entries = BookAuthorData.entries || BookAuthorData;

    for (const info of entries) {
      try {
        if (!info.covers || info.covers.length === 0) {
          console.log(`${info.title} pas de couverture`);
          continue;
        }

        const editionsResponse = await fetch(
          `https://openlibrary.org${info.key}/editions.json`
        );
        const editionsData = await editionsResponse.json();
        const firstIsbn = editionsData.entries?.find(
          (ed) => ed.isbn_13?.length || ed.isbn_10?.length
        );
        if (!firstIsbn) {
          console.log(`${info.title}" pas d'isbn on affiche pas la team`);
          continue;
        }
        const isbn = firstIsbn.isbn_13?.[0] || firstIsbn.isbn_10?.[0];

        const cloneBookListAuthor = template.content.cloneNode(true);

        const title = cloneBookListAuthor.querySelector(".book-title");
        title.textContent = info.title;
        title.href = `/pages/book-page.html?isbn=${isbn}`;

        cloneBookListAuthor.querySelector(".book-author").textContent =
          authorName;

 
        const image = cloneBookListAuthor.querySelector(".book-cover");
               image.tabIndex = 0;
        image.src = `https://covers.openlibrary.org/b/id/${info.covers[0]}-L.jpg`;
        image.addEventListener("click", () => {
          window.location.href = `/pages/book-page.html?isbn=${isbn}`;
        });

        document.getElementById("book-list").appendChild(cloneBookListAuthor);
      } catch (error) {
        console.log(`Erreur ${info.title}`, error);
      }
    }
  } catch (error) {
    console.log("Erreur:", error);
  }
}

author();
getBookListAuthor();
