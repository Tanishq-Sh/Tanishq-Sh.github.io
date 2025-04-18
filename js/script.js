function toggleDescription(item) {
    const openItem = document.querySelector('.timeline-item.open');
    if (openItem && openItem !== item) {
      openItem.classList.remove('open');
    }
    item.classList.toggle('open');
  }
  