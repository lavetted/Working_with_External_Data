import * as Carousel from "./Carousel.js";
import axios from "axios";

// Step 0: Store your API key here for reference and easy access.
const API_KEY =
  "live_M6PG3PWzdDUEtqDLPqa6OXwSfWUKh7RZTv57feDGVoDVXmnI1fB8DNS9iDuuAslO";

axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] = API_KEY;

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */

async function initialLoad() {
  try {
    const response = await fetch("https://api.thecatapi.com/v1/breeds", {
      headers: {
        "x-api-key": API_KEY,
      },
    });

    const breeds = await response.json();

    for (let breed of breeds) {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    }
  } catch (err) {
    console.error("❌ Failed to load breeds:", err);
  }
}

// Execute immediately
initialLoad();

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */
breedSelect.addEventListener("change", handleBreedChange);

async function handleBreedChange() {
  try {
    const breedId = breedSelect.value;

    // Clear previous UI
    infoDump.innerHTML = "";
    Carousel.clear();

    const response = await fetch(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=5`,
      {
        headers: {
          "x-api-key": API_KEY,
        },
      }
    );

    const images = await response.json();

    images.forEach((item) => {
      // Create carousel item
      const carouselItem = Carousel.createCarouselItem(
        item.url,
        "Cat image",
        item.id
      );

      Carousel.appendCarousel(carouselItem);

      // Use breed info from first image
      if (item.breeds && item.breeds.length > 0) {
        const breed = item.breeds[0];

        infoDump.innerHTML = `
          <h2>${breed.name}</h2>
          <p><strong>Origin:</strong> ${breed.origin}</p>
          <p><strong>Temperament:</strong> ${breed.temperament}</p>
          <p>${breed.description}</p>
        `;
      }
    });

    Carousel.start();
  } catch (err) {
    console.error("❌ Failed to load breed data:", err);
  }
}

handleBreedChange();

/**
 * 3. Create an additional file to handle an alternative approach in "axios.js"
 */
