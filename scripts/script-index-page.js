const isbn = '9782070248100';

async function loadLastRelease() { // use code below to load the last release
    try {
        const recommanded_book = await isbnApi(isbn);
        console.log("Last release:", recommanded_book);
        const template = document.getElementById("last-release-template");
        const clone = template.content.cloneNode(true);

        

    } catch (error) {
        console.error("Error fetching last release:", error);
    }

}

loadLastRelease();

/*
   template for last release
    <template id="last-release-template">
      <div id="last-release">
        <img src="./medias/img/placeholder.jpeg" alt="Cover Image" />
        <section id="book-info">
          <h3 class="book-title">Book Title</h3>
          <p class="book-author"><a href="#">Author Name</a></p>
          <p class="book-description">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
        </section>
      </div>
    </template>

*/



