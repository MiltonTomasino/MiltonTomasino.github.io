let slideIndices = [1, 1, 1];

showSlides(1, 'C1', 0);
showSlides(1, 'C2', 1);
showSlides(1, 'C3', 2);

function plusSlides(n, carouselClass, carouselIndex) {
    showSlides(slideIndices[carouselIndex] += n, carouselClass, carouselIndex);
}

function showSlides(n, carouselClass, carouselIndex) {
    let i;
    let slides = document.getElementsByClassName(carouselClass);

    if (n > slides.length) {
        slideIndices[carouselIndex] = 1;
    }
    if (n < 1) {
        slideIndices[carouselIndex] = slides.length;
    }

    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndices[carouselIndex] - 1].style.display = "block";
}
