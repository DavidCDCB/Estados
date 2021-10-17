var app = new Vue({
	el: '#app',
	mounted() {

	},
	data: {
		data: [],
		estado: {},
		colores: {
			7:'#A5D788',
			6:'#38A8A1',
			5:'#3777A4',
			4:'#4537A4',
			3:'#541C38',
			2:'#260D1E',
			1:'#09050F'
		}
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
		getColorProm(value){
			if(value > 7){
				return this.colores[7];
			}
			if(value > 6){
				return this.colores[6];
			}
			if(value > 5){
				return this.colores[5];
			}
			if(value > 4){
				return this.colores[4];
			}
			if(value > 3){
				return this.colores[3];
			}
			if(value > 2){
				return this.colores[2];
			}
			if(value > 1){
				return this.colores[1];
			}
		},

		getdata() {
			let labels = [];
			let levels = [];
			let listColors = [];
			let promedios = [];
			let sumatoria = 0;
			let tagsProm = [];
			let colorsProm = [];
			let grupo = 0;
			let conteos = {
				"Alegre":0,
				"Excelente":0,
				"Bien":0,
				"Normal":0,
				"Ansioso":0,
				"Mal":0,
				"Una Mierda":0
			};
			let actual = 0;
			let cambios = {
				"aumentos":0,
				"decrementos":0
			};

			this.downData().then(r => {
				this.data = Object.values(r.data);
				grupo = Math.round(this.data.length/50);
				for (const iterator of this.data) {
					labels.push(iterator.Fecha);
					levels.push(iterator.Nivel);
					conteos[iterator.Estado] += 1;
					listColors.push(this.colores[iterator.Nivel]);
					sumatoria += iterator.Nivel;

					if(levels.length % grupo == 0){
						promedios.push((sumatoria/levels.length));
						tagsProm.push(iterator.Fecha);
						colorsProm.push(this.getColorProm(sumatoria/levels.length));
					}
					
					
				}

				for (const iterator of promedios) {
					if(iterator > actual){
						cambios["aumentos"]++;
					}else{
						cambios["decrementos"]++;
					}
					actual = iterator;
				}

				const data = {
					labels: labels,
					datasets: [{
						label: `${levels.length} Estados de ánimo`,
						backgroundColor: listColors,
						data: levels,
						borderWidth: 1,
					}]
				};
				const config = {
					type: 'line',
					data: data,
					options: {
						responsive: true,
						indexAxis: 'x',
						layout: {
							padding: 20
						},
						scales: {
							y: {
								grid:{
									display:false
								}
							}
						}
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
						backgroundColor: Object.values(this.colores).reverse()
					}]
				};
				const config2 = {
					type: 'pie',
					data: data2,
					options: {
						padding:{
							left: 100,
							right: 100
						}
					},
				};
				var myChart2 = new Chart(
					document.getElementById('cantidades'),
					config2
				);

				const data3 = {
					labels: tagsProm,
					datasets: [{
						label: `Promedios por cada ${grupo} registros (${(sumatoria/levels.length).toFixed(2)} actual)`,
						backgroundColor: '#063346',
						borderColor: '#282c34',
						borderWidth: 1,
						pointRadius: 7,
						data: promedios,
						backgroundColor: colorsProm
					}]
				};
				const config3 = {
					type: 'bar',
					data: data3,
					options:  {
						layout: {
							padding:{
								left: 100,
								right: 100
							}
						},
						scales: {
							y: {
								max: 7,
								min: 1,
								scaleOverride : true,
								scaleStartValue : 1,
								grid:{
									color:"#282c34"
								}
							}
						}
					},
				};
				var myChart3 = new Chart(
					document.getElementById('promedios'),
					config3
				);

				const labels3 = ["Incrementos","Decrementos"];
				const data4 = {
					labels: labels3,
					datasets: [{
						label: 'Conteo por estado',
						data: Object.values(cambios),
						backgroundColor: ["#a5d788","#09050f"]
					}]
				};
				const config4 = {
					type: 'doughnut',
					data: data4,
					options: {
						layout: {
							padding:{
								left: 100,
								right: 100
							}
						}
					},
				};
				var myChart4 = new Chart(
					document.getElementById('cambios'),
					config4
				);
			});
		}
	}
});
