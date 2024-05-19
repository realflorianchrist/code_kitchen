const loader = document.getElementById('loading');

export function displayLoader() {
    loader.classList.add('display');
}

export function hideLoader() {
    loader.classList.remove('display');
}