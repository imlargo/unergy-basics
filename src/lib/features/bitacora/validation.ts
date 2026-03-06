import type { Warning, Bitacora } from './types';

interface CampoRequerido {
	ruta: string;
	nombre: string;
	descripcion: string;
}

const CAMPOS_REQUERIDOS: CampoRequerido[] = [
	{
		ruta: 'visitador',
		nombre: 'Visitador',
		descripcion: 'Nombre de la persona que realizó la visita'
	},
	{
		ruta: 'ubicacion.direccion',
		nombre: 'Dirección',
		descripcion: 'Dirección o ubicación del terreno visitado'
	},
	{
		ruta: 'ubicacion.municipio',
		nombre: 'Municipio',
		descripcion: 'Municipio donde se encuentra el terreno'
	},
	{
		ruta: 'condiciones_terreno.topografia',
		nombre: 'Topografía',
		descripcion: 'Descripción de la topografía del terreno'
	},
	{
		ruta: 'condiciones_terreno.acceso',
		nombre: 'Acceso al terreno',
		descripcion: 'Cómo se accede al terreno'
	},
	{
		ruta: 'condiciones_terreno.area_aproximada',
		nombre: 'Área aproximada',
		descripcion: 'Área aproximada del terreno'
	},
	{
		ruta: 'infraestructura.servicios_publicos',
		nombre: 'Servicios públicos',
		descripcion: 'Disponibilidad de servicios públicos (agua, luz, etc.)'
	},
	{
		ruta: 'viabilidad.evaluacion',
		nombre: 'Evaluación de viabilidad',
		descripcion: 'Evaluación general de viabilidad del terreno'
	},
	{
		ruta: 'viabilidad.observaciones',
		nombre: 'Observaciones de viabilidad',
		descripcion: 'Observaciones sobre la viabilidad del terreno'
	}
];

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
	return path.split('.').reduce((acc: unknown, key: string) => {
		if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
			return (acc as Record<string, unknown>)[key];
		}
		return undefined;
	}, obj);
}

export function validarBitacora(bitacora: Bitacora): Warning[] {
	const warnings: Warning[] = [];

	for (const campo of CAMPOS_REQUERIDOS) {
		const valor = getNestedValue(bitacora as unknown as Record<string, unknown>, campo.ruta);

		if (!valor || (typeof valor === 'string' && valor.trim() === '')) {
			warnings.push({
				campo: campo.nombre,
				mensaje: `Falta información: ${campo.descripcion}`,
				severidad: 'warning'
			});
		}
	}

	if (bitacora.viabilidad.evaluacion === 'pendiente') {
		warnings.push({
			campo: 'Evaluación',
			mensaje:
				'La evaluación de viabilidad está pendiente. Considere indicar si el terreno es viable, no viable o requiere estudio adicional.',
			severidad: 'info'
		});
	}

	return warnings;
}
