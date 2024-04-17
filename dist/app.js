const nameDOM = document.getElementById("name");
const surnameDOM = document.getElementById("surname");
const yearDOM = document.getElementById("year");
const maleDOM = document.getElementById('male');
const femaleDOM = document.getElementById('female');
const emailDOM = document.getElementById("email");
const phoneDOM = document.getElementById("phone");
const addRegistrationButton = document.getElementById("addRegistration");
const error = document.querySelector("#error");
const loadDataButton = document.getElementById("loadData");
const dataTableBody = document.getElementById("dataTableBody");
const dataTable = document.getElementById("dataTable");
const editForm = document.getElementById("editForm");
let registrationData;
error.style.visibility = "hidden";
addRegistrationButton.onclick = () => {
    const genderInp = maleDOM.checked ? 'male' : femaleDOM.checked ? 'female' : 'unknown';
    if (genderInp === 'unknown') {
        error.innerHTML = "Pasirinkite lytį (vyras arba moteris)!";
        error.style.visibility = "visible";
        return;
    }
    const reg = {
        name: nameDOM.value,
        surname: surnameDOM.value,
        year: yearDOM.valueAsNumber,
        gender: genderInp,
        email: emailDOM.value,
        phone: phoneDOM.value
    };
    fetch("https://registration-a11b0-default-rtdb.europe-west1.firebasedatabase.app/registration.json", {
        method: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reg)
    })
        .then((response) => {
        return response.json();
    })
        .then((data) => {
        console.log("Įrašas pridėtas");
        console.log(data);
    });
    error.style.visibility = "hidden";
    nameDOM.value = '';
    surnameDOM.value = '';
    maleDOM.checked = false;
    femaleDOM.checked = false;
    yearDOM.value = '';
    emailDOM.value = '';
    phoneDOM.value = '';
};
const showData = () => {
    dataTableBody.innerHTML = "";
    registrationData.forEach((reg) => {
        const tr = document.createElement("tr");
        const tdName = document.createElement("td");
        tdName.innerHTML = reg.name;
        const tdSurname = document.createElement("td");
        tdSurname.innerHTML = reg.surname;
        const tdYear = document.createElement("td");
        tdYear.innerHTML = reg.year.toString();
        const tdGender = document.createElement("td");
        tdGender.innerHTML = reg.gender;
        const tdEmail = document.createElement("td");
        tdEmail.innerHTML = reg.email;
        const tdPhone = document.createElement("td");
        tdPhone.innerHTML = reg.phone;
        // desim button
        const tdV = document.createElement("td");
        tr.appendChild(tdName);
        tr.appendChild(tdSurname);
        tr.appendChild(tdYear);
        tr.appendChild(tdGender);
        tr.appendChild(tdEmail);
        tr.appendChild(tdPhone);
        tr.appendChild(tdV);
        dataTableBody.appendChild(tr);
        tr.onclick = () => {
            dataTable.style.display = "none";
            editForm.style.display = "block";
            document.getElementById("nameEdit").value = reg.name;
            document.getElementById("surnameEdit").value = reg.surname;
            document.getElementById("yearEdit").value = reg.year.toString();
            if (reg.gender === 'male') {
                document.getElementById('maleEdit').checked = true;
            }
            else if (reg.gender === 'female') {
                document.getElementById('femaleEdit').checked = true;
            }
            else {
                document.getElementById('maleEdit').checked = false;
                document.getElementById('femaleEdit').checked = false;
            }
            document.getElementById("emailEdit").value = reg.email;
            document.getElementById("phoneEdit").value = reg.phone;
            document.getElementById("updateRegistration").onclick = () => {
                const genderEdit = document.getElementById('maleEdit').checked ? 'male' : document.getElementById('femaleEdit').checked ? 'female' : 'unknown';
                const upReg = {
                    name: document.getElementById("nameEdit").value,
                    surname: document.getElementById("surnameEdit").value,
                    year: document.getElementById("yearEdit").valueAsNumber,
                    gender: genderEdit,
                    email: document.getElementById("emailEdit").value,
                    phone: document.getElementById("phoneEdit").value,
                };
                fetch(`https://registration-a11b0-default-rtdb.europe-west1.firebasedatabase.app/registration/${reg.id}.json`, {
                    method: "PUT",
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(upReg)
                })
                    .then((response) => {
                    return response.json();
                })
                    .then((data) => {
                    console.log("Įrašas atnaujintas");
                    console.log(data);
                    dataTable.style.display = "block";
                    editForm.style.display = "none";
                    loadData();
                });
            };
        };
    });
};
const loadData = () => {
    fetch("https://registration-a11b0-default-rtdb.europe-west1.firebasedatabase.app/registration.json", {
        method: "GET",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    })
        .then((response) => {
        return response.json();
    })
        .then((data) => {
        registrationData = [];
        Object.keys(data).forEach((k) => {
            registrationData.push(Object.assign({ id: k }, data[k]));
        });
        showData();
        console.log(registrationData);
    });
};
loadDataButton.onclick = loadData;
export {};
