// Charger les étudiants au démarrage
// Nouvelle version de l'affichage avec bouton supprimer
async function loadStudents() {
    const response = await fetch('/api/students');
    const students = await response.json();
    const tableBody = document.getElementById('studentTableBody');
    
    tableBody.innerHTML = students.map(s => `
        <tr>
            <td>${s.name}</td>
            <td>${s.age} ans</td>
            <td>${s.grade}</td>
            <td>
                <button style="background:#f39c12" onclick="editStudent(${s.id}, '${s.name}', ${s.age}, '${s.grade}')">Modifier</button>
                <button style="background:#e74c3c" onclick="deleteStudent(${s.id})">Supprimer</button>
            </td>
        </tr>
    `).join('');
}

async function editStudent(id, oldName, oldAge, oldGrade) {
    const name = prompt("Nouveau nom :", oldName);
    const age = prompt("Nouvel âge :", oldAge);
    const grade = prompt("Nouvelle classe :", oldGrade);

    if (name && age) {
        await fetch(`/api/students/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, age, grade })
        });
        loadStudents();
    }
}

async function deleteStudent(id) {
    // Affiche une petite fenêtre de confirmation Windows
    const confirmation = confirm("Es-tu sûr de vouloir supprimer cet étudiant ?");
    
    if (confirmation) {
        await fetch(`/api/students/${id}`, { method: 'DELETE' });
        loadStudents(); 
    }
}
async function addStudent() {
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const grade = document.getElementById('grade').value;

    if(!name || !age) return alert("Remplis au moins le nom et l'âge !");

    await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, age, grade })
    });

    // Vider les champs et recharger la liste
    document.getElementById('name').value = '';
    document.getElementById('age').value = '';
    document.getElementById('grade').value = '';
    loadStudents();
}
function filterStudents() {
    const term = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.querySelectorAll('#studentTableBody tr');

    rows.forEach(row => {
        const name = row.cells[0].textContent.toLowerCase();
        row.style.display = name.includes(term) ? '' : 'none';
    });
}
function handleEnterAdd(event, nextFieldId) {
    if (event.key === "Enter") {
        // Empêche le comportement par défaut (soumission immédiate)
        event.preventDefault(); 
        
        if (nextFieldId === 'SUBMIT') {
            // Si on est sur le dernier champ, on ajoute l'étudiant
            addStudent();
        } else {
            // Sinon, on met le focus sur le champ suivant
            document.getElementById(nextFieldId).focus();
        }
    }
}
loadStudents();