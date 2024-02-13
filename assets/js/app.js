let cl = console.log;
let postForm = document.getElementById("postForm");
let title = document.getElementById("title");
let body = document.getElementById("body");
let userId = document.getElementById("userId");
let postContainer = document.getElementById("postContainer");
let submitBtn = document.getElementById("submitBtn");
let updateBtn = document.getElementById("updateBtn");
let baseUrl = `https://jsonplaceholder.typicode.com`;
let postUrl = `${baseUrl}/posts`
let PostArray = [];
//XMLHTTPTrEQUEST>>  it is a constructor function
const onEdit = (ele) => {
    cl(ele);
    let getId = ele.closest(".card").id;
    cl(getId);
    localStorage.setItem("editId", getId)
    let getObjUrl = `${baseUrl}/posts/${getId}`
    cl(getObjUrl);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", getObjUrl, true);
    xhr.send();
    xhr.onload = function() {
        if (xhr.status === 200) {
            cl(xhr.response);
            let getObj = JSON.parse(xhr.response);
            title.value = getObj.title;
            body.value = getObj.body;
            userId.value = getObj.userId;
            updateBtn.classList.remove('d-none');
            submitBtn.classList.add('d-none')
        }
    }
}
const onDelete = (ele) => {
        cl(ele)
        let getDeleteId = ele.closest('.card').id;
        cl(getDeleteId)
        let deleteUrl = `${baseUrl}/posts/${getDeleteId}`;
        let xhr = new XMLHttpRequest()
        xhr.open("DELETE", deleteUrl);
        xhr.send()
        xhr.onload = function() {
            if (xhr.status === 200) {
                cl(xhr.response)
                let card = document.getElementById(getDeleteId)
                cl(card)
                    // card.remove()
                Swal.fire({
                    title: "Do you want to Delete",
                    showDenyButton: true,
                    confirmButtonText: "Yes",
                    denyButtonText: `No`
                }).then((result) => {
                    /* Read more about isConfirmed, isDenied below */
                    if (result.isConfirmed) {
                        card.remove()
                        Swal.fire("Deleted!", "", "success");
                    } else if (result.isDenied) {
                        Swal.fire("Post are not Deleted", "", "info");
                    }
                });
            }
        }


    }
    //3 Templating
const templating = (arr) => {
    let result = ``;
    arr.forEach(ele => {
        result += `
        <div class="card text-center mb-4" id="${ele.id}">
        <div class="card-header">
            <h2>${ele.title}</h2>
        </div>
        <div class="card-body">
            <p>${ele.body}</p>
        </div>
        <div class="card-footer  d-flex justify-content-between">
            <button class="btn btn-outline-primary" onclick="onEdit(this)">
                Edit
            </button>
            <button class="btn btn-outline-danger"onclick="onDelete(this)">
                Delete
            </button>
        </div>
    </div>`
    });
    postContainer.innerHTML = result
}
const createPost = (postobj) => {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", postUrl, true);
    xhr.send(JSON.stringify(postobj));
    xhr.onload = function() {
        if (xhr.status === 200 || xhr.status === 201) {
            cl(xhr.response);
            postobj.id = JSON.parse(xhr.response).id;
            PostArray.push(postobj)
            templating(PostArray)
            Swal.fire("new Post is added!");
        }
    }
}
const submitForm = (eve) => {
    eve.preventDefault();
    let newPost = {
        title: title.value,
        body: body.value,
        userId: userId.value
    }
    cl(newPost)
    postForm.reset();
    createPost(newPost)
}


const getallPosts = () => {
    let xhr = new XMLHttpRequest();
    //2)Configuration
    xhr.open("GET", postUrl, true);
    xhr.send();
    xhr.onload = function() {
        if (xhr.status === 200) {
            // cl(xhr.response) //200
            PostArray = JSON.parse(xhr.response)

            templating(PostArray)
        } else {
            alert("something is wrong...")
        }
    }
}
const onPostUpdate = (ele) => {
    let updateObj = {
        title: title.value,
        body: body.value,
        userId: userId.value
    }
    cl(updateObj)
    let getEditId = localStorage.getItem("editId")
    cl(getEditId)
    let updateUrl = `${baseUrl}/posts/${getEditId}` //udate obj in db
    let xhr = new XMLHttpRequest();
    xhr.open("PATCH", updateUrl, true);
    xhr.send(JSON.stringify(updateObj))
    xhr.onload = function() {
        if (xhr.status === 200) {
            cl(xhr.response);
            let getIndexObj = PostArray.findIndex(post => {
                return post.id == getEditId
            })
            cl(getIndexObj);
            cl(PostArray)
            PostArray[getIndexObj].title = updateObj.title;
            PostArray[getIndexObj].body = updateObj.body;
            PostArray[getIndexObj].userId = updateObj.userId;
            // templating(PostArray)
            Swal.fire({
                title: "Do you want to save the changes?",
                showDenyButton: true,
                showCancelButton: true,
                confirmButtonText: "save",
                denyButtonText: `Don't save`
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    templating(PostArray)
                    Swal.fire("Updated!", "", "success");
                } else if (result.isDenied) {
                    Swal.fire("Changes are not Updated", "", "info");
                }
            });
        }
    }
}

getallPosts();
postForm.addEventListener("submit", submitForm)
updateBtn.addEventListener("click", onPostUpdate)