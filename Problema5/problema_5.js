$(function () {
    const images = [
        {
            src: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
            link: "https://www.google.com"
        },
        {
            src: "https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png",
            link: "https://mail.google.com"
        },
        {
            src: "https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg",
            link: "https://www.facebook.com"
        },
        {
            src: "https://upload.wikimedia.org/wikipedia/commons/0/08/Pinterest-logo.png",
            link: "https://www.pinterest.com"
        },
        {
            src: "https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg",
            link: "https://www.instagram.com"
        }
    ];

    let currentIndex = 0;
    const intervalTime = 5000;
    let interval;

    function showImage(index) {
        $('#carousel-image').attr('src', images[index].src);
        $('#carousel-link').attr('href', images[index].link);
    }

    function nextImage() {
        currentIndex = (currentIndex + 1) % images.length;
        showImage(currentIndex);
    }

    function prevImage() {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        showImage(currentIndex);
    }

    $('#next').on('click', function () {
        nextImage();
        resetInterval();
    });

    $('#prev').on('click', function () {
        prevImage();
        resetInterval();
    });

    function resetInterval() {
        clearInterval(interval);
        interval = setInterval(nextImage, intervalTime);
    }

    // Start
    showImage(currentIndex);
    interval = setInterval(nextImage, intervalTime);
});
