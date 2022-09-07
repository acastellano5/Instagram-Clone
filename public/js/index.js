if(performance.navigation.type == 2){
    location.reload(true);
}

// three dots and pop up functionality
const body = document.querySelector('body')
const main = document.querySelector('main')
const threeDots = document.querySelectorAll('#three-dots')
const darkBg = document.querySelector('.dark-bg')
const popups = document.querySelectorAll('.popup')
const closeBtns = document.querySelectorAll('.close')


for (let el of threeDots) {
    el.addEventListener('click', function () {
        darkBg.classList.remove('d-none')
        darkBg.classList.add('d-block')

        const popup = this.nextElementSibling;
        popup.classList.remove('d-none')
        popup.classList.add('d-block')
        body.classList.add('fixed')
    })
}

for (let close of closeBtns) {
    close.addEventListener('click', function() {
        darkBg.classList.add('d-none')
        darkBg.classList.remove('d-block')

        const popup = this.parentElement.parentElement
        popup.classList.add('d-none')
        popup.classList.remove('d-block')

        body.classList.remove('fixed')
    })
}

const config = {
    headers: {
        'X-Requested-With': 'XMLHttpRequest'
    }
}

// posting comment functionality

const cmntForms = document.querySelectorAll('.cmnt-form')

for (let form of cmntForms) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault()
        try {
            const postId = this.parentElement.parentElement.id
            let cmntText = this.children[0].value;
            const postedCmnt = await postComment(postId, cmntText)
            if (postedCmnt.data.redirect) {
                window.location = `${postedCmnt.data.redirect}`
            } else {
                const viewCmnts = this.parentElement.previousElementSibling.children[3]
                postViewCmnts(postedCmnt.data.commentsLength, viewCmnts)
                const bigCommentSect = this.parentElement.parentElement.parentElement.nextElementSibling.children[3]
                uploadNewComment(bigCommentSect, postedCmnt.data.comment, postId)





                



                const cmnt = postedCmnt.data.comment
                const postCmntSect = this.parentElement.previousElementSibling.children[4]
                const div = document.createElement('div')
                const cmntId = cmnt._id
                div.classList.add('d-flex', 'align-items-center', 'mb-3', 'justify-content-between', cmntId)
                const newCmnt = `<p class="mb-0"><a href="/users/${postedCmnt.data.comment.author._id}" class="user-links"><strong>${cmnt.author.username}</strong> </a>${cmnt.text}</p>

                    <form action="/posts/${postId}/comments/${cmnt._id}?_method=DELETE" method="POST" class="delete">
                        <button class="delete-cmnt ms-3 p-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
                            </svg>
                        </button>
                    </form>`
                div.innerHTML = newCmnt
                postCmntSect.append(div)

                const deleteForm = div.children[1]

                deleteForm.addEventListener('submit', async function(e) {
                    e.preventDefault()
                    try {
                        const req = await axios.delete(`/posts/${postId}/comments/${cmnt._id}`)
                        this.parentElement.remove()
                        const deleteCmntForms = document.querySelectorAll('.delete-cmnt-form')
                        for (let form of deleteCmntForms) {
                            const bigCmntId = form.getAttribute('action').substr(41, 24)

                            if (cmnt._id === bigCmntId) {
                                form.parentElement.remove()
                            }
                        }

                        deleteViewCmnts(req.data.commentsLength, viewCmnts)
                    } catch (error) {
                        main.innerHTML = `<h1 class="text-center">Error ${error.request.status}</h1>
                        <p class="text-center">Something went wrong. Please try again later.</p>
                        `
                    }
                    
                })

            








                this.children[0].value = ''
            }
        } catch (error) {
            main.innerHTML = `<h1 class="text-center">Error ${error.request.status}</h1>
                        <p class="text-center">Something went wrong. Please try again later.</p>
                        `
        }
    })
}

const deleteUserComments = document.querySelectorAll('form.delete')

for (let form of deleteUserComments) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault()
        try {
            const postId = this.getAttribute('action').substr(7, 24)
            const commentId = this.getAttribute('action').substr(41, 24)
            const viewCmnts = this.parentElement.parentElement.previousElementSibling
            const req = await axios.delete(`/posts/${postId}/comments/${commentId}`)
            this.parentElement.remove()
            const deleteCmntForms = document.querySelectorAll('.delete-cmnt-form')
            for (let form of deleteCmntForms) {
                const bigCmntId = form.getAttribute('action').substr(41, 24)

                if (commentId === bigCmntId) {
                    form.parentElement.remove()
                }
            }

            deleteViewCmnts(req.data.commentsLength, viewCmnts)
        } catch (error) {
            main.innerHTML = `<h1 class="text-center">Error ${error.request.status}</h1>
                        <p class="text-center">Something went wrong. Please try again later.</p>
                        `
        }
        
    })
}



