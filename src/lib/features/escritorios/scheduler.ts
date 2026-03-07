import type { Person, Desk, DayOfWeek, DayAssignment, WeeklySchedule } from '../types/index.js';

const WORK_DAYS: DayOfWeek[] = [0, 1, 2, 3, 4];
const MIN_DAYS_PER_PERSON = 3;

/**
 * Returns total capacity across all desks (sum of each desk's capacity).
 */
function totalCapacity(desks: Desk[]): number {
	return desks.reduce((sum, d) => sum + d.capacity, 0);
}

/**
 * Generates a weekly desk assignment schedule.
 *
 * Rules:
 * 1. Each person must attend at least MIN_DAYS_PER_PERSON days.
 * 2. People from the same team should be assigned to nearby desks.
 * 3. Respect each person's unavailable days.
 * 4. No more people assigned per day than total desk capacity.
 * 5. Each desk can hold up to its capacity number of people.
 */
export function generateSchedule(
	people: Person[],
	desks: Desk[],
	minDays: number = MIN_DAYS_PER_PERSON
): WeeklySchedule {
	const schedule: WeeklySchedule = {
		days: { 0: [], 1: [], 2: [], 3: [], 4: [] }
	};

	if (people.length === 0 || desks.length === 0) return schedule;

	const maxPerDay = totalCapacity(desks);

	// Calculate available days for each person
	const personAvailability = people.map((p) => ({
		person: p,
		available: WORK_DAYS.filter((d) => !p.unavailableDays.includes(d)),
		assignedDays: [] as DayOfWeek[]
	}));

	// Sort desks by position (row, col) for proximity grouping
	const sortedDesks = [...desks].sort((a, b) => a.row - b.row || a.col - b.col);

	// Phase 1: Ensure everyone gets at least minDays assignments
	// Prioritize people with fewer available days first (most constrained first)
	const sorted = [...personAvailability].sort(
		(a, b) => a.available.length - b.available.length
	);

	for (const entry of sorted) {
		const needed = Math.min(minDays, entry.available.length);
		// Pick the days with fewest current assignments first, respecting capacity
		const daysByLoad = entry.available
			.filter((d) => countAssignedForDay(sorted, d) < maxPerDay)
			.sort((a, b) => countAssignedForDay(sorted, a) - countAssignedForDay(sorted, b));

		for (let i = 0; i < needed && i < daysByLoad.length; i++) {
			entry.assignedDays.push(daysByLoad[i]);
		}
	}

	// Phase 2: Fill remaining capacity, distributing evenly
	for (const entry of sorted) {
		const extraDays = entry.available.filter(
			(d) =>
				!entry.assignedDays.includes(d) &&
				countAssignedForDay(sorted, d) < maxPerDay
		);
		for (const d of extraDays) {
			if (countAssignedForDay(sorted, d) < maxPerDay) {
				entry.assignedDays.push(d);
			}
		}
	}

	// Phase 3: Assign desks for each day, grouping by team and respecting capacity
	for (const day of WORK_DAYS) {
		const dayPeople = sorted
			.filter((e) => e.assignedDays.includes(day))
			.map((e) => e.person);

		// Group by team for proximity
		const byTeam = new Map<string, Person[]>();
		for (const p of dayPeople) {
			const list = byTeam.get(p.teamId) || [];
			list.push(p);
			byTeam.set(p.teamId, list);
		}

		// Flatten: teams assigned in order, people within teams kept together
		const ordered: Person[] = [];
		for (const [, teamPeople] of byTeam) {
			ordered.push(...teamPeople);
		}

		// Assign to sorted desks respecting capacity
		const assignments: DayAssignment[] = [];
		const deskSlots = sortedDesks.map((d) => ({ desk: d, remaining: d.capacity }));
		let deskIdx = 0;

		for (const person of ordered) {
			// Find next desk with remaining capacity
			while (deskIdx < deskSlots.length && deskSlots[deskIdx].remaining <= 0) {
				deskIdx++;
			}
			if (deskIdx >= deskSlots.length) break;

			assignments.push({
				personId: person.id,
				deskId: deskSlots[deskIdx].desk.id
			});
			deskSlots[deskIdx].remaining--;
		}

		schedule.days[day] = assignments;
	}

	return schedule;
}

function countAssignedForDay(
	entries: { assignedDays: DayOfWeek[] }[],
	day: DayOfWeek
): number {
	return entries.filter((e) => e.assignedDays.includes(day)).length;
}

/**
 * Validates that each person is assigned at least minDays.
 */
export function validateSchedule(
	schedule: WeeklySchedule,
	people: Person[],
	minDays: number = MIN_DAYS_PER_PERSON
): { valid: boolean; issues: string[] } {
	const issues: string[] = [];
	const personDayCount = new Map<string, number>();

	for (const day of WORK_DAYS) {
		for (const assignment of schedule.days[day]) {
			personDayCount.set(
				assignment.personId,
				(personDayCount.get(assignment.personId) || 0) + 1
			);
		}
	}

	for (const person of people) {
		const available = WORK_DAYS.filter((d) => !person.unavailableDays.includes(d)).length;
		const assigned = personDayCount.get(person.id) || 0;
		const expected = Math.min(minDays, available);
		if (assigned < expected) {
			issues.push(
				`${person.name} tiene ${assigned} día(s) asignado(s) pero necesita al menos ${expected}.`
			);
		}
	}

	return { valid: issues.length === 0, issues };
}
