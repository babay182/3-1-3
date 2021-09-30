getAllUsers()
let roleList = []
//-------------------------------------------------------------------------------------------------------
function getAllUsers() {
    $.getJSON("http://localhost:8088/api/admin", function (data) {
        let rows = '';
        $.each(data, function (key, user) {
            rows += createRows(user); // append user to rows
        });
        $('#listUsers').append(rows); // append to table

        $.ajax({
            url: '/api/admin/roles',
            method: 'GET',
            dataType: 'json',
            success: function (roles) {
                roleList = roles;
            }
        });
    });
}
//-------------------------------------------------------------------------------------------------------
function createRows(user) {
    let user_data = '<tr id=' + user.id + '>';
    user_data += '<td>' + user.id + '</td>';
    user_data += '<td>' + user.name + '</td>';
    user_data += '<td>' + user.lastName + '</td>';
    user_data += '<td>' + user.age + '</td>';
    user_data += '<td>' + user.login + '</td>';
    user_data += '<td>';
    let roles = user.roles;
    for (let r of roles) {
        user_data += r.role.replace('ROLE_','') + ' ';
    }
    user_data += '</td>' +
        '<td>' + '<input id="btnEdit" value="Edit" type="button" ' +
        'class="btn-info btn edit-btn" data-toggle="modal" data-target="#updateModal" ' +
        'data-id="' + user.id + '">' + '</td>' +

        '<td>' + '<input id="btnDelete" value="Delete" type="button" class="btn btn-danger del-btn" ' +
        'data-toggle="modal" data-target="#deleteModal" data-id=" ' + user.id + ' ">' + '</td>';
    user_data += '</tr>';
    return user_data;
}
//-------------------------------------------------------------------------------------------------------
$("#addUser").on('click', () => {
    let array = []
    let options = document.querySelector('#selectedRoles').options
    for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
            let role = {id: options[i].value, name: options[i].text}
            array.push(role)
        }
    }
    $.ajax({
        url: 'http://localhost:8088/api/admin',
        method: 'POST',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            name: $('#name').val(),
            lastName: $('#lastName').val(),
            age: $('#age').val(),
            login: $('#login').val(),
            password: $('#password').val(),
            roles: array
        }),
        success: function () {
            $('#listUsers').empty();
            getAllUsers();
            $('#nav-home-tab').tab('show');
        },
        error: function () {
            alert('error addUser')
        }
    });
    const { myForm } = document.forms;
    myForm.reset();
});
//-------------------------------------------------------------------------------------------------------
function editUserById(id) {
    fetch("/api/admin/" + id, {method: "GET", dataType: 'json',})
        .then((response) => {
            response.json().then((user) => {
                $('#editId').val(user.id);
                $('#editName').val(user.name);
                $('#editLastName').val(user.lastName);
                $('#editAge').val(user.age);
                $('#editLogin').val(user.login);
                $('#editPassword').empty();
                $('#editRole').empty();
                roleList.map(r => {
                    let selected = user.roles.find(item => item.id === r.id) ? 'selected' : '';
                    $('#editRole').append('<option id="' + r.id + '" ' + selected + ' name="' + r.role + '" >' +
                        r.role + '</option>')
                })
            })
        })
}

// write existing user
$(document).on('click', '.edit-btn', function () {
    editUserById($(this).attr('data-id'));
})

// update user
$('#update').on('click', (event) => {
    event.preventDefault()
    let array = []
    $.each($("select[name='editRoles'] option:selected"), function () {
        var role = {};
        role.id = $(this).attr('id');
        role.role = $(this).attr('name');
        array.push(role);
    });
    $.ajax({
        url: '/api/admin',
        method: 'PUT',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        data: JSON.stringify({
            id: $("input[name='id']").val(),
            name: $("input[name='name']").val(),
            lastName: $("input[name='lastName']").val(),
            age: $("input[name='age']").val(),
            login: $("input[name='login']").val(),
            password: $("input[name='password']").val(),
            roles: array
        }),
        success: (response) => {
            console.log(response);
            let newRow = createRows(response);
            $('#listUsers').find('#' + $('#editId').val()).replaceWith(newRow);
        }
    });
});
//-------------------------------------------------------------------------------------------------------
$(document).on('click', '.del-btn', function () {
    fetch("/api/admin/" + $(this).attr('data-id'), {method: "GET", dataType: 'json'})
        .then((response) => {
            response.json().then((user) => {
                $('#delId').val(user.id);
                $('#delName').val(user.name);
                $('#delLastName').val(user.lastName);
                $('#delAge').val(user.age);
                $('#delLogin').val(user.login);
                $('#delPassword').val(user.password);
                $('#delRole').empty();
                roleList.map(r => {
                    let selected = user.roles.find(item => item.id === r.id) ? 'selected' : '';
                    $('#delRole').append('<option id="' + r.id + '" ' + selected + ' name="' + r.role + '" >' +
                        r.role + '</option>')
                })
            })
        })
})
$('#delete').on('click', (event) => {
    event.preventDefault()
    $.ajax({
        url: '/api/admin/' + $('#delId').val(),
        method: 'DELETE',
        success: function () {
            $('#' + $('#delId').val()).remove();
        }
    });
});