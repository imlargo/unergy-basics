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

export interface CampoStatus {
	nombre: string;
	label: string;
	completo: boolean;
	valor: string;
	descripcion: string;
	seccion: string;
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

export interface ActaFinal {
	id: string;
	fecha_generacion: string;
	titulo: string;
	resumen_ejecutivo: string;
	ubicacion: Ubicacion;
	condiciones_terreno: CondicionesTerreno;
	infraestructura: Infraestructura;
	viabilidad: Viabilidad;
	hallazgos_clave: string[];
	riesgos_identificados: string[];
	conclusion: string;
	proximos_pasos: string[];
	bitacoras_fuente: string[];
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
