const toggleButton = document.querySelector('.menu-toggle');
const sideMenu = document.querySelector('.side-menu');
const closeButton = document.querySelector('.close-menu');

toggleButton.addEventListener('click', () => {
  sideMenu.classList.add('open');
});

closeButton.addEventListener('click', () => {
  sideMenu.classList.remove('open');
});