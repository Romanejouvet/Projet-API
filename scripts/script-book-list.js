async function displayGenreBooks(genre) {
  try {
    const genreData = await genreAPI(genre);
    console.log("Genre Data:", genreData);

    const template = document.getElementById("book-item-template");
    const bookList = document.getElementById("book-list");

    
    bookList.textContent = "";
    bookList.appendChild(template); 

    const works = genreData.works || [];





    for (let i = 0; i < 10 && i < works.length; i++) {
      const work = works[i];


      try {
    
        if (!work.cover_id) {
          console.log(`${work.title} pas de cover`);
          continue;
        }

        
        
        const editionsResponse = await fetch(
          `https://openlibrary.org${work.key}/editions.json`
        );
        const editionsData = await editionsResponse.json();

        const firstIsbn = editionsData.entries?.find(
          (ed) => ed.isbn_13?.length || ed.isbn_10?.length
        );

        if (!firstIsbn) {
          console.log(`${work.title} pas d'ISBN`);
          continue;
        }

        const isbn = firstIsbn.isbn_13?.[0] || firstIsbn.isbn_10?.[0];


        const clone = template.content.cloneNode(true);

        
        const bookLink = clone.querySelector(".book-item-link");
        bookLink.href = `/pages/book-page.html?isbn=${isbn}`;

        
        const image = clone.querySelector(".book-cover");
        image.src = `https://covers.openlibrary.org/b/id/${work.cover_id}-M.jpg`;


        const title = clone.querySelector(".book-item-title");
        title.textContent = work.title;


        const authorLink = clone.querySelector(".book-item-author");
        const authorName = work.authors?.[0]?.name || "Auteur inconnu";
        authorLink.textContent = authorName;

        if (work.authors?.[0]?.key) {
          const authorKey = work.authors[0].key.replace("/authors/", "");
          authorLink.href = `/pages/author-page.html?author=${authorKey}`;
        } 

        bookList.appendChild(clone);
      } catch (error) {
        console.log(`Erreur ${work.title}:`, error);
      }
    }
  } catch (error) {
    console.log("Erreur:", error);
  }
}


displayGenreBooks("amour");


const selectGenre = document.getElementById("select-genre");
selectGenre.addEventListener("change", (e) => {
  const genre = e.target.value;
  if (genre) {
    displayGenreBooks(genre);
  }
});
