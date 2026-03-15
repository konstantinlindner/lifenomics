/**
 * Budget / economics constants derived from Economics - Database.csv
 */

// --- Food ---
export const FOOD_CATEGORIES = [
	'Breakfast',
	'Lunch',
	'Dinner',
	'Groceries',
	'Snacks and drinks',
	'Drinks out',
	'Coffee',
	'Alcohol',
	'Ice Cream',
] as const

export const FOOD_PLACE_TYPES = [
	'Restaurant',
	'Food Stand',
	'Grocery Store',
	'Convenience Store',
	'Café',
	'Vending Machine',
] as const

// --- Airports (Airport, IATA Code, City, Country) ---
export const AIRPORTS = [
	{ airport: 'Vancouver', code: 'YVR', city: 'Vancouver', country: 'Canada' },
	{
		airport: 'Puerto Vallarta',
		code: 'PVR',
		city: 'Puerto Vallarta',
		country: 'Mexico',
	},
	{
		airport: 'Mexico City',
		code: 'MEX',
		city: 'Mexico City',
		country: 'Mexico',
	},
	{ airport: 'Helsinki', code: 'HEL', city: 'Helsinki', country: 'Finland' },
	{
		airport: 'Dallas',
		code: 'DFW',
		city: 'Dallas',
		country: 'United States',
	},
	{ airport: 'Malaga', code: 'AGP', city: 'Malaga', country: 'Spain' },
	{ airport: 'Paris', code: 'CDG', city: 'Paris', country: 'France' },
	{
		airport: 'Landvetter',
		code: 'GOT',
		city: 'Gothenburg',
		country: 'Sweden',
	},
	{ airport: 'Östersund', code: 'OSD', city: 'Östersund', country: 'Sweden' },
	{ airport: 'Toronto', code: 'YYZ', city: 'Toronto', country: 'Canada' },
	{ airport: 'Montreal', code: 'YUL', city: 'Montreal', country: 'Canada' },
	{
		airport: 'Stansted',
		code: 'STN',
		city: 'London',
		country: 'United Kingdom',
	},
	{
		airport: 'Gatwick',
		code: 'LGW',
		city: 'London',
		country: 'United Kingdom',
	},
	{
		airport: 'Heathrow',
		code: 'LHR',
		city: 'London',
		country: 'United Kingdom',
	},
	{ airport: 'Arlanda', code: 'ARN', city: 'Stockholm', country: 'Sweden' },
	{ airport: 'Visby', code: 'VBY', city: 'Visby', country: 'Sweden' },
	{
		airport: 'Puerto Escondido',
		code: 'PXM',
		city: 'Puerto Escondido',
		country: 'Mexico',
	},
	{
		airport: 'Los Angeles',
		code: 'LAX',
		city: 'Los Angeles',
		country: 'United States',
	},
	{ airport: 'Kelowna', code: 'YLW', city: 'Kelowna', country: 'Canada' },
	{ airport: 'Umeå', code: 'UME', city: 'Umeå', country: 'Sweden' },
	{
		airport: 'Whitehorse',
		code: 'YXY',
		city: 'Whitehorse',
		country: 'Canada',
	},
	{
		airport: 'Frankfurt',
		code: 'FRA',
		city: 'Frankfurt',
		country: 'Germany',
	},
	{
		airport: 'Amsterdam Airport Schiphol',
		code: 'AMS',
		city: 'Amsterdam',
		country: 'Netherlands',
	},
	{
		airport: 'Seoul Incheon International Airport',
		code: 'ICN',
		city: 'Seoul',
		country: 'Korea',
	},
] as const

// --- Airlines (Name, Country Registered) ---
export const AIRLINES = [
	{ name: 'Westjet', country: 'Canada' },
	{ name: 'Volaris', country: 'Mexico' },
	{ name: 'Viva Aerobus', country: 'Mexico' },
	{ name: 'Ryanair', country: 'Ireland' },
	{ name: 'SAS', country: 'Sweden' },
	{ name: 'Finnair', country: 'Finland' },
	{ name: 'Air France', country: 'France' },
	{ name: 'Flair', country: 'Canada' },
	{ name: 'American', country: 'United States' },
	{ name: 'BRA', country: 'Sweden' },
	{ name: 'Air North', country: 'Canada' },
	{ name: 'Condor', country: 'Germany' },
	{ name: 'Lufthansa', country: 'Germany' },
	{ name: 'KLM', country: 'Netherlands' },
	{ name: 'Korean Air', country: 'Korea' },
] as const

