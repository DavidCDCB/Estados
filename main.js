var app = new Vue({
	el: '#app',
	mounted() {

	},
	data: {
		data: [],
		estado: {},
		raw: "Fecha,Valor\n",
		rawProm: "Fecha,Valor\n",
		colores: {
			7: '#A5D788',
			6: '#38A8A1',
			5: '#3777A4',
			4: '#4537A4',
			3: '#541C38',
			2: '#260D1E',
			1: '#09050F'
		}
	},
	methods: {
		downloadData(filename, textInput){
			var element = document.createElement('a');
			element.setAttribute('href','data:text/csv;charset=utf-8, ' + encodeURIComponent(textInput));
			element.setAttribute('download', filename);
			document.body.appendChild(element);
			element.click();
		},
		async downData() {
			return await axios.get('https://bdethos-default-rtdb.firebaseio.com/status.json');
		},
		upData(level, name) {
			this.estado = {
				"Estado": name,
				"Nivel": level,
				"Fecha": new Date().toLocaleDateString('es-co', { weekday: "long", year: "numeric", month: "short", day: "numeric" })
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
		getColorProm(value) {
			if (value > 7) {
				return this.colores[7];
			}
			if (value > 6) {
				return this.colores[6];
			}
			if (value > 5) {
				return this.colores[5];
			}
			if (value > 4) {
				return this.colores[4];
			}
			if (value > 3) {
				return this.colores[3];
			}
			if (value > 2) {
				return this.colores[2];
			}
			if (value > 1) {
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
			let actual = 0;
			let conteos = {
				"Alegre": 0,
				"Excelente": 0,
				"Bien": 0,
				"Normal": 0,
				"Ansioso": 0,
				"Mal": 0,
				"Una Mierda": 0
			};
			let cambios = {
				"aumentos": 0,
				"decrementos": 0
			};

			this.downData().then(r => {
				this.data = Object.values(r.data);
				grupo = Math.round(this.data.length / 48);
				for (const iterator of this.data) {
					labels.push(iterator.Fecha);
					levels.push(iterator.Nivel);
					conteos[iterator.Estado] += 1;
					listColors.push(this.colores[iterator.Nivel]);
					sumatoria += iterator.Nivel;

					if (levels.length % grupo == 0) {
						promedios.push((sumatoria / levels.length));
						tagsProm.push(iterator.Fecha);
						colorsProm.push(this.getColorProm(sumatoria / levels.length));
						this.rawProm += iterator.Fecha.split(",")[1]+","+(sumatoria / levels.length)+"\n";
					}
					this.raw += iterator.Fecha.split(",")[1]+","+iterator.Nivel+"\n";
				}
				actual = promedios[0];
				for (const iterator of promedios) {
					if (iterator > actual) {
						cambios["aumentos"] += iterator - actual;
					} else if (iterator < actual) {
						cambios["decrementos"] += actual - iterator;
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
								grid: {
									display: false
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
						padding: {
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
						label: `Promedios por cada ${grupo} registros (${(sumatoria / levels.length).toFixed(2)} actual)`,
						backgroundColor: 'rgba(6,51,70,0.2)',
						borderColor: '#063346',
						fill: true,
						borderWidth: 3,
						pointRadius: 1,
						data: promedios,
					}]
				};
				const config3 = {
					type: 'line',
					data: data3,
					options: {
						layout: {
							padding: {
								left: 100,
								right: 100
							}
						},
						scales: {
							y: {
								max: 7,
								min: 1,
								scaleOverride: true,
								scaleStartValue: 1,
								grid: {
									color: "#282c34"
								}
							}
						}
					},
				};
				var myChart3 = new Chart(
					document.getElementById('promedios'),
					config3
				);

				const labels3 = ["Incremento", "Decremento"];
				const data4 = {
					labels: labels3,
					datasets: [{
						label: 'Conteo por estado',
						data: Object.values(cambios),
						backgroundColor: ["#a5d788", "#09050f"]
					}]
				};
				const config4 = {
					type: 'doughnut',
					data: data4,
					options: {
						layout: {
							padding: {
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
