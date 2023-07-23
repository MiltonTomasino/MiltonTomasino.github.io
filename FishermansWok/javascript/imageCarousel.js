let slideIndex = 1;

showSlides(slideIndex);

// goes to next image
function plusSlides(n){
    showSlides(slideIndex += n);
}

function showSlides(n){
    let i;
    let slides = document.getElementsByClassName("picture"); // gets image elements
    let text = document.getElementsByClassName("box"); // gets item descritpion elements
    if (n > slides.length){slideIndex = 1;} // if inputed # is greater than the # of images, reset to 1
    if (n < 1){slideIndex = slides.length;} // if inputed # is less than 1, SI is on the last image in index + 1

    // loops through slides and hides the images not in use
    for (let i = 0; i < slides.length; i++){
        slides[i].style.display = "none";
    }

    // loops through boxes and hides boxes not in use
    for(let i = 0; i < text.length; i++){
        text[i].style.display = "none";
    }

    // shows current image on screen
    slides[slideIndex - 1].style.display = "block";
    text[slideIndex - 1].style.display = "block";
}