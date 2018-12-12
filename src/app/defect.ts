export class Defect {
	name: string;
	description: string;
	status: number;
	severity: number;
	last_edited: Date;
	pictures: string[];
	repair_date: Date;
	responsible_person: string;
	responsible_instance: string;
	extra_note: string;
}