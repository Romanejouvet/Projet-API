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

    const template = document.getElementById("book-list-template");
    const authorName = document.querySelector("#author-name").textContent;

    BookAuthorData.entries.forEach((info) => {
      const cloneBookListAuthor = template.content.cloneNode(true);

      cloneBookListAuthor.querySelector(".book-title").textContent = info.title;

      cloneBookListAuthor.querySelector(".book-author").textContent =
        authorName;

      const imageElement = cloneBookListAuthor.querySelector(".book-cover");

      if (info.covers && info.covers.length > 0) {
        imageElement.src = `https://covers.openlibrary.org/b/id/${info.covers[0]}-L.jpg`;
      } else {
        imageElement.src = "/medias/img/aucuneImage.png";
      }

      imageElement.addEventListener("click", async () => {
        try {
          const editionsResponse = await fetch(
            `https://openlibrary.org${info.key}.json`
          );
          const editionsData = await editionsResponse.json();
          let isbn = null;

          for (const edition of editionsData.entries) {
            if (edition.isbn_13 && edition.isbn_13.length > 0) {
              isbn = edition.isbn_13[0];
              break;
            } else if (edition.isbn_10 && edition.isbn_10.length > 0) {
              isbn = edition.isbn_10[0];
              break;
            }
          }

          if (isbn) {
            window.location.href = `/pages/book-page.html?isbn=${isbn}`;
          }
        } catch (error) {
          console.error("Erreur lors de la récupération de l'ISBN :", error);
        }
      });

      document.getElementById("book-list").appendChild(cloneBookListAuthor);
    });
  } catch (error) {
    console.error("Erreur :", error);
  }
}

author();
getBookListAuthor();
