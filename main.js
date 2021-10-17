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
			this.downData().then(r => {
				console.log(Object.values(r.data));
				this.data = Object.values(r.data);
				for (const iterator of this.data) {
					console.log(iterator.Fecha);
					labels.push(iterator.Fecha);
					levels.push(iterator.Nivel);
				}
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
			});
		}
	}
});
