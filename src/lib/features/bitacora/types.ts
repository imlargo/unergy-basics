export interface Ubicacion {
	direccion: string;
	municipio: string;
	departamento: string;
	coordenadas: string;
}

export interface CondicionesTerreno {
	topografia: string;
	tipo_suelo: string;
	vegetacion: string;
	acceso: string;
	area_aproximada: string;
}

export interface Infraestructura {
	vias_acceso: string;
	servicios_publicos: string;
	construcciones_existentes: string;
}

export interface Viabilidad {
	evaluacion: 'viable' | 'no_viable' | 'requiere_estudio' | 'pendiente';
	observaciones: string;
	recomendaciones: string;
}

export interface Warning {
	campo: string;
	mensaje: string;
	severidad: 'info' | 'warning' | 'error';
}

export interface Bitacora {
	id: string;
	fecha: string;
	visitador: string;
	ubicacion: Ubicacion;
	condiciones_terreno: CondicionesTerreno;
	infraestructura: Infraestructura;
	viabilidad: Viabilidad;
	observaciones_generales: string;
	warnings: Warning[];
}

export function crearBitacoraVacia(): Bitacora {
	return {
		id: crypto.randomUUID(),
		fecha: new Date().toISOString().split('T')[0],
		visitador: '',
		ubicacion: {
			direccion: '',
			municipio: '',
			departamento: '',
			coordenadas: ''
		},
		condiciones_terreno: {
			topografia: '',
			tipo_suelo: '',
			vegetacion: '',
			acceso: '',
			area_aproximada: ''
		},
		infraestructura: {
			vias_acceso: '',
			servicios_publicos: '',
			construcciones_existentes: ''
		},
		viabilidad: {
			evaluacion: 'pendiente',
			observaciones: '',
			recomendaciones: ''
		},
		observaciones_generales: '',
		warnings: []
	};
}
