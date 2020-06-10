use medicalAppDevelopment;
SET SQL_SAFE_UPDATES = 0;

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

select * from SpecialitateMedicala;

select Programare.id_programare as link_programare_id, 
serviciuMedical.denumire_serviciu as serviciu_medical,
SpecialitateMedicala.denumire as specialitate_medicala,
moment_programare, durata, status_programare,
Cabinet.denumire as Cabinet, Cabinet.id_cabinet as link_cabinet_id, 
Policlinica.denumire as Policlinica, Policlinica.id_policlinica as link_policlinica_id from Programare
join serviciuMedical on Programare.id_serviciu = serviciuMedical.id_serviciu
join Cabinet on Programare.id_cabinet = Cabinet.id_cabinet
join SpecialitateMedicala on Cabinet.id_specialitate = SpecialitateMedicala.id_specialitate
join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica;


select serviciuMedical.denumire_serviciu as serviciu_medical,
SpecialitateMedicala.denumire as specialitate_medicala,
moment_programare, durata, status_programare,
Cabinet.denumire as Cabinet, Cabinet.id_cabinet as link_cabinet_id, 
Policlinica.denumire as Policlinica, Policlinica.id_policlinica as link_policlinica_id from Programare
join serviciuMedical on Programare.id_serviciu = serviciuMedical.id_serviciu
join Cabinet on Programare.id_cabinet = Cabinet.id_cabinet
join SpecialitateMedicala on Cabinet.id_specialitate = SpecialitateMedicala.id_specialitate
join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica
where Programare.id_programare = 502;

select concat(Utilizator.nume, ' ', Utilizator.prenume) as pacient_programare,
Programare.id_pacient as link_pacient_id from Programare 
join Pacient on Programare.id_pacient = Pacient.id_pacient
join Utilizator on Utilizator.id_utilizator = Pacient.id_utilizator
where Programare.id_programare = 502;

select concat(Utilizator.nume, ' ', Utilizator.prenume) as medic_programare,
Programare.id_medic as link_medic_id from Programare 
join Medic on Programare.id_medic = Medic.id_medic
join Utilizator on Utilizator.id_utilizator = Medic.id_utilizator
where Programare.id_programare = 502;

select * from GradProfesional;

select serviciuMedical.id_serviciu as link_serviciu_id, serviciuMedical.denumire_serviciu, SpecialitateMedicala.denumire as specialitate_medicala, serviciuMedical.cost_serviciu, serviciuMedical.durata_minima, serviciuMedical.durata_maxima
from serviciuMedical
join SpecialitateMedicala on serviciuMedical.id_specialitate = SpecialitateMedicala.id_specialitate
where serviciuMedical.id_serviciu = 12;

select concat(Utilizator.nume, ' ', Utilizator.prenume) as nume,
GradProfesional.grad_profesional,
Medic.id_medic as link_medic_id
from Medic
join GradProfesional on Medic.id_grad = GradProfesional.id_grad
join Utilizator on Utilizator.id_utilizator = Medic.id_utilizator
join SpecialitateMedicala on Medic.id_specialitate = SpecialitateMedicala.id_specialitate 
join serviciuMedical on SpecialitateMedicala.id_specialitate = serviciuMedical.id_specialitate
where serviciuMedical.id_serviciu = 12;

select * from Zona;

select Cabinet.denumire, Policlinica.denumire as policlinica, Policlinica.id_policlinica as link_policlinica_id, Zona.denumire as zona
from Cabinet
join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica
join Zona on Policlinica.zona_id = Zona.id_zona
join SpecialitateMedicala on Cabinet.id_specialitate = SpecialitateMedicala.id_specialitate 
join serviciuMedical on SpecialitateMedicala.id_specialitate = serviciuMedical.id_specialitate
where serviciuMedical.id_serviciu = 12;

select * from SpecialitateMedicala;

select asigurareMedicala.denumire as asigurare, asigurareMedicala.id_asigurare as link_asigurare_id, discountServMed.procent_discount
from serviciuMedical
join discountServMed on serviciuMedical.id_serviciu = discountServMed.id_serviciu
join asigurareMedicala on discountServMed.id_asigurare = asigurareMedicala.id_asigurare
where serviciuMedical.id_serviciu = 12;

select discountServMed.id_serviciu as link_serviciu_id, 
serviciuMedical.denumire_serviciu as serviciu_medical, SpecialitateMedicala.denumire as specialitate_medicala, serviciuMedical.cost_serviciu,
discountServMed.procent_discount 
from discountServMed 
join serviciuMedical on serviciuMedical.id_serviciu = discountServMed.id_serviciu
join SpecialitateMedicala on serviciuMedical.id_specialitate = SpecialitateMedicala.id_specialitate 
join asigurareMedicala on asigurareMedicala.id_asigurare = discountServMed.id_asigurare
where asigurareMedicala.id_asigurare = 1;


select * from SpecialitateMedicala;

select Cabinet.denumire, 
SpecialitateMedicala.denumire as specialiatea, 
Policlinica.denumire as policlinica, 
Policlinica.id_policlinica as link_policlinica_id, 
ProgramPoliclinica.ziua_saptamanii,
ProgramPoliclinica.ora_inceput,
ProgramPoliclinica.ora_sfarsit,
Zona.denumire as zona
from Cabinet
join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica
join ProgramPoliclinica on Policlinica.id_policlinica = ProgramPoliclinica.id_policlinica
join Zona on Policlinica.zona_id = Zona.id_zona
join SpecialitateMedicala on Cabinet.id_specialitate = SpecialitateMedicala.id_specialitate;

