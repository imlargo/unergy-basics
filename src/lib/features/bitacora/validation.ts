import type { Warning, Bitacora, CampoStatus } from './types';

interface CampoRequerido {
	ruta: string;
	nombre: string;
	label: string;
	descripcion: string;
	seccion: string;
}

const CAMPOS_REQUERIDOS: CampoRequerido[] = [
	{
		ruta: 'visitador',
		nombre: 'visitador',
		label: 'Visitador',
		descripcion: 'Nombre de la persona que realizó la visita',
		seccion: 'General'
	},
	{
		ruta: 'ubicacion.direccion',
		nombre: 'direccion',
		label: 'Dirección',
		descripcion: 'Dirección o ubicación del terreno visitado',
		seccion: 'Ubicación'
	},
	{
		ruta: 'ubicacion.municipio',
		nombre: 'municipio',
		label: 'Municipio',
		descripcion: 'Municipio donde se encuentra el terreno',
		seccion: 'Ubicación'
	},
	{
		ruta: 'ubicacion.departamento',
		nombre: 'departamento',
		label: 'Departamento',
		descripcion: 'Departamento donde se encuentra el terreno',
		seccion: 'Ubicación'
	},
	{
		ruta: 'condiciones_terreno.topografia',
		nombre: 'topografia',
		label: 'Topografía',
		descripcion: 'Descripción de la topografía del terreno',
		seccion: 'Terreno'
	},
	{
		ruta: 'condiciones_terreno.acceso',
		nombre: 'acceso',
		label: 'Acceso al terreno',
		descripcion: 'Cómo se accede al terreno',
		seccion: 'Terreno'
	},
	{
		ruta: 'condiciones_terreno.area_aproximada',
		nombre: 'area_aproximada',
		label: 'Área aproximada',
		descripcion: 'Área aproximada del terreno',
		seccion: 'Terreno'
	},
	{
		ruta: 'infraestructura.servicios_publicos',
		nombre: 'servicios_publicos',
		label: 'Servicios públicos',
		descripcion: 'Disponibilidad de servicios públicos (agua, luz, etc.)',
		seccion: 'Infraestructura'
	},
	{
		ruta: 'viabilidad.evaluacion',
		nombre: 'evaluacion',
		label: 'Evaluación de viabilidad',
		descripcion: 'Evaluación general de viabilidad del terreno',
		seccion: 'Viabilidad'
	},
	{
		ruta: 'viabilidad.observaciones',
		nombre: 'observaciones',
		label: 'Observaciones de viabilidad',
		descripcion: 'Observaciones sobre la viabilidad del terreno',
		seccion: 'Viabilidad'
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

export function obtenerStatusCampos(bitacora: Bitacora): CampoStatus[] {
	return CAMPOS_REQUERIDOS.map((campo) => {
		const valor = getNestedValue(bitacora as unknown as Record<string, unknown>, campo.ruta);
		const valorStr = typeof valor === 'string' ? valor.trim() : '';
		const completo =
			campo.ruta === 'viabilidad.evaluacion'
				? valorStr !== '' && valorStr !== 'pendiente'
				: valorStr !== '';

		return {
			nombre: campo.nombre,
			label: campo.label,
			completo,
			valor: valorStr,
			descripcion: campo.descripcion,
			seccion: campo.seccion
		};
	});
}

export function validarBitacora(bitacora: Bitacora): Warning[] {
	const warnings: Warning[] = [];

	for (const campo of CAMPOS_REQUERIDOS) {
		const valor = getNestedValue(bitacora as unknown as Record<string, unknown>, campo.ruta);

		if (!valor || (typeof valor === 'string' && valor.trim() === '')) {
			warnings.push({
				campo: campo.label,
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
