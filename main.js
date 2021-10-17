var app = new Vue({
	el: '#app',
	mounted(){
	
	},
	data: {
		data: [],
		estado: {},
	},
	methods:{		
		async downData(){
			return await axios.get('https://bdethos-default-rtdb.firebaseio.com/clients.json');
		},

		upData(level,name){
			this.estado = {
				"Estado": name,
				"Nivel": level,
				"Fecha": new Date().toDateString()
			}
			if(this.estado!=null){
				axios.post('https://bdethos-default-rtdb.firebaseio.com/status.json',
				this.estado,{
				headers:{
					'Content-Type': 'application/json'
				}}
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

	}
});
