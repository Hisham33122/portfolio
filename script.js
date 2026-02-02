// Scroll Reveal Animation
const revealElements = document.querySelectorAll(
  "section, .project-card, .certificate-card, .hero-image, .hero-content"
);

const revealOnScroll = () => {
  const windowHeight = window.innerHeight;
  revealElements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    if (elementTop < windowHeight - 80) {
      el.classList.add("show");
    }
  });
};

// Navbar scroll effect
const navbar = document.querySelector(".navbar");
const handleNavbarScroll = () => {
  if (navbar) {
    navbar.classList.toggle("scrolled", window.scrollY > 50);
  }
};

window.addEventListener("scroll", () => {
  revealOnScroll();
  handleNavbarScroll();
});
revealOnScroll();
handleNavbarScroll();
