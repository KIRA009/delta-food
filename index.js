function get(name, key) {
	// returns array or the value of the dictionary key

	var key = key || 'none';
	
	if (key == 'none') {
		return JSON.parse(storage.getItem(name));
	}

	return JSON.parse(storage.getItem(name))[key];
}


function get_date() {
	var dt = new Date();
	dt.setTime(dt.getTime() + 19800000);
	return dt.toISOString().split("T")[0];
}


function draw(items) {
	// Adds the food items from localStorage object

	var container = document.getElementById('container');
	container.innerHTML = '';

	for (i=0; i<items.length; i++) {
		var item = items[i];
		var food = item['name'];
		var carb = item['carb'];
		var fat = item['fat'];
		var protein = item['protein'];
		var date = item['date'];
		var html = '<div class="card"> \
						<div class="card-title">' +  food + '</div> \
						<div class="close" onclick="remove(this)">x</div> \
						<table> \
							<tr> \
								<div class="nutri"> \
									<td>Carb:</td> \
									<td style="padding-right: 0;"> \
										<div class="cal">' + carb + '</div> \
									</td> \
									<td style="text-align: left;"> \
										<span class="addon">calories</span> \
									</td> \
								</div> \
							</tr> \
							<tr> \
								<div class="nutri"> \
									<td>Fat:</td> \
									<td style="padding-right: 0;"> \
										<div class="cal">' + fat + '</div> \
									</td> \
									<td style="text-align: left;"> \
										<span class="addon">calories</span> \
									</td> \
								</div> \
							</tr> \
							<tr> \
								<div class="nutri"> \
									<td>Proteins:</td> \
									<td style="padding-right: 0;"> \
										<div class="cal">' + protein + '</div> \
									</td> \
									<td style="text-align: left;"> \
										<span class="addon">calories</span> \
									</td> \
								</div> \
							</tr> \
						</table> \
						<div class="date"> \
							<span>Date:</span> \
							<span>' + date + '</span> \
						</div> \
					</div>';

		container.innerHTML += html;
	}

	return items;
}

function nutri_string(ex_fats, ex_carbs, ex_proteins) {
	// updates the info string, which gives info about remaining requirement for the day
	var ex_carbs = ex_carbs || false;
	var ex_fats = ex_fats || false;
	var ex_proteins = ex_proteins || false;

	var fats = get('calories', 'fats').toFixed(2);
	var carbs = get('calories', 'carbs').toFixed(2);
	var proteins = get('calories', 'proteins').toFixed(2);

	var fat = ' <b' + (ex_fats ? ' class=\"red\"' : '') + '>' + fats + '</b> calories of fat';
	var carb = ' <b' + (ex_carbs ? ' class=\"red\"' : '') + '>' + carbs + '</b> calories of carbs';
	var protein = ' <b' + (ex_proteins ? ' class=\"red\"' : '') + '>' + proteins + '</b> calories of proteins';

	var str = 'You have' + fat + carb + protein + '<br>left to achieve your daily calorific need';

	document.getElementById('info').innerHTML = str;
}

function select(choice) {
	// toggles between the gender choices

	choices = document.getElementsByClassName('choice');

	for (i=0; i<2; i++) {
		choices[i].classList.remove('clicked');
	}

	choice.classList.add('clicked');
}

function calculate() {
	// calculates the daily requirement

	age = document.getElementById('age').value;
	height = document.getElementById('height').value;
	weight = document.getElementById('weight').value;
	
	choice = document.getElementsByClassName('clicked')[0].id;

	if (age == '' || height == '' || weight == '') {
		// checks if any field(s) is/are empty

		alert('Incomplete');
		return;
	}

	calories = 10 * weight + 6.25 * height - 5 * age + choice;

	var calories = {
		'fats': (calories * .3),
		'carbs': (calories * .55),
		'proteins': (calories * .15)
	}

	check_items(calories);  // new value of calories

	document.getElementById('sidebar').classList.remove('active');
	document.getElementsByClassName('menu')[0].innerHTML = 'Calculate';
}