// --- Accommodations (Name, City, Country, Type) ---
export const ACCOMMODATIONS = [
	{
		name: 'Ten to Ten',
		city: 'Puerto Vallarta',
		country: 'Mexico',
		type: 'Rent, entire place',
	},
	{
		name: 'Aldama 209',
		city: 'Puerto Vallarta',
		country: 'Mexico',
		type: 'Rent, private room',
	},
	{
		name: 'Viajero Sayulita',
		city: 'Sayulita',
		country: 'Mexico',
		type: 'Rent, dorm',
	},
	{
		name: 'Costa Rica 1368',
		city: 'Puerto Vallarta',
		country: 'Mexico',
		type: 'Airbnb, entire place',
	},
	{
		name: 'Zamora 168',
		city: 'Mexico City',
		country: 'Mexico',
		type: 'Airbnb, private room',
	},
	{
		name: 'Paseo de La Loma 31 A',
		city: 'Puerto Vallarta',
		country: 'Mexico',
		type: 'Hostel, dorm',
	},
	{
		name: '3268 W 10th Ave',
		city: 'Vancouver',
		country: 'Canada',
		type: 'Hostel, private room',
	},
	{
		name: 'Smörslätten 12',
		city: 'Gothenburg',
		country: 'Sweden',
		type: 'Hotel',
	},
	{
		name: '146 Silver Lode Lane',
		city: 'Silver Star',
		country: 'Canada',
		type: '',
	},
	{ name: 'Samesun', city: 'Vancouver', country: 'Canada', type: '' },
	{ name: 'Moda Hotel', city: 'Vancouver', country: 'Canada', type: '' },
	{ name: 'Days Inn', city: 'Kelowna', country: 'Canada', type: '' },
	{ name: 'Viajero CDMX', city: 'Mexico City', country: 'Mexico', type: '' },
	{ name: 'Mini Loft 305', city: 'Mexico City', country: 'Mexico', type: '' },
	{
		name: 'Calle Primera Oriente 508',
		city: 'Puerto Escondido',
		country: 'Mexico',
		type: '',
	},
	{
		name: 'Che Puerto Escondido',
		city: 'Puerto Escondido',
		country: 'Mexico',
		type: '',
	},
	{
		name: 'Hotel Escandón',
		city: 'Mexico City',
		country: 'Mexico',
		type: '',
	},
	{ name: 'Saltillo 42', city: 'Mexico City', country: 'Mexico', type: '' },
	{ name: 'Ensenada 37', city: 'Mexico City', country: 'Mexico', type: '' },
	{
		name: 'Río Pánuco 198',
		city: 'Mexico City',
		country: 'Mexico',
		type: '',
	},
	{
		name: 'Punta Kai Hotel',
		city: 'Puerto Escondido',
		country: 'Mexico',
		type: '',
	},
	{
		name: 'Freehand Los Angeles',
		city: 'Los Angeles',
		country: 'United States',
		type: '',
	},
	{ name: '833 Seymour St', city: 'Vancouver', country: 'Canada', type: '' },
	{ name: '10510 168 St', city: 'Surrey', country: 'Canada', type: '' },
] as const

export const ACCOMMODATION_TYPES = [
	'Rent, entire place',
	'Rent, private room',
	'Rent, dorm',
	'Airbnb, entire place',
	'Airbnb, private room',
	'Hostel, dorm',
	'Hostel, private room',
	'Hotel',
] as const

// --- Transportation (Name, Type) ---
export const TRANSPORTATION = [
	{ name: 'Taxi', type: 'Taxi' },
	{ name: 'Uber', type: 'Taxi' },
	{ name: 'Puerto Vallarta Bus', type: 'Bus' },
	{ name: 'DiDi', type: 'Taxi' },
	{ name: 'InDrive', type: 'Taxi' },
	{ name: 'Cabify', type: 'Taxi' },
	{ name: 'SJ', type: 'Train' },
	{ name: 'Västtrafik, bus', type: 'Bus' },
	{ name: 'Västtrafik, train', type: 'Train' },
	{ name: 'Västtrafik, tram', type: 'Tram' },
	{ name: 'Flixbus, bus', type: 'Bus' },
	{ name: 'Flixbus, train', type: 'Train' },
	{ name: 'MTR', type: 'Train' },
] as const

