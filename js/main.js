var Contacts = {
	index: window.localStorage.getItem("Contacts:index"),
	contactsTable: document.getElementById("contactsTable"),
	contactsForm: document.getElementById("contactsForm"),
	buttonDiscard: document.getElementById("buttonDiscard"),
	addContacts: document.getElementById("addContacts"),
	closeButton: document.getElementById("close"),
	formContainer: document.getElementById("formData"),
	addEmployeeModal: document.getElementById("addEmployeeModal"),
	modelHeading: document.getElementById("modelHeading"),
	
	init: function() {

		if (!Contacts.index) {
			window.localStorage.setItem("Contacts:index", Contacts.index = 1);
		}

		Contacts.contactsForm.reset();

		Contacts.buttonDiscard.addEventListener("click", function(event) {
			Contacts.contactsForm.reset();
			Contacts.contactsForm.id_entry.value = 0;
		}, true);

		Contacts.addContacts.addEventListener("click", function(event) {
			Contacts.contactsForm.reset();
			Contacts.contactsForm.id_entry.value = 0;
			Contacts.formContainer.style.display = 'block';
			Contacts.addEmployeeModal.style.display = 'block';
			Contacts.modelHeading.innerHTML = 'Add Contact';
		}, true);

		Contacts.closeButton.addEventListener("click", function(event) {
			Contacts.contactsForm.reset();
			Contacts.clearErrors();
			Contacts.formContainer.style.display = 'none';
			Contacts.addEmployeeModal.style.display = 'none';
		}, true);

		Contacts.contactsForm.addEventListener("submit", function(event) {
			var entry = {
				id: parseInt(this.id_entry.value),
				first_name: this.first_name.value.trim(),
				last_name: this.last_name.value.trim(),
				email: this.email.value.trim(),
				phone:this.phone.value.trim(),
				status_val:this.status_val.value,
			};

			if (Contacts.validateUserInput(entry) == false) {
				return false;
			} else {
				Contacts.formContainer.style.display = 'none';
				Contacts.addEmployeeModal.style.display = 'none';	
			}

			if (entry.id == 0) {
				Contacts.storeAdd(entry);
				Contacts.tableAdd(entry);
			} else {
				Contacts.storeEdit(entry);
				Contacts.tableEdit(entry);
			}

			this.reset();
			this.id_entry.value = 0;
			event.preventDefault();
		}, true);

		if (window.localStorage.length - 1) {
			var contacts_list = [], i, key;
			for (i = 0; i < window.localStorage.length; i++) {
				key = window.localStorage.key(i);
				if (/Contacts:\d+/.test(key)) {
					contacts_list.push(JSON.parse(window.localStorage.getItem(key)));
				}
			}

			if (contacts_list.length) {
				contacts_list
					.sort(function(a, b) {
						return a.id < b.id ? -1 : (a.id > b.id ? 1 : 0);
					})
					.forEach(Contacts.tableAdd);
			}
		}

		Contacts.contactsTable.addEventListener("click", function(event) {
			var op = event.target.getAttribute("data-op");
			
			if (/edit|remove/.test(op)) {
				var entry = JSON.parse(window.localStorage.getItem("Contacts:"+ event.target.getAttribute("data-id")));
				
				if (op == "edit") {
					Contacts.formContainer.style.display = 'block';
					Contacts.addEmployeeModal.style.display = 'block';
					Contacts.modelHeading.innerHTML = 'Edit Contact';
					Contacts.contactsForm.first_name.value = entry.first_name;
					Contacts.contactsForm.last_name.value = entry.last_name;
					Contacts.contactsForm.email.value = entry.email;
					Contacts.contactsForm.phone.value = entry.phone;
					Contacts.contactsForm.status_val.value = entry.status_val;
					Contacts.contactsForm.id_entry.value = entry.id;
				} else if (op == "remove") {
					if (confirm('Are you sure you want to remove "'+ entry.first_name +' '+ entry.last_name +'" from your contacts?')) {
						Contacts.storeRemove(entry);
						Contacts.tableRemove(entry);
					}
				}

				event.preventDefault();
			}
		}, true);
	},

	storeAdd: function(entry) {
		entry.id = Contacts.index;
		window.localStorage.setItem("Contacts:index", ++Contacts.index);
		window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
	},
	
	storeEdit: function(entry) {
		window.localStorage.setItem("Contacts:"+ entry.id, JSON.stringify(entry));
	},
	
	storeRemove: function(entry) {
		window.localStorage.removeItem("Contacts:"+ entry.id);
	},

	tableAdd: function(entry) {
		var $tr = document.createElement("tr"), $td, key;
		for (key in entry) {
			if (entry.hasOwnProperty(key)) {
				$td = document.createElement("td");
				$td.appendChild(document.createTextNode(entry[key]));
				$tr.appendChild($td);
			}
		}
		$td = document.createElement("td");
		$td.innerHTML = '<a data-op="edit" class="edit" data-id="'+ entry.id +'"></a><a data-op="remove" class="remove" data-id="'+ entry.id +'"></a>';
		$tr.appendChild($td);
		$tr.setAttribute("id", "entry-"+ entry.id);
		Contacts.contactsTable.appendChild($tr);
	},

	tableEdit: function(entry) {
		var $tr = document.getElementById("entry-"+ entry.id), $td, key;
		$tr.innerHTML = "";
		for (key in entry) {
			if (entry.hasOwnProperty(key)) {
				$td = document.createElement("td");
				$td.appendChild(document.createTextNode(entry[key]));
				$tr.appendChild($td);
			}
		}
		$td = document.createElement("td");
		$td.innerHTML = '<a data-op="edit" class="edit" data-id="'+ entry.id +'"></a><a data-op="remove" class="remove" data-id="'+ entry.id +'"></a>';
		$tr.appendChild($td);
	},

	tableRemove: function(entry) {
		Contacts.contactsTable.removeChild(document.getElementById("entry-"+ entry.id));
	},

	validateUserInput: function(entry) {

		var firstNameErr = lastNameErr = emailErr = phoneErr = statusErr = true;

		if(entry.first_name == "") {
			Contacts.printError("firstNameErr", "Please enter your name");
		} else {
			var regex = /^[a-zA-Z\s]+$/;                
			if(regex.test(entry.first_name) === false) {
				Contacts.printError("firstNameErr", "Please enter a valid name");
			} else {
				Contacts.printError("firstNameErr", "");
				firstNameErr = false;
			}
		}

		if(entry.last_name == "") {
			Contacts.printError("lastNameErr", "Please enter your last name");
		} else {
			var regex = /^[a-zA-Z\s]+$/;                
			if(regex.test(entry.last_name) === false) {
				Contacts.printError("lastNameErr", "Please enter a valid last name");
			} else {
				Contacts.printError("lastNameErr", "");
				lastNameErr = false;
			}
		}

		if(entry.email !== "") {
			var regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			if(regex.test(entry.email.toLowerCase()) === false) {
				Contacts.printError("emailErr", "Please enter a valid email address");
			} else{
				Contacts.printError("emailErr", "");
				emailErr = false;
			}
		} else{
			Contacts.printError("emailErr", "");
			emailErr = false;
		}

		if(entry.phone == "") {
			Contacts.printError("phoneErr", "Please enter your mobile number");
		} else {
			var regex = /^[1-9]\d{9}$/;
			if(regex.test(entry.phone) === false) {
				Contacts.printError("phoneErr", "Enter 10 digit mobile number");
			} else{
				Contacts.printError("phoneErr", "");
				phoneErr = false;
			}
		}

		if(entry.status_val == "") {
			Contacts.printError("statusErr", "Please enter valid Status");
		} else {
			Contacts.printError("statusErr", "");
			statusErr = false;
		}
		
		if((firstNameErr || lastNameErr || emailErr || phoneErr || statusErr) == true) {
			event.preventDefault();
			return false;
		}
	},
	
	clearErrors: function() {
		Contacts.printError("firstNameErr", "");
		Contacts.printError("lastNameErr", "");
		Contacts.printError("emailErr", "");
		Contacts.printError("phoneErr", "");
		Contacts.printError("statusErr", "");
	},
	
	printError: function(elemId, hintMsg) {
		document.getElementById(elemId).innerHTML = hintMsg;
	}
};

Contacts.init();
