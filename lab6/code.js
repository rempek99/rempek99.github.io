// (for debugging) check if browser support indexed db 
if (!('indexedDB' in window)) {
    console.log("This browser doesn't support IndexedDB");
}

let db;

// TODO if not working on firefox in private change below config 
// dom.indexedDB.privateBrowsing.enabled = true
const openRequest = indexedDB.open('myDatabase', 2);

openRequest.onupgradeneeded = function (e) {
    db = e.target.result;
    console.log('Inicjalizacja indexedDb...');
    const storeOS = db.createObjectStore('myDatabaseStore', { keyPath: "email" });

};
openRequest.onsuccess = function (e) {
    console.log('Połączono z indexedDB...');
    db = e.target.result;
    fetchClients();
};
openRequest.onerror = function (e) {
    alert('Brak połączenia z bazą danych. Aplikacja może nie działać poprawnie w sesji prywatnej przeglądarki.')
    console.log('Połączenie z bazą danych nie mogło zostać otwarte. (Aplikacja może nie działać poprawnie w sesji prywatnej przeglądarki Firefox)');
    console.dir(e);
};


function addItem() {
    if (!validate()) {
        return;
    }

    let email = document.getElementById('email').value;
    let postal = document.getElementById('postal').value;
    let nip = document.getElementById('nip').value;
    let idnum = document.getElementById('identity').value;
    let www = document.getElementById('www').value;
    let telephone = document.getElementById('telephone').value;
    let birthdate = document.getElementById('birth-date').value;
    const item = {
        email: email,
        postal: postal,
        nip: nip,
        idnum: idnum,
        www: www,
        telephone: telephone,
        birthdate: birthdate
    };
    const tx = db.transaction("myDatabaseStore", "readwrite");
    const store = tx.objectStore('myDatabaseStore');
    const request = store.add(item);

    request.onerror = (e) => {
        alert('Nie można dodać klienta. (Klient o podanym adresie email już isnieje)')
    }
    fetchClients();
};

function updateItem() {
    let email = document.getElementById('email').value;
    const tx = db.transaction("myDatabaseStore", "readwrite");
    const store = tx.objectStore('myDatabaseStore');
    const request = store.get(email);
    request.onsuccess = () => {

        const item = request.result;
        if (item == null) {
            alert(`${email}, ten adres email nie jest przypisany do żadnego klienta!`);
            return;
        }
        let postal = document.getElementById('postal').value;
        let nip = document.getElementById('nip').value;
        let idnum = document.getElementById('identity').value;
        let www = document.getElementById('www').value;
        let telephone = document.getElementById('telephone').value;
        let birthdate = document.getElementById('birth-date').value;
        item.postal = postal;
        item.nip = nip;
        item.idnum = idnum;
        item.www = www;
        item.telephone = telephone;
        item.birthdate = birthdate;


        // Create a request to update
        const updateRequest = store.put(item);

        updateRequest.onsuccess = () => {
            fetchClients();
        }
    }
};

function getClients() {
    const tx = db.transaction("myDatabaseStore", "readwrite");
    const store = tx.objectStore('myDatabaseStore');
    request = store.openCursor();
    const items = [];

    request.onerror = function (event) {
        console.err("Błąd wczytywania klientów.");
        return null;
    };



    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            let key = cursor.primaryKey;
            let value = cursor.value;
            items.push(value)
            cursor.continue();
        }
        return items;
    }
}


function fetchClients() {
    const tx = db.transaction("myDatabaseStore", "readwrite");
    const store = tx.objectStore('myDatabaseStore');
    request = store.openCursor();
    const items = [];

    request.onerror = function (event) {
        console.err("Błąd wczytywania klientów.");
    };



    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            let key = cursor.primaryKey;
            let value = cursor.value;
            items.push(value)
            cursor.continue();
        }
        updateList(items);
    }
};

function updateList(newItems) {
    var list = document.getElementById('clients');
    list.replaceChildren([]);
    for (var i = 0; i < newItems.length; i++) {
        var element = document.createElement('li');
        var elContent = document.createElement('div');
        var delBut = document.createElement('button');
        var copyBut = document.createElement('button');
        const key = newItems[i].email;
        delBut.addEventListener("click", () => { deleteItem(key); });
        copyBut.addEventListener("click", () => { copyDataFromItem(key); });
        delBut.innerHTML = 'Usuń';
        copyBut.innerHTML = 'Edytuj'
        elContent.innerHTML = newItems[i].email + ', ' + newItems[i].postal + ', ' + newItems[i].nip + ', ' +
            newItems[i].idnum + ', ' + newItems[i].www + ', ' + newItems[i].telephone + ', ' + newItems[i].birthdate + '  ';
        elContent.appendChild(delBut);
        elContent.appendChild(copyBut);
        element.appendChild(elContent);
        list.appendChild(element);
    }
}

