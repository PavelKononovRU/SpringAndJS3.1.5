"use strict";
$(document).ready(async function () {
    let principal = await getPrincipal();
    let roleAdmin = false;
    principal.roles.forEach(role => role.role.substring(5) === "ADMIN" ? roleAdmin = true : {});
    if (roleAdmin) {
        await getAllUsers();
        await addEditUserButtonListener();
        await addDeleteUserButtonListener();
        await showNewUserTab()
        await addNewUserButtonListener();

        $("#editModal").on("show.bs.modal", event => {
            let button = $(event.relatedTarget);
            let id = button.data("id");
            showEditModal(id);
        })
        $("#deleteModal").on("show.bs.modal", event => {
            let button = $(event.relatedTarget);
            let id = button.data("id");
            showDeleteModal(id);
        })

    } else {
        $("#btnInfoPanel").click();
        $("#btnAdminPanel").hide();
        document.title = "Person Info";
    }

});

// Заполнение шапки и вкладки инфо
async function getPrincipal() {
    let principal = await fetch("http://localhost:8080/admin/authentic").then(response => response.json());
    $('#auth_name')[0].innerHTML = principal.name;
    $('#auth_userName')[0].innerHTML = principal.name;

    let roles = "";
    principal.roles.forEach(x => roles += x.role.substring(5) + " ");
    $('#auth_roles')[0].innerHTML = roles;
    $('#auth_userRoles')[0].innerHTML = roles;
    $('#auth_id')[0].innerHTML = principal.id;
    $('#auth_surname')[0].innerHTML = principal.surname;
    $('#auth_age')[0].innerHTML = principal.age;
    $('#auth_email')[0].innerHTML = principal.email;
    return principal;
}

// Запросить данные пользователя по ID
async function getUser(id) {
    let response = await fetch(`http://localhost:8080/admin/person/${id}`);
    return await response.json();
}

//заполнение таблицы всех пользователей
async function getAllUsers() {
    const tbody = $('#people_info');
    tbody.empty();
    await fetch("http://localhost:8080/admin/people")
        .then(response => response.json())
        .then(data => {
            data.forEach(user => {
                let roles = "";
                user.roles.forEach(r => roles += r.role.substring(5) + " ");
                let rowUser = `
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.name}</td>
                        <td>${user.surname}</td>
                        <td>${user.email}</td>
                        <td>${user.age}</td>
                        <td>${roles}</td>
                        <td>
                            <button type="button" class="btn btn-info" data-bs-toggle="modal" id="buttonEdit" 
                            data-action="edit" data-id="${user.id}" data-bs-target="#editModal">Edit</button>
                        </td>
                        <td>
                            <button type="button" class="btn btn-danger" data-bs-toggle="modal" id="buttonDelete" 
                            data-action="delete" data-id="${user.id}" data-bs-target="#deleteModal">Delete</button>
                        </td>
                    </tr>`;
                tbody.append(rowUser);
            })
        });
}

/*заполнение Edit modal*/
async function showEditModal(id) {
    $("#editRolesUser").empty();
    let user = await getUser(id);
    let formForEdit = document.forms["EditPerson"];
    formForEdit.id.value = user.id;
    formForEdit.name.value = user.name;
    formForEdit.surname.value = user.surname;
    formForEdit.email.value = user.email;
    formForEdit.age.value = user.age;
    formForEdit.username.value = user.username;
    formForEdit.password.value = user.password;
    fetch("http://localhost:8080/admin/roles")
        .then(response => response.json())
        .then(roles => {
            roles.forEach(role => {
                let selectedRole = false;
                for (let i = 0; i < user.roles.length; i++) {
                    if (user.roles[i].role === role.role) {
                        selectedRole = true;
                    }
                }
                let optionElement = document.createElement("option");
                optionElement.text = role.role.substring(5);
                optionElement.value = role.id;
                if (selectedRole) optionElement.selected = true;
                document.getElementById("editRolesUser").appendChild(optionElement);
            })
        });
}


/*Edit user*/
async function addEditUserButtonListener() {
    const editForm = document.forms["EditPerson"];
    editForm.addEventListener("submit", event => {
        event.preventDefault();
        let editUserRoles = [];
        for (let i = 0; i < editForm.roles.options.length; i++) {
            if (editForm.roles.options[i].selected) {
                editUserRoles.push({
                    id: editForm.roles.options[i].value,
                    role: "ROLE_" + editForm.roles.options[i].text
                })
            }
        }

        fetch(`http://localhost:8080/admin/person/${editForm.id.value}`, {
            method: "PUT",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: editForm.id.value,
                name: editForm.name.value,
                surname: editForm.surname.value,
                email: editForm.email.value,
                age: editForm.age.value,
                username: editForm.username.value,
                password: editForm.password.value,
                roles: editUserRoles
            })
        }).then(() => {
            $("#editFormCloseButton").click();
            getAllUsers();
        })
    })
}

/*заполнение Delete modal*/
async function showDeleteModal(id) {
    $("#deleteRolesPerson").empty();
    let user = await getUser(id);
    let formForDelete = document.forms["DeletePerson"];
    formForDelete.id.value = user.id;
    formForDelete.name.value = user.name;
    formForDelete.surname.value = user.surname;
    formForDelete.email.value = user.email;
    formForDelete.age.value = user.age;

    user.roles.forEach(role => {
        let optionElement = document.createElement("option");
        optionElement.text = role.role.substring(5);
        optionElement.value = role.id;
        document.getElementById("deleteRolesPerson").appendChild(optionElement);
    });
}


/*Delete user*/
async function addDeleteUserButtonListener() {
    const deleteForm = document.forms["DeletePerson"];
    deleteForm.addEventListener("submit", event => {
        event.preventDefault();
        fetch(`http://localhost:8080/admin/person/${deleteForm.id.value}`, {
            method: "DELETE"
        }).then(() => {
            $("#deleteFormCloseButton").click();
            getAllUsers();
        })
    })
}

/*Prepare new user roles*/
async function showNewUserTab() {
    let roles = await fetch("http://localhost:8080/admin/roles")
        .then(response => response.json());
    for (let role of roles) {
        let optionElement = document.createElement("option");
        optionElement.text = role.role.substring(5);
        optionElement.value = role.id;
        if (role.id === 2) {
            optionElement.selected = true;
        }
        document.getElementById("newPersonRoles").appendChild(optionElement);
    }
}

/*Add new user*/
async function addNewUserButtonListener() {
    const newUserForm = document.forms["formNewPerson"];
    newUserForm.addEventListener("submit", event => {
        event.preventDefault();
        let newUserRoles = [];
        console.log(newUserForm.roles.options);
        for (const option of newUserForm.roles.options) {
            if (option.selected) {
                newUserRoles.push({
                    id: option.value,
                    role: `ROLE_${option.text}`
                })
            }
        }
        fetch("http://localhost:8080/admin/people", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: newUserForm.name.value,
                surname: newUserForm.surname.value,
                email: newUserForm.email.value,
                age: newUserForm.age.value,
                username: newUserForm.username.value,
                password: newUserForm.password.value,
                roles: newUserRoles
            })
        }).then(() => {
            newUserForm.reset();
            alert('Пользователь добавлен')
            getAllUsers();
            $("#navLinkAllUsersPanel").click();
        });
    })
}
