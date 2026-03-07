import type { Team, Person, Desk } from '../types/index.js';

export const MOCK_TEAMS: Team[] = [
	{ id: 'team-1', name: 'Ingeniería', color: '#3b82f6' },
	{ id: 'team-2', name: 'Diseño', color: '#8b5cf6' },
	{ id: 'team-3', name: 'Marketing', color: '#f59e0b' },
	{ id: 'team-4', name: 'Ventas', color: '#10b981' }
];

export const MOCK_PEOPLE: Person[] = [
	// Ingeniería
	{ id: 'p-1', name: 'Carlos Gómez', teamId: 'team-1', unavailableDays: [4] },
	{ id: 'p-2', name: 'Laura Martínez', teamId: 'team-1', unavailableDays: [0] },
	{ id: 'p-3', name: 'Andrés Rodríguez', teamId: 'team-1', unavailableDays: [2, 4] },
	{ id: 'p-4', name: 'Sofía López', teamId: 'team-1', unavailableDays: [] },
	// Diseño
	{ id: 'p-5', name: 'María Torres', teamId: 'team-2', unavailableDays: [1] },
	{ id: 'p-6', name: 'Diego Herrera', teamId: 'team-2', unavailableDays: [3] },
	{ id: 'p-7', name: 'Valentina Ruiz', teamId: 'team-2', unavailableDays: [0, 4] },
	// Marketing
	{ id: 'p-8', name: 'Julián Castro', teamId: 'team-3', unavailableDays: [2] },
	{ id: 'p-9', name: 'Camila Vargas', teamId: 'team-3', unavailableDays: [1, 3] },
	{ id: 'p-10', name: 'Santiago Morales', teamId: 'team-3', unavailableDays: [] },
	// Ventas
	{ id: 'p-11', name: 'Isabella Mendoza', teamId: 'team-4', unavailableDays: [0] },
	{ id: 'p-12', name: 'Mateo Ramírez', teamId: 'team-4', unavailableDays: [4] },
	{ id: 'p-13', name: 'Daniela Ospina', teamId: 'team-4', unavailableDays: [2, 3] }
];

export const MOCK_DESKS: Desk[] = [
	{ id: 'd-1', label: 'A1', row: 0, col: 0 },
	{ id: 'd-2', label: 'A2', row: 0, col: 1 },
	{ id: 'd-3', label: 'A3', row: 0, col: 2 },
	{ id: 'd-4', label: 'B1', row: 1, col: 0 },
	{ id: 'd-5', label: 'B2', row: 1, col: 1 },
	{ id: 'd-6', label: 'B3', row: 1, col: 2 },
	{ id: 'd-7', label: 'C1', row: 2, col: 0 },
	{ id: 'd-8', label: 'C2', row: 2, col: 1 }
];
