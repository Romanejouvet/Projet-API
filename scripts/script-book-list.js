async function getIndividualBook(bookId) { // get individual book name / author / image

    let bookTitle = "";
    let bookAuthor = "";
    let bookImage = "";
    let bookTitleLink = "";
    let bookAuthorLink = "";
    
    try {
        const individualBook = await isbnApi(bookId);
        console.log("Individual book:", individualBook);

        // récupérer le titre
        bookTitle = individualBook.title || "Titre inconnu";
        // récupérer le lien vers la page du livre
        bookTitleLink = `./pages/book-page.html?isbn=${individualBook.isbn_13 ? individualBook.isbn_13[0] : bookId}`;

        // récupérer la cover
        if (individualBook.covers) {
            const coverUrl = `https://covers.openlibrary.org/b/id/${individualBook.covers[0]}-M.jpg`;
            bookImage = coverUrl;
        }

        // récupérer l'auteur
        const authorKey = individualBook.authors?.[0]?.key;
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
        bookAuthor = `${authorName}`;
        bookAuthorLink = `./pages/author-page.html?author=${authorIdParam}`;

        let bookInfos = [bookTitle, bookAuthor, bookImage, bookTitleLink, bookAuthorLink];
        return bookInfos;

    } catch (error) {
        console.error("Error fetching individual book:", error);
    }
}

async function IndividualBook(bookId) {

    const bookInfos =  await getIndividualBook(bookId);
    console.log("Book Infos:", bookInfos);

    const template = document.getElementById("book-item-template");
    const clone = template.content.cloneNode(true);

    // récupérer le titre
    clone.querySelector(".book-item-title").textContent = bookInfos[0];
    // récupérer le lien vers la page du livre
    clone.querySelector(".book-item-link").href = bookInfos[3];

    // récupérer la cover
    if (bookInfos[2]) {
        clone.querySelector("img").src = bookInfos[2];
    }

    // récupérer l'auteur
    clone.querySelector(".book-item-author").textContent = bookInfos[1];
    clone.querySelector(".book-item-author").href = bookInfos[4];

    document.querySelector("#book-list").appendChild(clone);


}

