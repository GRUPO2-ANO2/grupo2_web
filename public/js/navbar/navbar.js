window.addEventListener('scroll', function() {
    const navbar = document.querySelector('#mainNav');
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
});