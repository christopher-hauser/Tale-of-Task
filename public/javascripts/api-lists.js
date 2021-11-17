// ADD LIST BUTTON AND POPUP
const addListForm = document.getElementById("add-list-form");
const addListButton = document.getElementById('add-list-button');

addListButton.addEventListener("click", e => {
    e.preventDefault();
    const addListPopup = document.getElementById('add-list-popup');
    addListPopup.style.display = 'block';
})

addListForm.addEventListener("submit", async (e) => {
    const addListPopup = document.getElementById('add-list-popup');
    e.preventDefault();
    const formData = new FormData(addListForm);
    const name = formData.get("name");
    const csrfToken = document.getElementById("addCsrf").value
    const data = await fetch('/lists', {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'X-CSRF-TOKEN': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
            name
        })
    })

    const dataJSON = await data.json();

    if (dataJSON.message) {
        window.location.href = `/lists/${dataJSON.message}`
    }

    if (!data.ok) {
        throw data;
    }

    if (dataJSON.errors) {
        const errorDiv = document.createElement("div");
        const errorHeader = document.createElement("p");
        const ul = document.createElement("ul")
        errorHeader.innerHTML = "The following error(s) occurred:"
        addListPopup.append(errorDiv);
        errorDiv.append(errorHeader);
        errorDiv.append(ul);

        dataJSON.errors.forEach(error => {
            const errorMessage = document.createElement("li");
            errorMessage.innerHTML = error;
            ul.append(errorMessage);
        })
    }

})

const cancelListButton = document.getElementById('cancel-add-list');
cancelListButton.addEventListener("click", () => {
    const addListPopup = document.getElementById('add-list-popup');
    addListPopup.style.display = 'none';
})

// DELETE BUTTON
const deleteListButtons = document.getElementsByClassName("delete-list-buttons");

for (let i = 0; i < deleteListButtons.length; i++) {
    const deleteList = deleteListButtons[i];
    deleteList.addEventListener("click", async (e) => {
        let deleteListId = e.target.id.split('-')[2]
        const deleteId = parseInt(deleteListId, 10);
        const data = await fetch(`/lists/${deleteId}`, {
            method: "DELETE"
        });

        if (!data.ok) {
            throw data;
        }

        const dataJSON = await data.json();

        if (dataJSON.message) {
            window.location.href = `/lists/${dataJSON.message}`
        }
    })
}

// UPDATE BUTTON
const updateListButtons = document.getElementsByClassName("update-list-buttons");
const updateListForm = document.getElementById("update-list-form")
const updateListPopup = document.getElementById('update-list-popup');
let updateTarget;
let updateId;

for (let i = 0; i < updateListButtons.length; i++) {
    const updateListButton = updateListButtons[i];
    updateListButton.addEventListener("click", e => {
        console.log("inside event listener")
        updateListPopup.style.display = 'block';
        updateTarget = e.target.id.split('-')[2];
        updateId = parseInt(updateTarget, 10);
    })
}

const submitUpdate = document.getElementById("submit-update-list");
submitUpdate.addEventListener("click", async (e) => {
    e.preventDefault();
    console.log("in event listener")
    const formData = new FormData(updateListForm);
    const name = formData.get("name");
    const csrfToken = document.getElementById("updateCsrf").value
    const data = await fetch(`/lists/${updateId}`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': csrfToken
        },
        credentials: 'include',
        body: JSON.stringify({
            name
        })
    })

    if (!data.ok) {
        throw data;
    }

    const dataJSON = await data.json();

    if (dataJSON.errors) {
        const errorDiv = document.createElement("div");
        const errorHeader = document.createElement("p");
        const ul = document.createElement("ul")
        errorHeader.innerHTML = "The following error(s) occurred:"
        updateListPopup.append(errorDiv);
        errorDiv.append(errorHeader);
        errorDiv.append(ul);

        dataJSON.errors.forEach(error => {
            const errorMessage = document.createElement("li");
            errorMessage.innerHTML = error;
            ul.append(errorMessage);
        })
    }


    if (dataJSON.message) {
        window.location.href = `/lists/${dataJSON.message}`
    }

})
