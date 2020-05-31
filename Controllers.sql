select concat(Utilizator.nume, ' ', Utilizator.prenume) as nume, GradProfesional.grad_profesional, 
SpecialitateMedicala.denumire as specialitate, Utilizator.email, Utilizator.telefon
from Medic 
join Utilizator on Medic.id_utilizator = Utilizator.id_utilizator
join GradProfesional on Medic.id_grad = GradProfesional.id_grad
join SpecialitateMedicala on Medic.id_specialitate = SpecialitateMedicala.id_specialitate
where Medic.id_medic = 3;

select 
serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu, serviciuMedical.durata_minima, serviciuMedical.durata_maxima
from Medic
join serviciuMedical on Medic.id_specialitate = serviciuMedical.id_specialitate
where Medic.id_medic = 3;

select
OrarMedic.ziua_saptamanii, OrarMedic.ora_inceput, OrarMedic.ora_sfarsit,
Cabinet.denumire as Cabinet,
Policlinica.denumire as Policlinica
from Medic 
join OrarMedic on Medic.id_medic = OrarMedic.id_medic
join Cabinet on OrarMedic.id_cabinet = Cabinet.id_cabinet
join Policlinica on Policlinica.id_policlinica = Cabinet.id_policlinica
where Medic.id_medic = 3
ORDER BY FIELD(OrarMedic.ziua_saptamanii, 'Lu','Ma','Mi','Joi','Vn', 'Sa');

select * from ProgramPoliclinica;

select 
Cabinet.denumire as Cabinet,
SpecialitateMedicala.denumire as specialitate
from Policlinica 
join Zona on Policlinica.zona_id = Zona.id_zona
join Cabinet on Policlinica.id_policlinica = Cabinet.id_policlinica
join SpecialitateMedicala on SpecialitateMedicala.id_specialitate = Cabinet.id_specialitate
where Policlinica.id_policlinica = 1;

select 
ProgramPoliclinica.ziua_saptamanii, ProgramPoliclinica.ora_inceput, ProgramPoliclinica.ora_sfarsit
from Policlinica 
join Zona on Policlinica.zona_id = Zona.id_zona
join ProgramPoliclinica on Policlinica.id_policlinica = ProgramPoliclinica.id_policlinica
where Policlinica.id_policlinica = 1
ORDER BY FIELD(ProgramPoliclinica.ziua_saptamanii, 'Lu','Ma','Mi','Joi','Vn','Sa');



select Roluri.nume as rol, GradProfesional.grad_profesional, SpecialitateMedicala.denumire as specialitate
from Utilizator
join Roluri on Utilizator.id_rol = Roluri.id_rol
join Medic on Medic.id_utilizator = Utilizator.id_utilizator
join GradProfesional on Medic.id_grad = GradProfesional.id_grad
join SpecialitateMedicala on Medic.id_specialitate = SpecialitateMedicala.id_specialitate
where Utilizator.id_utilizator = 119;

select 
Permisiuni.nume
from Utilizator
join RoluriPermisiuni on Utilizator.id_rol = RoluriPermisiuni.id_rol
join Permisiuni on RoluriPermisiuni.id_permisiune = Permisiuni.id_permisiune
where Utilizator.id_utilizator = 1;

select 
serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu, serviciuMedical.durata_minima, serviciuMedical.durata_maxima
from Utilizator
join Medic on Medic.id_utilizator = Utilizator.id_utilizator
join serviciuMedical on Medic.id_specialitate = serviciuMedical.id_specialitate
where Utilizator.id_utilizator = 120;

select
  OrarMedic.ziua_saptamanii, OrarMedic.ora_inceput, OrarMedic.ora_sfarsit,
  Cabinet.denumire as cabinet,
  Policlinica.denumire as policlinca
  from Utilizator 
  join Medic on Medic.id_utilizator = Utilizator.id_utilizator
  join OrarMedic on Medic.id_medic = OrarMedic.id_medic
  join Cabinet on OrarMedic.id_cabinet = Cabinet.id_cabinet
  join Policlinica on Policlinica.id_policlinica = Cabinet.id_policlinica
  where Utilizator.id_utilizator = 111
  ORDER BY FIELD(OrarMedic.ziua_saptamanii, 'Lu','Ma','Mi','Joi','Vn', 'Sa');

