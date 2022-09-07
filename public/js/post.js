if(performance.navigation.type == 2){
    location.reload(true);
 }

 const main = document.querySelector('main')


// three dots popup functionality

const threeDots = document.querySelector('#three-dots')
const darkBg = document.querySelector('.dark-bg')
const body = document.querySelector('body')
const closeBtn = document.querySelector('#close')

if (threeDots) {
    threeDots.addEventListener('click', function() {
        darkBg.classList.remove('d-none')
        darkBg.classList.add('d-block')
    
        const popup = this.nextElementSibling;
        popup.classList.remove('d-none')
        popup.classList.add('d-block')
        body.classList.add('fixed')
    })
    
    closeBtn.addEventListener('click', function() {
        darkBg.classList.add('d-none')
        darkBg.classList.remove('d-block')
    
        const popup = this.parentElement.parentElement
        popup.classList.add('d-none')
        popup.classList.remove('d-block')
    
        body.classList.remove('fixed')
    })
}

// like btn functionality

const likeBtn = document.querySelector('.like-btn')
const likesText = document.querySelector('.likes-text')

likeBtn.addEventListener('click', async function() {
    const postId = this.parentElement.parentElement.parentElement.id
    try {
        const req = await axios.post(`/posts/${postId}/likes`)
        if (req.data.like === 'like') {
            likeBtn.classList.add('liked')
            likeBtn.classList.remove('unliked')
        } else {
            likeBtn.classList.add('unliked')
            likeBtn.classList.remove('liked')
        }
    
        if (req.data.likesLength === 1) {
            likesText.innerHTML = '1 like'
        } else {
            likesText.innerHTML = `${req.data.likesLength} likes`
        }
    } catch (error) {
        main.innerHTML = `<h1 class="text-center">Error ${error.request.status}</h1>
                        <p class="text-center">Something went wrong. Please try again later.</p>
                        `
    }
})


// comment functionality

// when you click on comment icon focus on the text area

const cmntIcon = document.querySelector('.comment-icon')

cmntIcon.addEventListener('click', function() {
    const textarea = document.querySelector('.cmnt-inp')
    textarea.focus()
})


// click on view comments and big comments section will popup 

const viewCmnts = document.querySelector('.view-cmnts')

viewCmnts.addEventListener('click', function() {
    const bigCmntsSect = document.querySelector('.cmnts-big')
    bigCmntsSect.classList.add('d-block')
    bigCmntsSect.classList.remove('d-none')

    darkBg.classList.remove('d-none')
    darkBg.classList.add('d-block')
    
    body.classList.add('fixed')
})

const closeCmnts = document.querySelector('.close-cmnts')

closeCmnts.addEventListener('click', function() {
    const bigCmntsSect = document.querySelector('.cmnts-big')
    bigCmntsSect.classList.remove('d-block')
    bigCmntsSect.classList.add('d-none')

    darkBg.classList.add('d-none')
    darkBg.classList.remove('d-block')
    
    body.classList.remove('fixed')
})



// posting a comment 

const cmntForm = document.querySelector('.cmnt-form')

cmntForm.addEventListener('submit', async function(e) {
    e.preventDefault()
    try {
        const postId = this.parentElement.parentElement.id
        const cmntText = this.children[0].value
        const req = await axios.post(`/posts/${postId}/comments`, {
            text: cmntText
        })
        const cmnt = req.data.comment
        const viewCmnts = document.querySelector('.view-cmnts')
        createUserCmnt(cmnt, postId)
        createBigCmnt(cmnt, postId)
        addViews(req.data.commentsLength, viewCmnts)
    
        this.children[0].value = ''
    } catch (error) {
        main.innerHTML = `<h1 class="text-center">Error ${error.request.status}</h1>
                        <p class="text-center">Something went wrong. Please try again later.</p>
                        `
    }
})


