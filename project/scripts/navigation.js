const menuButton = document.getElementById('menu');
const navigation = document.querySelector('.navigation');

menuButton.addEventListener('click', () => {
  navigation.classList.toggle('open');
  // toggle icon between ☰ and ✕
  menuButton.textContent = navigation.classList.contains('open') ? '✕' : '☰';
});
