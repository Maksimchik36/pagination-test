import './sass/main.scss';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';

const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('.search-form');

let searchQuery = '';

const options = {
  totalItems: 0,
  itemsPerPage: 3,
  visiblePages: 10,
  page: 1,
};

const pagination = new Pagination('pagination', options);
console.dir(pagination);

const page = pagination.getCurrentPage();

fetchPopularImages(page).then(({ images, total }) => {
  renderGallery(images);
  pagination.reset(total);
});

function popular(event) {
  const currentPage = event.page;
  fetchPopularImages(currentPage).then(({ images, total }) => {
    renderGallery(images);
    // pagination.reset(total);
  });
}

function fetchPopularImages(page) {
  console.log(page);
  return fetch(
    `https://pixabay.com/api/?key=23788919-1e868a4f1ae72234cc449d190&q=yellow+flowers&image_type=photo&page=${page}&per_page=${options.itemsPerPage}`,
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => ({ images: data.hits, total: data.totalHits }));
}

pagination.on('afterMove', popular);

function renderGallery(images) {
  const murkup = images
    .map(image => {
      const { largeImageURL, webformatURL, tags, likes, views, comments, downloads } = image;
      return `<a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" width="250"/>
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>`;
    })
    .join('');
  galleryEl.insertAdjacentHTML('beforeend', murkup);
}

formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();

  galleryEl.innerHTML = '';

  pagination.off('afterMove', popular);
  pagination.movePageTo(1);
  pagination.on('afterMove', bySearch);

  searchQuery = event.currentTarget.elements.searchQuery.value;
  console.log(searchQuery);
  fetchImagesByName(page, searchQuery).then(({ images, total }) => {
    renderGallery(images);
    pagination.reset(total);
  });
}

function fetchImagesByName(page, query) {
  console.log(page);
  return fetch(
    `https://pixabay.com/api/?key=23788919-1e868a4f1ae72234cc449d190&q=${query}&image_type=photo&page=${page}&per_page=${options.itemsPerPage}`,
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => ({ images: data.hits, total: data.totalHits }));
}

function bySearch(event) {
  const currentPage = event.page;
  fetchImagesByName(currentPage, searchQuery).then(({ images, total }) => {
    renderGallery(images);
  });
}