function createUserCmnt(cmnt, postId) {
    const div = document.createElement('div')
    div.classList.add('d-flex', 'align-items-center', 'mb-0', 'justify-content-between')
    div.setAttribute('id', cmnt._id)
    div.innerHTML = `
    <p class="mb-0"><a href="/users/${cmnt.author._id}" class="user-links"><strong>${cmnt.author.username}</strong></a> ${cmnt.text}</p>

    <form action="/posts/${postId}/comments/${cmnt._id}?_method=DELETE" method="POST" class="delete">
        <button class="delete-cmnt ms-3 p-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
        </button>
    
    </form>`

    const deleteForm = div.children[1]
    deleteCommentEvent(deleteForm, '.cmnts')


    const userCmntsSect = document.querySelector('.user-cmnts')
    userCmntsSect.append(div)
}

function createBigCmnt(comment, postId) {
    const div = document.createElement('div')
    div.classList.add('d-flex', 'align-items-center', 'mb-3', 'justify-content-between')
    div.setAttribute('id', comment._id)

    div.innerHTML = `
    <div class="d-flex align-items-center">
    <a href="/users/${comment.author._id}"><img src="${comment.author.profilePic.url}" class="sm-profile-pic me-2"></a>
    <p class="mb-0"><a href="/users/${comment.author._id}" class="user-links"><strong>${comment.author.username}</strong></a> ${comment.text}</p>
    </div>

    
    <form action="/posts/${postId}/comments/${comment._id}?_method=DELETE" method="POST" class="delete-cmnt-form">
        <button class="delete-cmnt ms-3 p-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
                <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
            </svg>
        </button>
    
    </form>`

    const deleteForm = div.children[1]
    deleteCommentEvent(deleteForm, '.user-cmnts')


    const cmntsSect = document.querySelector('.cmnts')
    cmntsSect.append(div)
}

function userCmntsDelete() {
    const cmntSect = document.querySelector('.user-cmnts')
    const userCmnts = cmntSect.children
    for (let cmnt of userCmnts) {
        const deleteForm = cmnt.children[1]
        deleteCommentEvent(deleteForm, '.cmnts')
    }
}

userCmntsDelete()

function bigCmntsDelete() {
    const cmntSect = document.querySelector('.cmnts')

    const userCmnts = cmntSect.children
    for (let cmnt of userCmnts) {
        const deleteForm = cmnt.children[1]
        deleteCommentEvent(deleteForm, '.user-cmnts')
    }
}

bigCmntsDelete()

function deleteViews(cmntsLength, viewCmnts) {
    if (viewCmnts.innerHTML === 'View 2 comments') {
        viewCmnts.innerHTML = 'View 1 Comment'
    } else if (viewCmnts.innerHTML === 'View 1 Comment') {
        viewCmnts.innerHTML = 'No comments'
    } else {
        viewCmnts.innerHTML = `View ${cmntsLength} comments`
    }
}

function addViews(cmntsLength, viewCmnts) {
    if (viewCmnts.innerHTML === 'No comments') {
        viewCmnts.innerHTML = 'View 1 Comment'
    } else {
        viewCmnts.innerHTML = `View ${cmntsLength} comments`
    }

}

function deleteCommentEvent(deleteForm, cmntSection) {
    deleteForm.addEventListener('submit', async function(e) {
        e.preventDefault()
        try {
            const post = document.querySelector('.post')
            const postId = post.getAttribute('id')
            const commentId = deleteForm.parentElement.getAttribute('id')
            deleteForm.parentElement.remove()
            const req = await axios.delete(`/posts/${postId}/comments/${commentId}`)
            const cmntSect = document.querySelector(cmntSection)
            const userCmnts = cmntSect.children
            for (let cmnt of userCmnts) {
                if (cmnt.getAttribute('id') === commentId) {
                    cmnt.remove()
                }
            }
    
            const viewCmnts = document.querySelector('.view-cmnts')
            deleteViews(req.data.commentsLength, viewCmnts)
        } catch (error) {
            main.innerHTML = `<h1 class="text-center">Error ${error.request.status}</h1>
                        <p class="text-center">Something went wrong. Please try again later.</p>
                        `
        }
        
        
    })
}