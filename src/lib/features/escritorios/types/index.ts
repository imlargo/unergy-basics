export interface Team {
	id: string;
	name: string;
	color: string;
}

export interface Person {
	id: string;
	name: string;
	teamId: string;
	/** Days the person is NOT available (0=Mon, 1=Tue, 2=Wed, 3=Thu, 4=Fri) */
	unavailableDays: number[];
}

export interface Desk {
	id: string;
	label: string;
	/** Row position in office layout */
	row: number;
	/** Column position in office layout */
	col: number;
	/** Number of people that can sit at this desk (default 1) */
	capacity: number;
}

export type DayOfWeek = 0 | 1 | 2 | 3 | 4;

export const DAY_NAMES: Record<DayOfWeek, string> = {
	0: 'Lunes',
	1: 'Martes',
	2: 'Miércoles',
	3: 'Jueves',
	4: 'Viernes'
};

export interface DayAssignment {
	personId: string;
	deskId: string;
}

export interface WeeklySchedule {
	/** Map from day index to array of assignments */
	days: Record<DayOfWeek, DayAssignment[]>;
}
