
const BASE_URL = 'https://pixabay.com/api/';
const KEY = '23788919-1e868a4f1ae72234cc449d190';


export default {

 itemsPerPage: 0, 
    searchQuery: '',
fetchPopularImages(page) {
  console.log(page);
  return fetch(
    `${BASE_URL}?key=${KEY}&q=yellow+flowers&image_type=photo&page=${page}&per_page=${this.itemsPerPage}`,
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => ({ images: data.hits, total: data.totalHits }));
},


fetchImagesByName(page) {

  return fetch(
    `${BASE_URL}?key=${KEY}&q=${this.searchQuery}&image_type=photo&page=${page}&per_page=${this.itemsPerPage}`,
  )
    .then(response => {
      if (!response.ok) {
        throw new Error(response.status);
      }
      return response.json();
    })
    .then(data => ({ images: data.hits, total: data.totalHits }));
}}