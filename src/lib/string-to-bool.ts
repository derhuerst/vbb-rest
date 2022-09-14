export function stringToBool(value: string | undefined | null) {
	switch(value){
	case "true":
	case "1":
	case "on":
	case "yes":
		return true;
	default: 
		return false;
	}
}