async function postComment(postId, cmntText) {
    const result = await axios.post(`/posts/${postId}/comments`, {
        text: `${cmntText}`
    }, config)

    return result
}

function postViewCmnts(cmnts, viewCmnts) {
    if (viewCmnts.innerHTML === 'No comments') {
        viewCmnts.innerHTML = 'View 1 comment'
        viewCmntsFunc()

    } else {
        viewCmnts.innerHTML = `View all ${cmnts} comments`
    }
}

function uploadNewComment(cmntsSect, cmnt, postId) {
    const div = document.createElement('div')
    const cmntId = cmnt._id

    
    div.classList.add('d-flex', 'align-items-center', 'mb-3', 'justify-content-between', cmntId)
    const newCmnt = `
    <div class="d-flex">
        <a href="/users/${cmnt.author._id}"><img src="${cmnt.author.profilePic.url}" class="sm-profile-pic me-2"></a>

        <p class="mb-0"><a href="/users/${cmnt.author._id}" class="user-links"><strong>${cmnt.author.username}</strong></a> ${cmnt.text}</p>
    </div>

    <form action="/posts/${postId}/comments/${cmnt._id}?_method=DELETE" method="POST" class="delete-cmnt-form">
        <button class="delete-cmnt ms-3 p-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
        </button>
    
    </form>`
    div.innerHTML = newCmnt
    cmntsSect.append(div)
    const deleteCmntForm = div.children[1]
    deleteCmntForm.addEventListener('submit', async function(e) {
        e.preventDefault()
        try {
            // getting ids from form
            const postId = this.getAttribute('action').substr(7, 24)
            const commentId = this.getAttribute('action').substr(41, 24)
            // making the delete request via axios
            const result = await deleteComment(postId, commentId)
            if (result.data.redirect) {
                window.location = `${result.data.redirect}`
            } else {
                const viewCmnt = this.parentElement.parentElement.parentElement.previousElementSibling.children[0].children[2].children[3]
                const smCmntSect = this.parentElement.parentElement.parentElement.previousElementSibling.children[0].children[2].children[4].children
                for (let cmnt of smCmntSect) {
                    const smCmntId = cmnt.children[1].getAttribute('action').substr(41, 24)
                    if (smCmntId === commentId) {
                        cmnt.remove()
                    }
                }
                // gets rid of comment div from DOM
                this.parentElement.remove()
                deleteViewCmnts(result.data.commentsLength, viewCmnt)
            }
        } catch (error) {
            main.innerHTML = `<h1 class="text-center">Error ${error.request.status}</h1>
                        <p class="text-center">Something went wrong. Please try again later.</p>
                        `
        }
    })
}

// view all comments functionality

function viewCmntsFunc() {
    const viewCmntsBtn = document.querySelectorAll('.view-cmnts')

    for (let btn of viewCmntsBtn) {
        btn.addEventListener('click', function() {
            const cmntsSect = this.parentElement.parentElement.parentElement.nextElementSibling
            cmntsSect.classList.remove('d-none')
            cmntsSect.classList.add('d-block')
    
            darkBg.classList.remove('d-none')
            darkBg.classList.add('d-block')
    
            body.classList.add('fixed')
        })
    }
    
    const closeCmnts = document.querySelectorAll('.close-cmnts')
    
    for (let close of closeCmnts) {
        close.addEventListener('click', function() {
            const cmntsSect = this.parentElement.parentElement
            cmntsSect.classList.remove('d-block')
            cmntsSect.classList.add('d-none')
    
            darkBg.classList.add('d-none')
            darkBg.classList.remove('d-block')
    
            body.classList.remove('fixed')
        })
    }
}

viewCmntsFunc()

// comments icon functionality

const cmntIcon = document.querySelectorAll('.cmnt-icon') 

for (let btn of cmntIcon) {
    btn.addEventListener('click', function() {
        const textarea = this.parentElement.parentElement.parentElement.children[3].children[0].children[0]
        textarea.focus()
    })
}

// deleting comments 

