let pixels = makeArray(document.getElementsByClassName('pixel'));

(function setColor() {
    for (let i = 0; i < pixels.length; i++) {
        pixels[i].style.backgroundColor = `rgb(${Math.floor(Math.random() * 255) + 1}, ${Math.floor(Math.random() * 255) + 1}, ${Math.floor(Math.random() * 255) + 1})`;
    }
    setTimeout(function () {
        setColor();
    }, 1000);
})();

function makeArray(r) {
    return [].slice.call(r,
        0);
}