export const TRANSPORTATION_TYPES = ['Taxi', 'Bus', 'Train', 'Tram'] as const

// --- Other expenses ---
export const OTHER_EXPENSES_CATEGORIES = [
	'Clothes',
	'Laundry',
	'Phone Bill',
	'ATM Fee',
	'Wise Fee',
	'Personal Items',
	'Medicine',
	'Healthcare',
	'Drugs',
	'Haircut',
	'Subscriptions',
] as const

// --- Payment methods (Name, Credit optional, Currency % optional) ---
export const PAYMENT_METHODS = [
	{ name: 'Cash', credit: undefined, currencyPercent: undefined },
	{ name: 'Norwegian Credit', credit: 80000, currencyPercent: 1.7 },
	{ name: 'CIBC Credit', credit: undefined, currencyPercent: 2.5 },
	{ name: 'Amex Green', credit: undefined, currencyPercent: undefined },
	{ name: 'Amex Blue', credit: undefined, currencyPercent: undefined },
	{ name: 'Alicia Pay', credit: undefined, currencyPercent: undefined },
	{ name: 'Revolut', credit: undefined, currencyPercent: undefined },
	{ name: 'Friend Pay', credit: undefined, currencyPercent: undefined },
	{ name: 'Scotiabank Passport', credit: 10000, currencyPercent: 0 },
	{ name: 'WealthSimple', credit: 0, currencyPercent: 0 },
	{ name: 'Lunar Eurobonus', credit: undefined, currencyPercent: undefined },
	{ name: 'Amex Eurobonus', credit: undefined, currencyPercent: undefined },
	{ name: 'Bfor', credit: undefined, currencyPercent: undefined },
	{ name: 'Swish', credit: undefined, currencyPercent: undefined },
] as const

// --- Cities (City -> Country) ---
export const CITIES = [
	{ city: 'Online', country: 'Online' },
	{ city: 'Vancouver', country: 'Canada' },
	{ city: 'Puerto Vallarta', country: 'Mexico' },
	{ city: 'Mexico City', country: 'Mexico' },
	{ city: 'Sayulita', country: 'Mexico' },
	{ city: 'Helsinki', country: 'Finland' },
	{ city: 'Dallas', country: 'United States' },
	{ city: 'Malaga', country: 'Spain' },
	{ city: 'Paris', country: 'France' },
	{ city: 'Gothenburg', country: 'Sweden' },
	{ city: 'Östersund', country: 'Sweden' },
	{ city: 'Toronto', country: 'Canada' },
	{ city: 'Montreal', country: 'Canada' },
	{ city: 'London', country: 'United Kingdom' },
	{ city: 'Stockholm', country: 'Sweden' },
	{ city: 'Visby', country: 'Sweden' },
	{ city: 'Silver Star', country: 'Canada' },
	{ city: 'Kelowna', country: 'Canada' },
	{ city: 'Puerto Escondido', country: 'Mexico' },
	{ city: 'Los Angeles', country: 'United States' },
	{ city: 'Umeå', country: 'Sweden' },
	{ city: 'Whitehorse', country: 'Canada' },
	{ city: 'Frankfurt', country: 'Germany' },
	{ city: 'Surrey', country: 'Canada' },
	{ city: 'Kristinehamn', country: 'Sweden' },
	{ city: 'Insjön', country: 'Sweden' },
	{ city: 'Borlänge', country: 'Sweden' },
	{ city: 'Leksand', country: 'Sweden' },
	{ city: 'Falun', country: 'Sweden' },
	{ city: 'Karlstad', country: 'Sweden' },
	{ city: 'Sundsvall', country: 'Sweden' },
	{ city: 'Amsterdam', country: 'Netherlands' },
	{ city: 'Seoul', country: 'Korea' },
] as const

// --- Countries ---
export const COUNTRIES = [
	'Canada',
	'Sweden',
	'Mexico',
	'United States',
	'Ireland',
	'Finland',
	'France',
	'United Kingdom',
	'Germany',
	'Netherlands',
	'Korea',
	'Spain',
	'Online',
] as const

// --- Income ---
export const INCOME_CATEGORIES = ['Salary', 'Bonus', 'Tax Return'] as const

// --- Currencies ---
export const CURRENCIES = ['SEK', 'CAD', 'MXN', 'USD', 'EUR'] as const