select * from Policlinica;

select 
Programare.data_programarii, Programare.durata, Cabinet.denumire, Policlinica.id_policlinica as policlinica_link_id, Policlinica.denumire as policlinica
from Utilizator
join Medic on Medic.id_utilizator = Utilizator.id_utilizator
join Programare on Programare.id_medic = Medic.id_medic
join Cabinet on Programare.id_cabinet = Cabinet.id_cabinet
join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica
where Utilizator.id_utilizator = 11;

select * from Pacient;

select concat(Utilizator.nume, ' ', Utilizator.prenume) as nume, Utilizator.email, Utilizator.telefon,
Zona.denumire as zona,
asigurareMedicala.denumire as asigurare
from Pacient 
join Utilizator on Pacient.id_utilizator = Utilizator.id_utilizator
join Zona on Pacient.id_zona = Zona.id_zona
join asigurareMedicala on Pacient.id_asigurare = asigurareMedicala.id_asigurare
where Pacient.id_pacient = 3;

select 
serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu, 
discountServMed.procent_discount as discount
from Pacient 
join discountServMed on Pacient.id_asigurare = discountServMed.id_asigurare
join serviciuMedical on discountServMed.id_serviciu = serviciuMedical.id_serviciu
where Pacient.id_pacient = 13;

select * from discountServMed;

select 
Programare.data_programarii, Programare.durata, Cabinet.denumire, Policlinica.id_policlinica as policlinica_link_id, Policlinica.denumire as policlinica
from Utilizator
join Pacient on Pacient.id_utilizator = Utilizator.id_utilizator
join Programare on Programare.id_pacient = Pacient.id_pacient
join Cabinet on Programare.id_cabinet = Cabinet.id_cabinet
join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica
join serviciuMedical on Programare.id_serviciu = serviciuMedical.id_serviciu
join discountServMed on Pacient.id_asigurare = discountServMed.id_asigurare and Programare.id_serviciu = discountServMed.id_serviciu
where Utilizator.id_utilizator = 121;

select 
Programare.data_programarii, Programare.durata, Cabinet.denumire, Policlinica.id_policlinica as policlinica_link_id, Policlinica.denumire as policlinica,
serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu,
discountServMed.procent_discount as discount,
SpecialitateMedicala.denumire as specialitate
from Utilizator
join Pacient on Pacient.id_utilizator = Utilizator.id_utilizator
join Programare on Programare.id_pacient = Pacient.id_pacient
join Cabinet on Programare.id_cabinet = Cabinet.id_cabinet
join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica
join serviciuMedical on Programare.id_serviciu = serviciuMedical.id_serviciu
join discountServMed on Pacient.id_asigurare = discountServMed.id_asigurare and Programare.id_serviciu = discountServMed.id_serviciu
join SpecialitateMedicala on SpecialitateMedicala.id_specialitate = serviciuMedical.id_specialitate
where Utilizator.id_utilizator = 121;

select 
  Programare.data_programarii, Programare.durata, concat(Utilizator.nume, ' ', Utilizator.prenume) as pacient, Cabinet.denumire, Policlinica.id_policlinica as policlinica_link_id, Policlinica.denumire as policlinica,
  serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu,
  discountServMed.procent_discount as discount,
  SpecialitateMedicala.denumire as specialitate
  from Medic
  join Programare on Programare.id_medic = Medic.id_medic
  join Cabinet on Programare.id_cabinet = Cabinet.id_cabinet
  join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica
  join Pacient on Programare.id_pacient = Pacient.id_pacient
  join serviciuMedical on Programare.id_serviciu = serviciuMedical.id_serviciu
  join discountServMed on Pacient.id_asigurare = discountServMed.id_asigurare and Programare.id_serviciu = discountServMed.id_serviciu
  join SpecialitateMedicala on SpecialitateMedicala.id_specialitate = serviciuMedical.id_specialitate
  join Utilizator on Medic.id_utilizator = Utilizator.id_utilizator
  where Medic.id_medic = 10;


select * from Programare;
