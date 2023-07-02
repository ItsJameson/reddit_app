let output = document.getElementById('output');
let errorOutput = document.getElementById('error');
let submitButton = document.getElementById('submit-button');
let videoCount = document.getElementById('video-count');
let userChoices = document.getElementById('user-choices');

submitButton.addEventListener('click', () => {

    output.textContent = "Loading please wait..."
    videoCount.textContent = "";
    userChoices.textContent = "";
    errorOutput.textContent = "";
});

let topSortTypeContainer = document.getElementById('topSortTypeContainer');
let sortTypeDropDown = document.getElementById('sortType-dropDown');

sortTypeDropDown.addEventListener('click', function () {

    if (sortTypeDropDown.value == 'top') {
        topSortTypeContainer.style.display = 'block';
    }
    else {
        topSortTypeContainer.style.display = 'none';
    }
});


document.querySelectorAll('video').forEach((element) => {
    element.addEventListener('play', function () {
        let audioFile = element.nextElementSibling;
        audioFile.play();
        audioFile.currentTime = element.currentTime;
    });
    element.addEventListener('pause', function () {
        let audioFile = element.nextElementSibling;
        audioFile.pause();
        audioFile.currentTime = element.currentTime;
    });
    element.addEventListener('seeking', function () {
        let audioFile = element.nextElementSibling;
        audioFile.currentTime = element.currentTime;
    })
})