function deleteItem(key) {
    const tx = db.transaction("myDatabaseStore", "readwrite");
    const store = tx.objectStore('myDatabaseStore');
    store.delete(key);
    fetchClients();
    alert(`${key}, został usunięty!`);
}

function copyDataFromItem(key) {
    const tx = db.transaction("myDatabaseStore", "readwrite");
    const store = tx.objectStore('myDatabaseStore');
    const request = store.get(key);
    request.onsuccess = () => {
        const item = request.result;
        document.getElementById('email').value = item.email;
        document.getElementById('postal').value = item.postal;
        document.getElementById('nip').value = item.nip;
        document.getElementById('identity').value = item.idnum;
        document.getElementById('www').value = item.www;
        document.getElementById('telephone').value = item.telephone;
        document.getElementById('birth-date').value = item.birthdate;

    }

}

var counter = 0;

function randomData() {
    const random_data = [
        [
            { key: '#email', value: '224413@edu.p.lodz.pl' },
            { key: '#postal', value: '12-213' },
            { key: '#nip', value: '0987654321' },
            { key: '#identity', value: 'XXX123123' },
            { key: '#www', value: 'http://www.google.com' },
            { key: '#telephone', value: '123123123' },
            { key: '#birth-date', value: '1999-02-11' }],
        [
            { key: '#email', value: 'jacex@wp.pl' },
            { key: '#postal', value: '09-213' },
            { key: '#nip', value: '1237123321' },
            { key: '#identity', value: 'QWE123193' },
            { key: '#www', value: 'http://www.yahoo.com' },
            { key: '#telephone', value: '999123123' },
            { key: '#birth-date', value: '1972-11-11' }],
        [
            { key: '#email', value: 'iwona@o2.eu' },
            { key: '#postal', value: '91-413' },
            { key: '#nip', value: '5557123999' },
            { key: '#identity', value: 'QWE666693' },
            { key: '#www', value: 'http://www.xdddddd.com' },
            { key: '#telephone', value: '001123000' },
            { key: '#birth-date', value: '1995-01-20' }],

    ]
    for (i = 0; i < random_data[counter].length; i++) {
        element = random_data[counter][i];
        document.querySelector(element.key).value = element.value;
    }
    counter++;
    if (counter >= random_data.length) {
        counter = 0;
    }
}

function validate() {
    if (!document.getElementById('email').checkValidity()) {
        return false;
    }
    if (!document.getElementById('postal').checkValidity()) {
        return false;
    }
    if (!document.getElementById('nip').checkValidity()) {
        return false;
    }
    if (!document.getElementById('identity').checkValidity()) {
        return false;
    }
    if (!document.getElementById('www').checkValidity()) {
        return false;
    }
    if (!document.getElementById('telephone').checkValidity()) {
        return false;
    }
    if (!document.getElementById('birth-date').checkValidity()) {
        return false;
    }
    return true;
}
function filterClients(e) {
    console.log('pressed')
    const searchInput = document.getElementById('filterinput');
    const field = document.getElementById('fields').value;
    const pattern = searchInput.value;

    const tx = db.transaction("myDatabaseStore", "readwrite");
    const store = tx.objectStore('myDatabaseStore');
    request = store.openCursor();
    const items = [];

    request.onerror = function (event) {
        console.err("error fetching data");
    };



    request.onsuccess = function (event) {
        let cursor = event.target.result;
        if (cursor) {
            let key = cursor.primaryKey;
            let value = cursor.value;
            items.push(value)
            cursor.continue();
            items.forEach(item => {
                if (field == 'all') {
                    const itemString = item.email + ', ' + item.postal + ', ' + item.nip + ', ' +
                        item.idnum + ', ' + item.www + ', ' + item.telephone + ', ' + item.birthdate + '  ';
                    if (!itemString.toLocaleLowerCase().includes(pattern.toLocaleLowerCase())) {
                        const index = items.indexOf(item);
                        items.splice(index, 1);
                    }
                } else {
                    const value = item[field];
                    if (!value.toLocaleLowerCase().includes(pattern.toLocaleLowerCase())) {
                        const index = items.indexOf(item);
                        items.splice(index, 1);
                    }
                }
            })
        }
        updateList(items);
    }
}

window.onload = function () {
    const searchInput = document.getElementById('filterinput');
    const combo = document.getElementById('fields');
    searchInput.addEventListener('keyup', filterClients);
    combo.addEventListener('change', filterClients);
}