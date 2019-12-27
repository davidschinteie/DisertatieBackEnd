# DisertatieBackEnd

Aplicatie Web de gestionare a programilor efectuate in cadrul unei clinici medicale:

# Getting Started:
`npm start dev`

# Tehnologii folosite
  - DB: MySQL
  - BackEnd: Node.JS with Express
  - Nice to have: 
    - GraphQL for API ??
    - Elixir.js ??
    
# Feature-uri de implementat (MVP):
  - Crearea unui profil de Pacient: Userul sa se poata autentifica in aplicatie si sa-si poata face o programare in functie de disponibilitatea medicilor si a cabinetelor. (o vizualizarea a unui calendar cu datele disponibile si orele la care poate sa-si faca programarea)
- Crearea unui profil de Medic: Medicul sa poata sa vizualizeze calendarul cu programarile facute pana acum.
- Crearea unui profil de Admin: Adminul care sa poata sa aiba acces la toate datele si sa poata sa faca request-uri cu privire la gradul de ocupare a clinicii, medicii cei mai 'ceruti', pacientii 'fideli' etc.

# API:
1. /api/medici: unde vor fi requesturile de creare, vizualizare, editare si stergere a medicilor
2. /api/pacienti: unde vor fi requesturile de creare, vizualizare, editare si stergere a pacientilor
3. /api/programari: unde vor fi requesturile de creare, vizualizare, editare si stergere a programarilor
4. /api/cabinete: unde vor fi requesturile de creare, vizualizare, editare si stergere a cabinetelor

# ToDos (MVP):
1. Vizualizarea datelor (cabinete, medici, pacienti, programari etc) din dashboard-ul aplicatiei
2. Actualizarea datelor (Update, Insert, Delete)
3. Realizarea unei programari in functie de pacient, data, cabinet sau medic
4. Autentificare in aplicatie pentru partea de pacient, medic, admin
5. Setarea de permisiuni la crearea unui cont (pacient / medic / admin)
6. Vizualizarea si editarea datelor in functie de permisiuni

# ToDos (Nice To Have):
1. Adaugarea Google maps la fiecare cabinet si de tinut cont de locatia cabinetului la programare
2. Logarea Utilizatorului cu ajutorul scanarii cardului medical de pe telefon [openCV with NodeJS](https://www.npmjs.com/package/opencv4nodejs)
3. Vizualizarea de rapoarte pe baza datelor deja existente cu ajutorul D3.js (charts and other stuff) 
4. Upload de noi programari din fisiere csv sau excel
5. Crearea unei noi programari in functie de optiunile disponibile (eventual de afisat intr-un forma vizuala complexa)
