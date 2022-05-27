import './sass/main.scss';
import Pagination from 'tui-pagination';
import 'tui-pagination/dist/tui-pagination.css';
import apiService from "./js/api";
import renderGallery from './js/render_images'

const galleryEl = document.querySelector('.gallery');
const formEl = document.querySelector('.search-form');

let searchQuery = '';

const options = {
  totalItems: 0,
  itemsPerPage: 3,
  visiblePages: 10,
  page: 1,
};


apiService.itemsPerPage = options.itemsPerPage;



const pagination = new Pagination('pagination', options);
// console.dir(pagination);

const page = pagination.getCurrentPage();


apiService.fetchPopularImages(page).then(({ images, total }) => {
   const markup = renderGallery(images);
    galleryEl.insertAdjacentHTML('beforeend', markup);
  pagination.reset(total);
});

function popular(event) {
  const currentPage = event.page;
  apiService.fetchPopularImages(currentPage).then(({ images, total }) => {
    const markup = renderGallery(images);
    galleryEl.insertAdjacentHTML('beforeend', markup);
  });
}

pagination.on('afterMove', popular);

formEl.addEventListener('submit', onFormSubmit);

function onFormSubmit(event) {
  event.preventDefault();

  galleryEl.innerHTML = '';

  pagination.off('afterMove', popular);
  pagination.movePageTo(1);
  pagination.on('afterMove', bySearch);

  apiService.searchQuery = event.currentTarget.elements.searchQuery.value;
  
  apiService.fetchImagesByName(page).then(({ images, total }) => {
   const markup = renderGallery(images);
    galleryEl.insertAdjacentHTML('beforeend', markup);
    pagination.reset(total);
  });
}

function bySearch(event) {
  const currentPage = event.page;
  apiService.fetchImagesByName(currentPage).then(({ images }) => {
     const markup = renderGallery(images);
    galleryEl.insertAdjacentHTML('beforeend', markup);
  });
}
