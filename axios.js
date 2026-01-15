import * as Carousel from "./Carousel.js";
import axios from "axios";

/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */

async function initialLoad() {
  try {
    const response = await axios.get(
      `https://api.thecatapi.com/v1/images/search?breed_ids=${breedId}&limit=5`
    );

    for (let breed of response.data) {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    }

    handleBreedChange(); // initial carousel
  } catch (err) {
    console.error(" Failed to load breeds:", err);
  }
}

initialLoad();

async function handleBreedChange() {
  try {
    const breedId = breedSelect.value;

    infoDump.innerHTML = "";
    Carousel.clear();

    const response = await axios.get("/images/search", {
      params: {
        breed_ids: breedId,
        limit: 5,
      },
    });

    for (let item of response.data) {
      const carouselItem = Carousel.createCarouselItem(
        item.url,
        "Cat image",
        item.id
      );

      Carousel.appendCarousel(carouselItem);

      if (item.breeds?.length) {
        const breed = item.breeds[0];
        infoDump.innerHTML = `
          <h2>${breed.name}</h2>
          <p><strong>Origin:</strong> ${breed.origin}</p>
          <p><strong>Temperament:</strong> ${breed.temperament}</p>
          <p>${breed.description}</p>
        `;
      }
    }

    Carousel.start();
  } catch (err) {
    console.error(" Failed to load breed data:", err);
  }
}

/**
 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */

axios.interceptors.request.use((config) => {
  console.log("Request started:", config.url);

  // Store start time
  config.metadata = { startTime: new Date() };

  return config;
});

axios.interceptors.response.use(
  (response) => {
    const endTime = new Date();
    const duration = endTime - response.config.metadata.startTime;

    console.log(
      `Response received from ${response.config.url} in ${duration} ms`
    );

    return response;
  },
  (error) => {
    console.log("Request failed");

    return Promise.reject(error);
  }
);