insert into Medic(id_utilizator) values ((select id_utilizator from Utilizator where nume_utilizator = 'petrecornelbratila'));

select * from Utilizator where nume = 'BORDAS';

select * from Medic;

delete from Roluri where id_rol = 2;

update OrarMedic set ziua_saptamanii = 'Duminica' where ziua_saptamanii = 'Du';

alter table OrarMedic modify ziua_saptamanii enum('Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata', 'Duminica');


select distinct grupa_sanguina from Donator ORDER BY FIELD(grupa_sanguina, '0_I pozitiv','0_I negativ','A_II pozitiv','A_II negativ','B_III pozitiv', 'B_III negativ', 'AB_IV pozitiv', 'AB_IV negativ');

select * from Utilizator;

select 
  serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu, SpecialitateMedicala.denumire as specialitate, 
  discountServMed.procent_discount as discount
  from Pacient 
  join discountServMed on Pacient.id_asigurare = discountServMed.id_asigurare
  join serviciuMedical on discountServMed.id_serviciu = serviciuMedical.id_serviciu
  join SpecialitateMedicala on serviciuMedical.id_specialitate = SpecialitateMedicala.id_specialitate
  where Pacient.id_pacient = 111;
  
select distinct grupa_sanguina from Donator;

select id_pacient from Pacient order by id_pacient desc limit 1;

alter table Donator drop column rh;

select id_pacient from Pacient order by id_pacient desc limit 1;


insert into Donator (grupa_sanguina, data_ultimei_donari, id_pacient) values ('AB_IV pozitiv', '2020-06-01', (select id_pacient from Pacient order by id_pacient desc limit 1));


select Utilizator.id_utilizator, Utilizator.nume, Utilizator.prenume, Utilizator.nume_utilizator, Utilizator.email, Utilizator.telefon,
    Pacient.data_nasterii,
    Zona.denumire as zona,
    Zona.id_zona,
    asigurareMedicala.denumire as asigurare,
    Donator.grupa_sanguina,
    Donator.data_ultimei_donari
    from Pacient 
    join Utilizator on Pacient.id_utilizator = Utilizator.id_utilizator
    join Zona on Pacient.id_zona = Zona.id_zona
    join asigurareMedicala on Pacient.id_asigurare = asigurareMedicala.id_asigurare
    left join Donator on Pacient.id_pacient = Donator.id_pacient
    where Pacient.id_pacient = 47;
    
    
select id_pacient from Pacient where id_utilizator = 615;

DELETE FROM Programare WHERE id_pacient = (select id_pacient from Pacient where id_utilizator = 615);

select 
  Programare.moment_programare, Programare.durata, Programare.id_programare as programare_link_id, Cabinet.denumire, 
  Policlinica.id_policlinica as policlinica_link_id, Policlinica.denumire as policlinica,
  serviciuMedical.denumire_serviciu, serviciuMedical.cost_serviciu,
  SpecialitateMedicala.denumire as specialitate
  from Utilizator
  join Medic on Medic.id_utilizator = Utilizator.id_utilizator
  join Programare on Programare.id_medic = Medic.id_medic
  join Cabinet on Programare.id_cabinet = Cabinet.id_cabinet
  join Policlinica on Cabinet.id_policlinica = Policlinica.id_policlinica
  join serviciuMedical on Programare.id_serviciu = serviciuMedical.id_serviciu
  join SpecialitateMedicala on SpecialitateMedicala.id_specialitate = serviciuMedical.id_specialitate
  where Utilizator.id_utilizator = 123;

select 
  Permisiuni.nume
  from Utilizator
  join RoluriPermisiuni on Utilizator.id_rol = RoluriPermisiuni.id_rol
  join Permisiuni on RoluriPermisiuni.id_permisiune = Permisiuni.id_permisiune
  where Utilizator.id_utilizator = 18;
  
delete from Utilizator where nume = '';
select * from serviciuMedical;

select OrarMedic.id_orar, OrarMedic.ziua_saptamanii, OrarMedic.ora_inceput, OrarMedic.ora_sfarsit, 
Cabinet.denumire as cabinet, Policlinica.id_policlinica as link_policlinica_id, Policlinica.denumire as policlinica
from OrarMedic 
join Cabinet on Cabinet.id_cabinet = OrarMedic.id_cabinet
join Policlinica on Policlinica.id_policlinica = Cabinet.id_policlinica
where id_medic = 82;

select
    Cabinet.id_cabinet,
    Cabinet.denumire as cabinet,
    Policlinica.denumire as policlinica
    from Medic 
    join OrarMedic on Medic.id_medic = OrarMedic.id_medic
    join Cabinet on OrarMedic.id_cabinet = Cabinet.id_cabinet
    join Policlinica on Policlinica.id_policlinica = Cabinet.id_policlinica
    where Medic.id_medic = 82;

select OrarMedic.id_medic, Cabinet.id_cabinet,
Policlinica.id_policlinica as link_policlinica_id, Policlinica.denumire as policlinica
from OrarMedic 
join Cabinet on Cabinet.id_cabinet = OrarMedic.id_cabinet
join Policlinica on Policlinica.id_policlinica = Cabinet.id_policlinica;

select * from Programare;

select * from serviciuMedical;

select distinct 
    Cabinet.id_cabinet, Cabinet.denumire as cabinet, Policlinica.id_policlinica as link_policlinica_id, Policlinica.denumire as policlinica
    from OrarMedic 
    join Cabinet on Cabinet.id_cabinet = OrarMedic.id_cabinet
    join Policlinica on Policlinica.id_policlinica = Cabinet.id_policlinica
    join Programare.id_medic = OrarMedic.id_medic
    where Programare.id_programare = 509;