function addDeleteFunc() {
const deleteCmntForms = document.querySelectorAll('.delete-cmnt-form')


for (let form of deleteCmntForms) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault()
        try {
            // getting ids from form
            const postId = this.getAttribute('action').substr(7, 24)
            const commentId = this.getAttribute('action').substr(41, 24)
            // making the delete request via axios
            const result = await deleteComment(postId, commentId)
            if (result.data.redirect) {
                window.location = `${result.data.redirect}`
            } else {
                const viewCmnt = this.parentElement.parentElement.parentElement.previousElementSibling.children[0].children[2].children[3]
                const smCmntSect = this.parentElement.parentElement.parentElement.previousElementSibling.children[0].children[2].children[4].children
                for (let cmnt of smCmntSect) {
                    const smCmntId = cmnt.children[1].getAttribute('action').substr(41, 24)
                    if (smCmntId === commentId) {
                        cmnt.remove()
                    }
                }
                // gets rid of comment div from DOM
                this.parentElement.remove()
                deleteViewCmnts(result.data.commentsLength, viewCmnt)
            }
        } catch (error) {
            main.innerHTML = `<h1 class="text-center">Error ${error.request.status}</h1>
                        <p class="text-center">Something went wrong. Please try again later.</p>
                        `
        }
    })
}

}

// makes delete request
async function deleteComment(postId, commentId) {
    const result = await axios.delete(`/posts/${postId}/comments/${commentId}`, config)
    return result
}

addDeleteFunc()


function deleteViewCmnts(cmnts, viewCmnts) {
    if (viewCmnts.innerHTML === 'View 1 comment') {
        viewCmnts.innerHTML = 'No comments'
    } else if (viewCmnts.innerHTML === 'View all 2 comments') {
        viewCmnts.innerHTML = 'View 1 comment'
    } else {
        viewCmnts.innerHTML = `View all ${cmnts} comments`
    }
}








// deleting post

const deletePostForms = document.querySelectorAll('.delete-post')
deletePostForms.forEach(function(form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault()
        try {
            const postId = this.getAttribute('action').substr(7, 24)
            const result = await axios.delete(`/posts/${postId}`, config)
            if (result.data.redirect) {
                window.location = `${result.data.redirect}`
            } else {
                darkBg.classList.add('d-none')
                darkBg.classList.remove('d-block')

                const popup = this.parentElement.parentElement
                popup.classList.add('d-none')
                popup.classList.remove('d-block')

                body.classList.remove('fixed')

                const post = this.parentElement.parentElement.parentElement.parentElement.parentElement
                post.remove()
            }
        } catch (error) {
            main.innerHTML = `<h1 class="text-center">Error ${error.request.status}</h1>
                        <p class="text-center">Something went wrong. Please try again later.</p>
                        `
        }
    })
})


// like btn functionality 

const likeBtns = document.querySelectorAll('.like-btn')

for (let likeBtn of likeBtns) {
    likeBtn.addEventListener('click', async function () {
        try {
            const postId = this.parentElement.parentElement.parentElement.id
            const req = await axios.post(`/posts/${postId}/likes`)
            if (req.data.redirect) {
                window.location = req.data.redirect
            } else {
                const likesDisplay = this.parentElement.nextElementSibling.children[0]
                if (req.data.like === 'like') {
                    this.classList.remove('unlike')
                    this.classList.add('like')

                    if (likesDisplay.innerHTML === '0 likes') {
                        likesDisplay.innerHTML = '1 like'
                    } else {
                        likesDisplay.innerHTML = `${req.data.likesLength} likes`
                    }
                } else if (req.data.like === 'unlike') {
                    this.classList.remove('like')
                    this.classList.add('unlike')

                    if (likesDisplay.innerHTML === '2 likes') {
                        likesDisplay.innerHTML = '1 like'
                    } else {
                        likesDisplay.innerHTML = `${req.data.likesLength} likes`
                    }
                }
            }
        } catch (error) {
            main.innerHTML = `<h1 class="text-center">Error ${error.request.status}</h1>
                        <p class="text-center">Something went wrong. Please try again later.</p>
                        `
        }
        
    })
}





const followForms = document.querySelectorAll('.follow-form')


for (let form of followForms) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault()
        try {
            const btn = this.children[0]
            const userId = this.getAttribute('action').substr(7, 24)
            const currentUserId = this.getAttribute('action').substr(39, 24)
            const req = await axios.post(`/users/${userId}/follow/${currentUserId}`)
            if (req.data.following) {
                btn.classList.remove('follow-btn')
                btn.classList.add('unfollow-btn')
                btn.innerHTML = 'Unfollow'
            } else {
                btn.classList.remove('unfollow-btn')
                btn.classList.add('follow-btn')
                btn.innerHTML = 'Follow'
            }
        } catch (error) {
            main.innerHTML = `<h1 class="text-center">Error ${error.request.status}</h1>
                        <p class="text-center">Something went wrong. Please try again later.</p>
                        `
        }
    })
}