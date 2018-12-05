import { Defect } from './defect';

export class Place {
	id: string;
	name: string;
	floor: number;
	defects: Defect[];
}