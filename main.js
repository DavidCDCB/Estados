var app = new Vue({
	el: '#app',
	mounted() {

	},
	data: {
		data: [],
		estado: {},
	},
	methods: {
		async downData() {
			return await axios.get('https://bdethos-default-rtdb.firebaseio.com/status.json');
		},
		upData(level, name) {
			this.estado = {
				"Estado": name,
				"Nivel": level,
				"Fecha": new Date().toLocaleDateString('es-co', { weekday:"long", year:"numeric", month:"short", day:"numeric"}) 
			}
			if (this.estado != null) {
				axios.post('https://bdethos-default-rtdb.firebaseio.com/status.json',
					this.estado, {
					headers: {
						'Content-Type': 'application/json'
					}
				}
				).then(response => {
					console.log(response);
					swal({
						text: `Datos almacenados correctamente`,
						className: "",
						icon: "success",
						button: "OK",
						dangerMode: false
					});
				});
			}
		},
		getdata() {
			let labels = [];
			let levels = [];
			let conteos = {
				"Alegre":0,
				"Excelente":0,
				"Bien":0,
				"Normal":0,
				"Ansioso":0,
				"Mal":0,
				"Una Mierda":0
			};

			this.downData().then(r => {
				console.log(Object.values(r.data));
				this.data = Object.values(r.data);
				for (const iterator of this.data) {
					console.log(iterator.Fecha);
					labels.push(iterator.Fecha);
					levels.push(iterator.Nivel);
					conteos[iterator.Estado] += 1;
				}

				console.log(conteos);

				const data = {
					labels: labels,
					datasets: [{
						label: 'Estados de ánimo',
						backgroundColor: '#063346',
						borderColor: '#063346',
						data: levels,
					}]
				};
				const config = {
					type: 'line',
					data: data,
					options: {
						responsive: true,
					}
				};
				var myChart = new Chart(
					document.getElementById('estados'),
					config
				);

				const labels2 = Object.keys(conteos);
				const data2 = {
					labels: labels2,
					datasets: [{
						label: 'Conteo por estado',
						data: Object.values(conteos),
						backgroundColor: [
							'#A5D788',
							'#38A8A1',
							'#3777A4',
							'#4537A4',
							'#541C38',
							'#260D1E',
							'#09050F'
						]
					}]
				};
				const config2 = {
					type: 'pie',
					data: data2,
					options: {
						scales: {
							y: {
								beginAtZero: true
							}
						}
					},
				};
				var myChart2 = new Chart(
					document.getElementById('cantidades'),
					config2
				);
			});
		}
	}
});
