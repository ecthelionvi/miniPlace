document.addEventListener('DOMContentLoaded', function() {
  let currentColor = '#000000';
  const grid = document.getElementById('grid');
  const colorBlocks = document.querySelectorAll('.colorBlock');
  const resetGridButton = document.getElementById('resetGrid');

  colorBlocks.forEach(block => {
    block.addEventListener('click', function() {
      colorBlocks.forEach(block => block.classList.remove('selected'));
      this.classList.add('selected');
      currentColor = this.style.backgroundColor;
    });
  });

  function createGrid(size) {
    grid.innerHTML = '';
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < size * size; i++) {
      const pixel = document.createElement('div');
      pixel.addEventListener('click', function() {
        this.style.backgroundColor = currentColor;
      });
      fragment.appendChild(pixel);
    }

    grid.appendChild(fragment);
  }

  resetGridButton.addEventListener('click', () => createGrid(30));
  createGrid(30);
});
