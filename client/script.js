const BASE_URL = 'http://localhost:3000';
const MANDATORY_FIELDS = [
  "idField",
  "firstNameField",
  "lastNameField",
  "cityField",
  "streetField",
  "phoneField",
  "dobField"
]

$(document).ready(function () {
  const clientsTable = $("tbody");

  /* 
  ----------------
  DEFINTING FORMS
  ----------------
  */

  let addForm = {
    ref: $("#addClientFormDiv"),
    btn_openAddClientForm: $("#openAddFormButton"),
    btn_closeAddClientForm: $("#closeAddFormButton"),
    idField: $("#addId"),
    firstNameField: $("#addFirstName"),
    lastNameField: $("#addLastName"),
    cityField: $("#addCity"),
    streetField: $("#addStreet"),
    numberField: $("#addNumber"),
    phoneField: $("#addPhone"),
    telephoneField: $("#addTelephone"),
    dobField: $("#addDOB"),
    vaccineDateFields: $(".addVaccineDate"),
    vaccineManufacturerFields: $(".addVvaccineManufacturer"),
    positiveResultDateField: $("#addPositiveResultDate"),
    recoveryDateField: $("#addRecoveryDate"),
    btn_save: $("#saveClient"),
    errors: [],
    error_id: $("#idExists"),
    errorContainerSelector: "#addError"


  };

  let updateForm = {
    ref: $("#updateClientFormDiv"),
    btn_closeUpdateClientForm: $("#closeUpdateFormButton"),
    idField: $("#updateId"),
    firstNameField: $("#updateFirstName"),
    lastNameField: $("#updateLastName"),
    cityField: $("#updateCity"),
    streetField: $("#updateStreet"),
    numberField: $("#updateNumber"),
    phoneField: $("#updatePhone"),
    telephoneField: $("#updateTelephone"),
    dobField: $("#updateDOB"),
    vaccineDateFields: $(".updateVaccineDate"),
    vaccineManufacturerFields: $(".updateVaccineManufacturer"),
    positiveResultDateField: $("#updatePositiveResultDate"),
    recoveryDateField: $("#updateRecoveryDate"),
    btn_update: $("#updateClient"),
    errors: [],
    error_id: $("#updateIdExists"),
    errorContainerSelector: "#updateError"
  };

  let AdditionalDetails = {
    ref: $("#moreDetailsWindow"),
    btn_closeDetailsWindow: $("#closeDetailsButton")
  };


  let validation = {
    idExists: function (anyArray, formName) {
      for (let i in anyArray) {
        if (anyArray[i]['id'] === formName.idField.val()) {
          return true;
        }
      }
    },
    validateId: function (clients, formName) {
      const id = Number(formName.idField.val())
      const clientWithId = clients.find(client => client.id === id)
      if (clientWithId) {
        interaction.open(formName.error_id);
        formName.error_id.text(`${id} has already been assigned to ${clientWithId.firstName} ${clientWithId.lastName}`)
      }

      if (!idExists) {
        interaction.close(formName.error_id);
      }
    },
    validateRequiredField: function (form) {
      MANDATORY_FIELDS.forEach(function (fieldName) {
        const value = form[fieldName].val();
        if (value === "" || value == null) {
          form.errors = "";
          form.errors = `Please specify ${form[fieldName].attr('name')} field`;
          console.log(form.errors)
          interaction.open($(form.errorContainerSelector));
          $(form.errorContainerSelector).append(`<li>${form.errors}</li>`);

        }
      });
    }
  }


  /* 
  ---------------------
  DEFINING INTERACTIONS 
  ---------------------
  */

  let interaction = {
    open: function (anyEle) { anyEle.slideDown() },
    close: function (anyEle) { anyEle.slideUp() },

  }

  /* 
  -------------------------
  DEFINING CRUD OPERATIONS 
  -------------------------
  */

  let crud = {
    addClient: async function (form, clientObject) {
      const clientId = form.idField.val();
      if (
        validation.idExists(clientsState, clientId) ||
        clientId == "" ||
        form.firstNameField.val() == "" ||
        form.lastNameField.val() == "" ||
        form.cityField.val() == "" ||
        form.streetField.val() == "" ||
        form.phoneField.val() == "" ||
        form.dobField.val() == ""
      ) {
        validation.validateId(anyArray, form);
        validation.validateRequiredField(form)
        return;
      }

      form.errors = [];


      const response = await fetch(`${BASE_URL}/clients`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clientObject)
      })

      const newClient = await response.json()
      clientsState.push(newClient)

      interaction.close($(form.errorContainerSelector));
      interaction.close(form.ref);
    },
    getClients: async function () {
      const response = await fetch(`${BASE_URL}/clients`)
      const clients = (await response.json()).clients
      return clients
    },
    deleteClientById: async function (clientDocId) {
      const response = await fetch(`${BASE_URL}/clients/${clientDocId}`, {
        method: 'DELETE'
      })

    },

    update: async function (currentIndex, updatedClient) {
      if (
        updateForm.idField.val() == "" ||
        updateForm.firstNameField.val() == "" ||
        updateForm.lastNameField.val() == "" ||
        updateForm.cityField.val() == "" ||
        updateForm.streetField.val() == "" ||
        updateForm.phoneField.val() == "" ||
        updateForm.dobField.val() == ""
      ) {
        validation.validateRequiredField(updateForm, MANDATORY_FIELDS);
      } else {
        updateForm.errors = [];
        interaction.close($(updateForm.errorContainerSelector));
        const clientDocId = clientsState[currentIndex]._id
        const response = await fetch(`${BASE_URL}/clients/${clientDocId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedClient)
        })
        clientsState[currentIndex] = updatedClient;
        renderClients(clientsTable, clientsState)
        interaction.close(updateForm.ref);
      }
    }
  }

  let clientsState = [];

  let newClient;
  let updatedClient;

  crud.getClients().then(clients => {
    clientsState = clients
    renderClients(clientsTable, clients)
  })


  /* 
  ----------------
  SAVE MECHANISM 
  ----------------
  */

  // Add Form -> Save Button -> [Get Values from Add Form] [Add to Object] and [Display in DOM]
  addForm.btn_save.click(function () {
    newClient = {
      "id": addForm.idField.val(),
      "firstName": addForm.firstNameField.val(),
      "lastName": addForm.lastNameField.val(),
      "city": addForm.cityField.val(),
      "street": addForm.streetField.val(),
      "number": addForm.numberField.val(),
      "phone": addForm.phoneField.val(),
      "telephone": addForm.telephoneField.val(),
      "dob": addForm.dobField.val(),
      "vaccineDates": addForm.vaccineDateFields.val(),
      "vaccineManufactors": addForm.vaccineManufacturerFields.val(),
      "positiveDate": addForm.positiveResultDateField.val(),
      "recoveryDate": addForm.recoveryDateField.val()
    }
    crud.addClient(addForm, newClient)
    renderClients(clientsTable, clientsState)
  })

  // Creating un-assigned variable for getting the index of the row for which edit icon is clicked
  let updateIndex;

  /* 
  ----------------
  UPDATE MECHANISM 
  ----------------
  */

  // Table -> Edit Icon -> [Find updateIndex in ClientsInfo] [Display Update Form with Pre-filled Matching Information]
  clientsTable.on('click', 'i.editRowButton', function () {
    updateIndex = $("i.editRowButton").index(this);
    if (updateIndex in clientsState) {
      interaction.open(updateForm.ref);

      updateForm.ref.find(updateForm.idField).val(clientsState[updateIndex]['id'])
      updateForm.ref.find(updateForm.firstNameField).val(clientsState[updateIndex]['firstName'])
      updateForm.ref.find(updateForm.lastNameField).val(clientsState[updateIndex]['lastName'])
      updateForm.ref.find(updateForm.cityField).val(clientsState[updateIndex]['city'])
      updateForm.ref.find(updateForm.streetField).val(clientsState[updateIndex]['street'])
      updateForm.ref.find(updateForm.numberField).val(clientsState[updateIndex]['number'])
      updateForm.ref.find(updateForm.phoneField).val(clientsState[updateIndex]['phone'])
      updateForm.ref.find(updateForm.telephoneField).val(clientsState[updateIndex]['telephone'])
      updateForm.ref.find(updateForm.dobField).val(formatDate(clientsState[updateIndex]['dob']))
      for (let i = 0; i < addForm.vaccineDateFields.length; i++) {
        updateForm.ref.find(updateForm.vaccineDateFields[i]).val(clientsState[updateIndex]['vaccineDates'][i]);
        updateForm.ref.find(updateForm.vaccineManufacturerFields[i]).val(clientsState[updateIndex]['vaccineManufacturers'][i]);
      }
      updateForm.ref.find(updateForm.positiveResultDateField).val(clientsState[updateIndex]['positiveResultDate'])
      updateForm.ref.find(updateForm.recoveryDateField).val(clientsState[updateIndex]['recoveryDate'])
    };

    renderClients(clientsTable, clientsState);
  })

  // Update Form -> Update button -> [Get values from Update Form] [Update matching Client in the ClientsInfo] [Display updated Info in DOM]
  updateForm.btn_update.click(function () {
    updatedClient = {
      "id": updateForm.idField.val(),
      "firstName": updateForm.firstNameField.val(),
      "lastName": updateForm.lastNameField.val(),
      "city": updateForm.cityField.val(),
      "street": updateForm.streetField.val(),
      "number": updateForm.numberField.val(),
      "phone": updateForm.phoneField.val(),
      "telephone": updateForm.telephoneField.val(),
      "dob": updateForm.dobField.val(),
      "vaccineDates": updateForm.vaccineDateFields.val(),
      "vaccineManufactors": updateForm.vaccineManufacturerFields.val(),
      "positiveDate": updateForm.positiveResultDateField.val(),
      "recoveryDate": updateForm.recoveryDateField.val()
    }
    crud.update(updateIndex, updatedClient)
    renderClients(clientsTable, clientsState)
  })

  // Table -> Plus Icon -> 
  clientsTable.on('click', 'i.plusButton', function () {
    updateIndex = $("i.plusButton").index(this);
    if (updateIndex in clientsState) {
      interaction.open(AdditionalDetails.ref);

      clientDetailsContainer.innerHTML = `
            <h3>Personal Details</h3>
            <p><strong>Identity Card:</strong> ${clientsState[updateIndex]['id']}</p>
            <p><strong>First Name:</strong> ${clientsState[updateIndex]['firstName']}</p>
            <p><strong>Last Name:</strong> ${clientsState[updateIndex]['lastName']}</p>
            <p><strong>Address:</strong> ${clientsState[updateIndex]['city']}, ${clientsState[updateIndex]['street']} ${clientsState[updateIndex]['number']}</p>
            <p><strong>Date of Birth:</strong> ${clientsState[updateIndex]['dob']}</p>
            <p><strong>Telephone:</strong> ${clientsState[updateIndex]['telephone']}</p>
            <p><strong>Mobile Phone:</strong> ${clientsState[updateIndex]['phone']}</p>
            <h3>Corona Virus Details</h3>        
            <p><strong>Vaccine Dates:</strong> ${(clientsState[updateIndex]['vaccineDates']).join(", ")}</p>
            <p><strong>Vaccine Manufacturers:</strong> ${clientsState[updateIndex]['vaccineManufactors'].join(", ")}</p>
            <p><strong>Positive Result Date:</strong> ${clientsState[updateIndex]['positiveDate']}</p>
            <p><strong>Recovery Date:</strong> ${clientsState[updateIndex]['recoveryDate']}</p>
        `;
      clientDetailsContainer.style.display = "block";
    };

    renderClients(clientsTable, clientsState);
  })

  /* 
  ----------------
  DELETE MECHANISM 
  ----------------
  */

  // Table -> Delete Icon -> Delete Matching Object from ClientsInfo
  clientsTable.on('click', 'i.deleteRowButton', async function () {
    let index = $("i.deleteRowButton").index(this);
    const clientDocId = clientsState[index]._id
    await crud.deleteClientById(clientDocId)
    clientsState.splice(index, 1);
    renderClients(clientsTable, clientsState);
  })

  // INTERACTIONS

  // Main Button -> Open Add Client Form
  addForm.btn_openAddClientForm.click(function () {
    interaction.open(addForm.ref);
  });

  // Cross Button -> Close Add Client Form
  addForm.btn_closeAddClientForm.click(function () {
    interaction.close(addForm.ref);
  });

  // Close Button -> Close Update Client Form
  updateForm.btn_closeUpdateClientForm.click(function () {
    interaction.close(updateForm.ref);
  });

  // Close Button -> Close Additional Details Window
  AdditionalDetails.btn_closeDetailsWindow.click(function () {
    interaction.close(AdditionalDetails.ref);
  });

  // Add Form Id Input -> Runtime Check for Existing Id
  addForm.idField.keyup(function () {
    validation.validateId(clientsState, addForm)
  });

  // Update Form Id Input -> Runtime check for Existing Id
  updateForm.idField.keyup(function () {
    validation.validateId(clientsState, updateForm)
  });
})

function renderClients(container, clients) {

  container.html("");
  clients.forEach(value => {
    data = value;

    const dob = formatDate(data.dob);

    container.append(`<tr>
    <td>${data['id']}</td>
    <td>${data['firstName'] + " " + data['lastName']}</td>
    <td>${data['city'] + " " + data['street'] + " " + data['number']}</td>
    <td>${data['phone']}</td>
    <td>${dob}</td>
    <td>
    <i class="material-icons plusButton" id='plus${data['id']}'>zoom_in</i>
    <i class='material-icons editRowButton' id='edit${data['id']}'>edit</i>
    <i class='material-icons deleteRowButton' id='delete${data['id']}'>delete</i>
    </td>      
    </tr>`)
  });
}

function formatDate(date) {
  if (!date) return '';
  return (new Date(date)).toISOString().slice(0, 10)

}