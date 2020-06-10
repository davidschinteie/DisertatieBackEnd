//  @todo: de facut inaccesibil data de programare inainte de data curenta
//  @todo: de facut inaccesibil ora de programare inainte de ora curenta
//  @todo: de facut inaccesibil ora de programare in afara orelor de program afisate in orarul medicului

console.log(locations);

function parseDate(s) {
  var b = s.split(/\D/);
  return new Date(b[0], --b[1], b[2]);
}

// input for today
Date.prototype.toDateInputValue = (function () {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
});

let data_programare_value;

const data_programare = document.getElementById('grid-data_programare'),
  data_serviciu = document.getElementById('grid-servicii_medicale'),
  output_program = document.getElementById('output_program'),
  output_serviciu = document.getElementById('output_serviciu'),
  zile = ['Duminica', 'Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata', 'Duminica'];

function get_orar_medic(day) {
  output_program.innerHTML = '';
  locations.forEach((element) => {
    if (element.ziua_saptamanii == zile[day]) {
      output_program.innerHTML += `
      <div class="flex" id="orar_${element.id_orar}">
        <input type="radio" id="${element.id_orar}" value="${element.id_orar}" name="orar_medic_id" checked>
        <label class="bg-white rounded-lg p-4 shadow" for="${element.id_orar}"> 
          <span class="text-gray-900 relative inline-block date uppercase font-medium tracking-widest text-left">${element.ziua_saptamanii}</span>
          <div class="flex mb-2">
            <div class="w-3/12">
              <span class="text-sm text-gray-600 block">${element.ora_inceput.slice(0, -3)}</span>
              <span class="text-sm text-gray-600 block">${element.ora_sfarsit.slice(0, -3)}</span>
            </div>
            <div class="w-1/12">
              <span class="bg-blue-400 h-2 w-2 rounded-full block mt-2"></span>
            </div>
            <div class="w-8/12">
              <span class="text-sm block">${element.cabinet}</span>
              <span class="text-sm">${element.policlinica}</span>
            </div>
          </div>
        </label>
      </div>`;
    }
  })
}

// set data programare to today
if (document.getElementById('grid-data_programare').value == '') {
  document.getElementById('grid-data_programare').value = new Date().toDateInputValue();
  data_programare_value = new Date().toDateInputValue();
} else {
  data_programare_value = document.getElementById('grid-data_programare').value;
}

// init data programare with today's input
get_orar_medic(parseDate(data_programare_value).getDay());

// update data programare with input value
data_programare.addEventListener('change', (event) => {
  get_orar_medic(parseDate(event.target.value).getDay());
});

function get_features_serviciu(serviciu) {
  servicii_medicale.forEach((element) => {
    if (element.id_serviciu == serviciu) {
      output_serviciu.innerHTML = `
      <div class="flex" id="serviciu_${element.id_serviciu}">
        <input type="radio" id="${element.id_serviciu}" value="${element.id_serviciu}" name="serviciu_id" checked>
        <label class="bg-white rounded-lg p-4 shadow" for="${element.id_serviciu}">
          <div>
            <h3 class="text-3xl font-semibold leading-normal mb-2 text-gray-800 mb-4"> 
              <i class="fas fa-hand-heart mr-2"></i>
              ${element.denumire_serviciu}
            </h3>
            <p class="text-gray-900 font-medium">
              Cost serviciu: ${element.cost_serviciu} RON
            </p>
            <p class="text-gray-900 font-medium">
              Durata: ${element.durata_maxima.slice(0, -3)} h
            </p>
          </div>
        </label>
      </div>`;
    }
  })
}

// init serviciu with default's input
get_features_serviciu(data_serviciu.options[data_serviciu.selectedIndex].value);

// update data programare with input value
data_serviciu.addEventListener('change', (event) => {
  // console.log();
  get_features_serviciu(event.target.value);
});