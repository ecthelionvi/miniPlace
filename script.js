document.addEventListener('DOMContentLoaded', function() {
  let currentColor = '#000000';
  const grid = document.getElementById('grid');
  const colorBlocks = document.querySelectorAll('.colorBlock');
  const resetGridButton = document.getElementById('resetGrid');
  const saveButton = document.getElementById('saveGrid');

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

  saveButton.addEventListener('click', function() {
    html2canvas(document.getElementById('grid')).then(canvas => {

      let image = document.createElement('a');
      image.href = canvas.toDataURL('image/png');
      image.download = 'miniPlace-artwork.png';
      document.body.appendChild(image);
      image.click();
      document.body.removeChild(image);
    });
  });

  createGrid(30);
});
