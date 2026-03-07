import type { Team, Person, Desk, WeeklySchedule } from '../types/index.js';
import { MOCK_TEAMS, MOCK_PEOPLE, MOCK_DESKS } from '../data/mock.js';
import { generateSchedule } from '../scheduler.js';

let nextId = 100;
function uid(prefix: string): string {
	return `${prefix}-${nextId++}`;
}

class EscritoriosStore {
	teams: Team[] = $state(structuredClone(MOCK_TEAMS));
	people: Person[] = $state(structuredClone(MOCK_PEOPLE));
	desks: Desk[] = $state(structuredClone(MOCK_DESKS));
	schedule: WeeklySchedule | null = $state(null);
	minDaysPerWeek: number = $state(3);

	// --- Teams ---
	addTeam(name: string, color: string) {
		this.teams.push({ id: uid('team'), name, color });
	}

	removeTeam(id: string) {
		this.teams = this.teams.filter((t) => t.id !== id);
		this.people = this.people.filter((p) => p.teamId !== id);
		this.schedule = null;
	}

	updateTeam(id: string, data: Partial<Omit<Team, 'id'>>) {
		const team = this.teams.find((t) => t.id === id);
		if (team) {
			if (data.name !== undefined) team.name = data.name;
			if (data.color !== undefined) team.color = data.color;
		}
	}

	// --- People ---
	addPerson(name: string, teamId: string, unavailableDays: number[] = []) {
		this.people.push({ id: uid('p'), name, teamId, unavailableDays });
	}

	removePerson(id: string) {
		this.people = this.people.filter((p) => p.id !== id);
		this.schedule = null;
	}

	updatePerson(id: string, data: Partial<Omit<Person, 'id'>>) {
		const person = this.people.find((p) => p.id === id);
		if (person) {
			if (data.name !== undefined) person.name = data.name;
			if (data.teamId !== undefined) person.teamId = data.teamId;
			if (data.unavailableDays !== undefined) person.unavailableDays = data.unavailableDays;
		}
	}

	// --- Desks ---
	addDesk(label: string, row: number, col: number) {
		this.desks.push({ id: uid('d'), label, row, col });
	}

	removeDesk(id: string) {
		this.desks = this.desks.filter((d) => d.id !== id);
		this.schedule = null;
	}

	updateDesk(id: string, data: Partial<Omit<Desk, 'id'>>) {
		const desk = this.desks.find((d) => d.id === id);
		if (desk) {
			if (data.label !== undefined) desk.label = data.label;
			if (data.row !== undefined) desk.row = data.row;
			if (data.col !== undefined) desk.col = data.col;
		}
	}

	// --- Schedule ---
	generate() {
		this.schedule = generateSchedule(this.people, this.desks, this.minDaysPerWeek);
	}

	clearSchedule() {
		this.schedule = null;
	}

	// --- Helpers ---
	getTeam(id: string): Team | undefined {
		return this.teams.find((t) => t.id === id);
	}

	getPerson(id: string): Person | undefined {
		return this.people.find((p) => p.id === id);
	}

	getDesk(id: string): Desk | undefined {
		return this.desks.find((d) => d.id === id);
	}

	getPeopleByTeam(teamId: string): Person[] {
		return this.people.filter((p) => p.teamId === teamId);
	}
}

export const escritoriosStore = new EscritoriosStore();
