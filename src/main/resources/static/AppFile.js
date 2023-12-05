const URL = "http://localhost:8080/api/users";

const roleList = []
$(document).ready( function () {
    getAllUsers();
    fetch("http://localhost:8080/api/roles")
        .then(response => response.json())
        .then(roles => {
            roles.forEach(role => {
                roleList.push(role)
            })
        })
})
function getAllUsers() {
    const usersTable = $('.users-table')
    usersTable.empty()
    fetch(URL)
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                let row = `$(
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td>
                        <td>${user.email}</td>
                        <td>${user.password}</td>
                        <td>${user.login}</td>
                        <td>${user.roles.map(r => r.name.substring(5))}</td>  
                        <td>
                            <button type="button" class="btn btn-info text-white" data-bs-toggle="modal"
                            onclick="showEditModal(${user.id})">Edit</button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" 
                            onclick="showDeleteModal(${user.id})">Delete</button>
                        </td>
                    </tr>
                )`
                usersTable.append(row)
            })
        })
        .catch(err => console.log(err))
}
//NEW USER

function newUser(){
    let newUserForm = $('#new-user-form')[0]
    fillRoles(newUserForm);
    newUserForm.addEventListener("submit", (ev) => {
        ev.preventDefault()
        ev.stopPropagation()

        let newUser = JSON.stringify({
            name:  $(`[name="name"]` , newUserForm).val(),
            lastName:  $(`[name="lastName"]` , newUserForm).val(),
            age:  $(`[name="age"]` , newUserForm).val(),
            email:  $(`[name="email"]` , newUserForm).val(),
            password:  $(`[name="password"]` , newUserForm).val(),
            login:  $(`[name="login"]` , newUserForm).val(),

            roles: getRole(newUserForm)
        })
        fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newUser
        }).then(r => {
            newUserForm.reset()
            if(!r.ok) {
                alert("User with this username already exist!!")
            }else {
                $('#users-table-tab')[0].click()
            }
        })
    })
}

//editModal

function showEditModal(id) {
    const editModal = new bootstrap.Modal($('.edit-modal'))
    const editForm = $('#edit-form')[0]
    showModal(editForm, editModal, id)
    editForm.addEventListener('submit', (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        let newUser = JSON.stringify({
            id: $(`[name="id"]` , editForm).val(),
            name:  $(`[name="name"]` , editForm).val(),
            lastName:  $(`[name="lastName"]` , editForm).val(),
            age:  $(`[name="age"]` , editForm).val(),
            email:  $(`[name="email"]` , editForm).val(),
            password:  $(`[name="password"]` , editForm).val(),
            login:  $(`[name="login"]` , editForm).val(),
            roles: getRole(editForm)
        })
        fetch(URL, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: newUser
        }).then(r => {
            editModal.hide()
            $('#users-table-tab')[0].click()
            if(!r.ok) {
                alert("User with this username already exist!!")
            }
        })
    })
}

//deleteModal
function showDeleteModal(id) {
    const deleteModal = new bootstrap.Modal($('.delete-modal'))
    const deleteForm = $('#delete-form')[0]
    showModal(deleteForm, deleteModal, id)
    deleteForm.addEventListener('submit', (ev) => {
        ev.preventDefault()
        ev.stopPropagation()
        fetch(URL + `/${$(`[name="id"]` , deleteForm).val()}`, {
            method: 'DELETE'
        }).then(r => {
            deleteModal.hide()
            $('#users-table-tab')[0].click()
            if(!r.ok) {
                alert("Deleting process failed!!")
            }
        })
    })
}


//Utils

function showModal(form, modal, id) {
    modal.show()
    fillRoles(form)
    fetch(URL + `/${id}`).then(response => {
        response.json().then(user => {
            $(`[name="username"]`,form).val(user.username)
            $(`[name="id"]`,form).val(user.id)
            $(`[name="name"]`,form).val(user.name)
            $(`[name="lastName"]`,form).val(user.lastName)
            $(`[name="age"]`,form).val(user.age)
            $(`[name="email"]`,form).val(user.email)
            $(`[name="password"]`,form).val(user.password)
            $(`[name="login"]`,form).val(user.login)
        })
    })
}
function fillRoles(form) {
    roleList.forEach(role => {
        let option = `<option value="${role.id}">
                                 ${role.name}
                            </option>`
        $(`[name="roles"]`, form).append(option)
    })
}
function getRole(form) {
    let role = []
    let options = $(`[name="roles"]`, form)[0].options
    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            role.push(roleList[i])
        }
    }
    return role
}