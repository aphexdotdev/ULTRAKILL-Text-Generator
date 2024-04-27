// Backgrounds modal box
const modal = document.getElementById('modal')
const btn = document.getElementById('inputFile');

// Open when clicking button
btn.onclick = function () {
    modal.style.display = 'block';
}

// Close when clicking outside modal
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}
