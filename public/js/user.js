if(performance.navigation.type == 2){
    location.reload(true);
}


const main = document.querySelector('main')
const followForm = document.querySelector('.follow-form')
const followersText = document.querySelectorAll('.followers-text')
const followBtn = document.querySelector('.button')

if (followForm) {
    followForm.addEventListener('submit', async function(e) {
        e.preventDefault()
        try {
            const userId = this.getAttribute('action').substr(7, 24)
            const currentUserId = this.getAttribute('action').substr(39, 24)
            const req = await axios.post(`/users/${userId}/follow/${currentUserId}`)
            if (req.data.following) {
                followBtn.innerHTML = 'Unfollow'
                followBtn.classList.remove('follow-btn')
                followBtn.classList.add('unfollow-btn')
            } else {
                followBtn.innerHTML = 'Follow'
                followBtn.classList.remove('unfollow-btn')
                followBtn.classList.add('follow-btn')
            }
    
            for (let text of followersText) {
                text.innerHTML = req.data.followersLength
            }
        } catch (error) {
            main.innerHTML = `<h1 class="text-center">Error ${error.request.status}</h1>
                        <p class="text-center">Something went wrong. Please try again later.</p>
                        `
        }

    })
}