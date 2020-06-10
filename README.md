# DisertatieBackEnd

Aplicatie Web de gestionare a programilor efectuate in cadrul unei clinici medicale:

# Getting Started:
`npm run dev`

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
2. /api/policlinici: unde vor fi requesturile de creare, vizualizare, editare si stergere a policlinicilor
3. /api/cabinete: unde vor fi requesturile de creare, vizualizare, editare si stergere a cabinetelor
4. /api/pacienti: unde vor fi requesturile de creare, vizualizare, editare si stergere a pacientilor
5. /api/programari: unde vor fi requesturile de creare, vizualizare, editare si stergere a programarilor

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


# Roluri/permisiuni (MVP):
1. Pacient
  - isi poate vizualiza si edita profilul de utilizator (date de identificare, email, telefon)
      - /utilizatori/:id
      - /utilizatori/:id/edit
  - poate vizualiza si edita profilul sau de pacient
      - /pacienti/:id
      - /pacienti/:id/edit
  - poate vizualiza lista medicilor din clinica precum si profilul lor + poate sa faca programari in dreptul lor
      - /medici/
      - /medici/:id
      - /medici/:id/programare
  - isi poate vizualiza, edita si sterge programarile realizate de el
      - Tabel Programari din pagina de /pacienti/:id
      - /programari/:id - vizualizare
      - /programari/:id/edit
      - delete /programari/:id

2. Medic
  - isi poate vizualiza profilul sau de medic precum si lista medicilor din clinica
      - /medici/
      - /medici/:id
  - isi poate vizualiza si edita profilul de utilizator (date de identificare, email, telefon)
      - /utilizatori/:id
      - /utilizatori/:id/edit
  - isi poate vizualiza, edita si sterge programarile realizate de pacient
      - Tabel Programari din pagina de /medici/:id
      - /programari/:id
      - /programari/:id/edit
      - delete /programari/:id
  - poate vizualiza si edita profilul pacientilor
      - /pacienti/:id
      - /pacienti/:id/edit

3. Admin
  - Poate adauga utilizatori noi
    - /utilizatori/add
  - poate edita datele de profil pentru medici + poate sterge medici:
    - /medici/:id/edit
    - delete /medici/:id/
  - poate edita datele de profil pentru pacienti + poate sterge pacienti:
    - /pacienti/:id/edit
    - delete /pacienti/:id/
  - Poate vizualiza toate programarile si le poate edita sau sterge
    - /programari
    - /programari/:id/edit
    - Delete /programari/:id/

# Roluri/permisiuni (Nice to have):
0. Vizitator
 + sa-si poate face o programare la un medic introducandu-si nume, prenume, email si telefon - nefacand parte din pacientii clinicii
2. Medic
  + - poate vizualiza si edita profilul doar al pacientilor care au solicitat programarile si care apar in istoric drept pacienti ai acestui medic
  + poate sa faca o programare cu un pacient
  - /pacient/:id/programare
3. Admin:
  + poate sa faca o programare (oricare pacient cu oricare medic)
  - /programare/add