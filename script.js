const images = [];

function generateGrid() {
    const fileInput = document.getElementById('fileInput');
    const photoGrid = document.getElementById('photoGrid');
    photoGrid.innerHTML = '';
    images.length = 0; // Reset array images

    const files = fileInput.files;
    if (files.length === 0) {
        alert('Silakan unggah foto terlebih dahulu.');
        return;
    }

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.src = event.target.result;
            img.onload = function() {
                images.push(img);
                const imgElement = document.createElement('img');
                imgElement.src = event.target.result;
                photoGrid.appendChild(imgElement);

                // Mengatur grid berdasarkan jumlah gambar
                const totalImages = images.length;
                const gridSize = Math.ceil(totalImages / 2);

                // Jika jumlah gambar ganjil, ambil gambar terakhir untuk mengisi dua grid
                if (totalImages % 2 === 1 && totalImages === files.length) {
                    const doubleImgElement = document.createElement('img');
                    doubleImgElement.src = images[totalImages - 1].src; // Menggunakan gambar terakhir
                    doubleImgElement.classList.add('double'); // Tambahkan kelas untuk gambar ganda
                    photoGrid.appendChild(doubleImgElement);
                }

                photoGrid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
                
                createCombinedImage();
            };
        };
        reader.readAsDataURL(file);
    });
}

function createCombinedImage() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    const imgSize = 200;
    const totalImages = images.length + (images.length % 2 === 1 ? 1 : 0); 

    const gridSize = Math.ceil(totalImages / 2);
    canvas.width = gridSize * imgSize;
    canvas.height = Math.ceil(totalImages / gridSize) * imgSize;

    images.forEach((img, index) => {
        const x = (index % gridSize) * imgSize;
        const y = Math.floor(index / gridSize) * imgSize;
        ctx.drawImage(img, x, y, imgSize, imgSize);
    });


    if (images.length % 2 === 1) {
        const lastIndex = images.length - 1;
        const x = (lastIndex % gridSize) * imgSize;
        const y = Math.floor(lastIndex / gridSize) * imgSize;
        ctx.drawImage(images[lastIndex], x, y, imgSize * 2, imgSize); 
    }

    
    let quality = 1.0; 
    let combinedImageDataURL = canvas.toDataURL('image/jpeg', quality);

    
    while (getBase64Size(combinedImageDataURL) > 1 * 1024 * 1024 && quality > 0) {
        quality -= 0.1; 
        combinedImageDataURL = canvas.toDataURL('image/jpeg', quality);
    }

    
    const combinedImage = document.getElementById('combinedImage');
    combinedImage.src = combinedImageDataURL;
    combinedImage.style.display = 'block';
}

function getBase64Size(base64String) {
    return (base64String.length * 3) / 4 - (base64String.endsWith('==') ? 2 : base64String.endsWith('=') ? 1 : 0);
}

function downloadCombinedImage() {
    const canvas = document.getElementById('canvas');
    const link = document.createElement('a');
    link.download = 'combined-image.png';
    link.href = canvas.toDataURL('image/jpeg', 1.0); // Menggunakan kualitas maksimal saat unduh
    link.click();
}