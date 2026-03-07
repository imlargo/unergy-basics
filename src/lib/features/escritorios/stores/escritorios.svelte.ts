import type { Team, Person, Desk, WeeklySchedule, DayOfWeek, DayAssignment } from '../types/index.js';
import { MOCK_TEAMS, MOCK_PEOPLE, MOCK_DESKS } from '../data/mock.js';
import { generateSchedule, validateSchedule } from '../scheduler.js';

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
	addDesk(label: string, row: number, col: number, capacity: number = 1) {
		this.desks.push({ id: uid('d'), label, row, col, capacity: Math.max(1, capacity) });
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
			if (data.capacity !== undefined) desk.capacity = Math.max(1, data.capacity);
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

	// --- Schedule helpers ---
	getAssignmentsForDesk(deskId: string, day: DayOfWeek): DayAssignment[] {
		if (!this.schedule) return [];
		return this.schedule.days[day].filter((a) => a.deskId === deskId);
	}

	getAssignmentsForDay(day: DayOfWeek): DayAssignment[] {
		if (!this.schedule) return [];
		return this.schedule.days[day];
	}

	getDeskOccupancyRate(deskId: string): number {
		if (!this.schedule) return 0;
		const desk = this.getDesk(deskId);
		if (!desk) return 0;
		const days: DayOfWeek[] = [0, 1, 2, 3, 4];
		let totalSlots = 0;
		let occupied = 0;
		for (const d of days) {
			totalSlots += desk.capacity;
			occupied += this.schedule!.days[d].filter((a) => a.deskId === deskId).length;
		}
		return totalSlots > 0 ? occupied / totalSlots : 0;
	}

	getOverallOccupancyRate(): number {
		if (!this.schedule) return 0;
		const days: DayOfWeek[] = [0, 1, 2, 3, 4];
		const totalCapacity = this.desks.reduce((sum, d) => sum + d.capacity, 0);
		const totalSlots = totalCapacity * 5;
		if (totalSlots === 0) return 0;
		let occupied = 0;
		for (const day of days) {
			occupied += this.schedule.days[day].length;
		}
		return occupied / totalSlots;
	}

	getTotalCapacity(): number {
		return this.desks.reduce((sum, d) => sum + d.capacity, 0);
	}

	getScheduleValidation(): { valid: boolean; issues: string[] } {
		if (!this.schedule) return { valid: true, issues: [] };
		return validateSchedule(this.schedule, this.people, this.minDaysPerWeek);
	}

	getTeamDistributionForDay(day: DayOfWeek): { team: Team; count: number }[] {
		if (!this.schedule) return [];
		const assignments = this.schedule.days[day];
		const teamCounts = new Map<string, number>();
		for (const a of assignments) {
			const person = this.getPerson(a.personId);
			if (person) {
				teamCounts.set(person.teamId, (teamCounts.get(person.teamId) || 0) + 1);
			}
		}
		return Array.from(teamCounts.entries())
			.map(([teamId, count]) => ({ team: this.getTeam(teamId)!, count }))
			.filter((e) => e.team)
			.sort((a, b) => b.count - a.count);
	}
}

export const escritoriosStore = new EscritoriosStore();