function calculate_nutri(button) {
	// adds food item and updates requirements

	food = document.getElementById('food');
	fat = document.getElementById('fat');
	carb = document.getElementById('carbs');
	protein = document.getElementById('proteins');

	if (food.value == '' || fat.value == '' || carb.value == '' || protein.value == '') {
		// checks if any field(s) is/are empty

		alert('Incomplete');
		return;
	}

	var food_item = {
		'name': food.value,
		'carb': carb.value,
		'fat': fat.value,
		'protein': protein.value,
		'date': get_date()
	}

	items = get('items');

	items.unshift(food_item);  // add new food item to beginning

	storage.setItem('items', JSON.stringify(items));  // update the food item list

	check_items();

	// reset the field values
	food.value = ''
	fat.value = ''
	carb.value = ''
	protein.value = ''

	button = document.getElementById('add');
	add(button);
}

function toggle(menu) {
	// toggle sidebar state

	sidebar = document.getElementById('sidebar');
	
	if (sidebar.classList.length) {
		menu.innerHTML = 'Calculate';
		sidebar.classList.remove('active');
	}
	
	else {
		menu.innerHTML = 'Close';
		sidebar.classList.add('active');
	}

}

function add(button) {
	// animation from add button

	item = document.getElementById('item');

	if (item.classList.value == 'open') {
		button.classList.remove('clicked');
		item.classList.remove('open');
		document.getElementsByTagName('body')[0].classList.remove('modal');
		item.style.display = 'none';
		document.getElementById('container').classList.remove('open');
	}
	else {
		button.classList.add('clicked');
		item.classList.add('open');
		document.getElementsByTagName('body')[0].classList.add('modal');
		item.style.display = 'block';
		document.getElementById('container').classList.add('open');
	}
}

function check_items(calories) {

	var ex_carbs, ex_fats, ex_proteins;

	calories = calories || {
		// setting default values

		'fats': 524.63,
		'carbs': 961.82,
		'proteins': 262.31
	};

	items = get('items');

	if (items == null) {
		// if items not in localStorage

		items = [];  // array to store food items
		storage.setItem('items', JSON.stringify(items));
	}

	else {
		if (items.length == 1) {
			 if (new Date(get_date()) > new Date(items[0]['date'])) {
			 	items = [];
			 	storage.setItem('items', JSON.stringify(items));
			 	initiate_page();
			}
		}

		else if (items.length > 1) {
			if (new Date(get_date()) > new Date(items[1]['date'])) {
			 	items = [items[0]];
			 	storage.setItem('items', JSON.stringify(items));
			 	initiate_page();
			}
		}

		for (i=0; i<items.length; i++) {

			item= items[i];

			for (var key in calories) {
				//updates the individual calories

				calories[key] -= item[key.slice(0, -1)];

				if (calories[key] < 0) {
					alert('Overeating!!! ' + key + ' requirement has exceeded limit');
					eval("ex_" + key + "= true");
				}
			}
		}
	}

	draw(get('items'));

	storage.setItem('calories', JSON.stringify(calories));  // add calories object to localStorage

	nutri_string(ex_fats, ex_carbs, ex_proteins);
}

function remove(close) {
	// removes an item
	var nodes = Array.prototype.slice.call(document.getElementsByClassName('close'));  // get all close buttons
	close.parentElement.classList.add('clicked');  // add animation
	items = get('items');
	items.splice(nodes.indexOf(close), 1);  // remove the item from the array
	storage.setItem('items', JSON.stringify(items));
	setTimeout(function() {
		check_items();
	}, 500);
}

function initiate_page() {
	pattern = new RegExp(/\d+\/\d+\/\d+/);
	storage = window.localStorage;  // localStorage object
	check_items();
}