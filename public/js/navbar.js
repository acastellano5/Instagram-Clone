const searchField = document.querySelector('.search-field')
const searchIcon = document.querySelector('.search-icon')

searchIcon.addEventListener('click', () => {
    searchField.focus()
})

const searchToggle = document.querySelector('.search-toggle')
const searchContainer = document.querySelector('.black-cover')
const closeSearch = document.querySelector('.close-search')

searchToggle.addEventListener('click', function() {
    searchContainer.classList.remove('d-none')
    searchContainer.classList.add('d-flex')
})

closeSearch.addEventListener('click', function() {
    searchContainer.classList.remove('d-flex')
    searchContainer.classList.add('d-none')
})