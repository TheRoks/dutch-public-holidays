angular.module('dutchPublicHolidays').provider('dutchPublicHolidays', function () {

    // Private variables
    var includeLiberationDay = false,
        includeGoodFriday = false,
        includeLiberationDayOnLustrum = false;

    // Private constructor
    function DutchHolidaysService() {

        var calculateChristianHolidays = function (year) {

            var leap,
                leapYear,
                leapYearWithout,
                leapYearMoon,
                difference,
                ages,
                goldenNumber,
                epacta,
                criticalEpacta,
                fullMoon,
                day,
                month;

            var goodFriday,
                easterSunday,
                easterMonday,
                ascension,
                whitSunday,
                whitMonday,
                christmasDay,
                boxingDay;

            /* ** Bepalen schrikkeljaar. Deelbaar door 4, niet deelbaar
             door 100, tenzij deelbaar door 400. */
            if ((year % 400) === 0) {
                leapYear = 1;
            } else {
                if ((year % 100) === 0) {
                    leapYear = 0;
                } else {
                    if ((year % 4) === 0) {
                        leapYear = 1;
                    } else {
                        leapYear = 0;
                    }
                }
            }
            // ** Bereken aantal eeuwen
            ages = Math.floor(year / 100);

            /* ** Bereken het gulden getal van het jaar.
             Het jaar waarin nieuwe maan op 1 januari
             valt krijgt het getal 1.
             Dit is de rest die we overhouden als we
             het nummer van het jaar door 19 delen
             (het aantal jaren in een maanjaar cyclus),
             en deze rest wordt met 1 vermeerderd.
             Het gulden getal van 1900 is dus 1, en
             het gulden getal van 1983 is 8. */
            goldenNumber = (year % 19) + 1;

            /* ** Bereken de correctie die aangebracht
             moet worden vanwege schrikkeljaren. */

            /* ** Eerst tellen we het aantal voorafgaande
             eeuwen (inclusief de eeuw zelf) waarin een
             schrikkeldag werd weggelaten, voor 1900 tot
             2099 is dat 15. */
            leapYearWithout = ages - Math.floor(ages / 4);

            /* ** Daarna tellen we de weggelaten dagen in
             schrikkeljaren van het maanjaar. Dit soort
             schrikkeljaren komen in een periode van 2500
             jaar 8 maal voor, namelijk het eerste jaar,
             het 301-ste jaar, enzovoorts tot en met het
             2101-ste jaar. Het eerste zodanige jaar was
             1800 en dit was tevens het begin van een cyclus,
             de volgende keer dat zo een jaar voorkomt is
             dus 2100. Voor 1800 tot 2099 is dat dus 1
             daarna tot 2399 is dat 2, enzovoorts. */
            leapYearMoon = Math.floor(ages / 3) - 5;

            /* ** Trek het aantal zo gevonden maanschrikkeldagen
             af van het aantal zonschrikkeldagen. */
            leap = leapYearWithout - leapYearMoon;

            /* ** Nu gaan we de epacta berekenen, dat is de
             ouderdom van de maan op 1 januari van het jaar.
             Hiertoe vermenigvuldigen we eerst het gulden
             getal met 11 (een maanjaar is 11 dagen korter
             dan een zonnejaar, vandaar), hiervan trekken
             we het getal gevonden onder 2 af (correctie
             voor schrikkeldagen). Hierbij tellen we dan 2
             op (om in de pas te komen). Van dit resultaat
             nemen we de rest na deling door 30. Zo gaat de
             berekening voor 1983 als volgt: gulden getal
             is 8, aantal zonneschrikkeldagen is 15, aantal
             maanschrikkeldagen is 1, verschil 14. Gulden
             getal maal 11 is 88, trek af schrikkeldagen (14)
             het resultaat is 74 en tel hier 2 bij op: 76.
             Hiervan nemen we de rest na deling door 30: 16
             en dit is de epacta van 1983. */
            epacta = ((goldenNumber * 11) - leap) + 2;
            epacta = (epacta % 30);

            /* ** Nu moeten we nog de volle manen van een jaar
             berekenen. De maanmaanden hebben in principe
             afwisselend 30 en 29 dagen, waarbij de maanmaand
             waarin 1 januari valt 30 dagen heeft, en de
             daaropvolgende maanmaand 29 dagen. Verder komt
             een volle maan 13 dagen na nieuwe maan. Uitgaande
             van dit gegeven vinden we een volle maan op
             31-epacta+13 maart in een niet schrikkeljaar,
             en 1 dag eerder in een schrikkeljaar. Valt deze
             datum na 31 maart, dan gaan we uiteraard over op
             de maand april. Voor 1983 is de zo gevonden datum
             28 maart. Pasen valt nu op de daaropvolgende zondag.
             Het kan gebeuren dat de zo gevonden datum van de
             volle maan voor of op 21 maart valt, in dat geval
             moeten we de daarop volgende volle maan nemen.
             Hiertoe dienen we de lengte van de maanmaand te
             kennen, de volgende regels zijn hierop van toepassing:
             a. De kritische epacta is 26 in jaren met een gulden
             getal groter dan 11, in andere jaren is deze epacta 25.
             b. Is de berekende epacta kleiner dan de kritische
             epacta, dan is de lengte van de maand 29 dagen,
             anders is dat 30 dagen.
             */
            difference = ((31 - epacta) + 13) - leapYear;
            /* Verschil van uitleg in diverse berekeningen. Het
             maakt nogal verschil of je een maanmaand bij moet
             tellen of niet. Beide opties staan hier genoemd.
             Slechts een van beide is geactiveerd.
             Effecten in o.a. 2008 en 2084. */
            // if ( V <= 21 )  // Volle maan voor of op 21 maart
            if (difference < 21) // Volle maan voor 21 maart
            {
                if (goldenNumber > 11) {
                    criticalEpacta = 26;
                } else {
                    criticalEpacta = 25;
                }
                if (epacta < criticalEpacta) {
                    difference = difference + 29;
                } else {
                    difference = difference + 30;
                }
            }

            // ** De eerste volle maan na het begin van de lente:
            if (difference <= 31) {
                day = difference;
                month = 3;
            } else {
                day = difference - 31;
                month = 4;
            }
            // ** Bepaal de dag van de week:
            //    (Kies 04:00 uur om geen last te hebben van zomer/wintertijd
            //     bij het bepalen van de weekdag.)
            /* RISICO: The Date object range is -100,000,000 days to
             100,000,000 days relative to 01 January, 1970 UTC. */
            fullMoon = new Date(year, (month - 1), day, 4);
            // ** Doortellen tot de (volgende) zondag:
            /* Bij vergelijking met een tabel met Paasdata op internet
             lijkt een correctie nodig voor schrikkeljaren als
             VolleMaan op een zaterdag valt.
             Ik vermoed dat die Paasdata-tabel niet juist is.
             Onderstaande correctie is dan ook niet geactiveerd.
             Effecten in o.a. 2052, 2072, 2092 en 2096.
             Als deze regel ook voor niet-schrikkeljaren geldt
             ook effecten in o.a. 2018, 2022, 2042, 2049, 2062, 2066, 2086 en 2093. */
            // if (VolleMaan.getDay() == 6 ) { V = V + ( 7 * YS ) };
            difference = difference + (7 - fullMoon.getDay());

            // ** Bereken de Eerste Paasdag:
            if (difference <= 31) {
                day = difference;
                month = 3;
            } else {
                day = difference - 31;
                month = 4;
            }
            easterSunday = new Date(year, (month - 1), day, 4);

            // ** Rekenen met datums?
            goodFriday = new Date(easterSunday);
            goodFriday.setTime(easterSunday.getTime() - (2 * 86400000));
            easterMonday = new Date(easterSunday);
            easterMonday.setTime(easterSunday.getTime() + (1 * 86400000));
            ascension = new Date(easterSunday);
            ascension.setTime(easterSunday.getTime() + (39 * 86400000));
            whitSunday = new Date(easterSunday);
            whitSunday.setTime(easterSunday.getTime() + (49 * 86400000));
            whitMonday = new Date(easterSunday);
            whitMonday.setTime(easterSunday.getTime() + (50 * 86400000));
            christmasDay = new Date(year, 11, 25, 4);
            boxingDay = new Date(year, 11, 26, 4);

            var christianDays = [
                { name: '1e Paasdag', date: easterSunday },
                { name: '2e Paasdag', date: easterMonday },
                { name: 'Hemelvaartsdag', date: ascension },
                { name: '1e Pinksterdag', date: whitSunday },
                { name: '2e Pinksterdag', date: whitMonday },
                { name: '1e Kerstdag', date: christmasDay },
                { name: '2e Kerstdag', date: boxingDay }
            ];

            if (includeGoodFriday) {
                christianDays = christianDays.concat({ name: 'Goede vrijdag', date: goodFriday });
            }

            return christianDays;
        };

        var calculateKingsday = function (year) {
            var kingsday = new Date(year, 3, 27, 4);
            if (kingsday.getDay() === 0) {
                kingsday = new Date(year, 3, 26, 4);
            }
            return { name: 'Koningsdag', date: kingsday };
        };

        var calculateLiberation = function () {
            return { name: 'Bevrijdingsdag', date: new Date(year, 4, 5, 4) };
        };

        var newYearsDay = function (year) {
            return { name: 'Nieuwjaarsdag', date: new Date(year, 0, 1, 4) };
        };

        var validateYear = function (year) {
            // ** Controle van invoer-jaartal:
            if (year !== parseInt(year, 10)) {
                console.log('Het opgegeven jaar (' + year + ') is geen nummmer.');
                return false;
            }
            if (year < 1501) {
                console.log('Het opgegeven jaar (' + year + ') is te laag voor een zinvolle berekening.');
                return false;
            }
            if (year > 275759) {
                console.log('Het opgegeven jaar (' + year + ') is te hoog voor dit berekenings-script.');
                return false;
            }
            return true;
        };

        var compare = function (a, b) {
            if (a.date < b.date)
                return -1;
            if (a.date > b.date)
                return 1;
            return 0;
        };

	    /**
	     * @ngdoc function
	     * @name dutchPublicHolidays.dutchPublicHolidays#getHolidays
	     * @methodOf dutchPublicHolidays.dutchPublicHolidays
	     *
	     * @description
	     * Determines for the given year all Dutch public holidays
	     * <pre>
	     * dutchPublicHolidays.getHolidays(year)
	     * </pre>
	     *
	     * @param {year} year of calculation
	     * @return {Object|Array} Objects with name and date of public holidays
	     */
        this.getHolidays = function (year) {
            var holidays = [];
            if (validateYear(year)) {
                holidays = calculateChristianHolidays(year);
                holidays = holidays.concat(newYearsDay(year));
                if (includeLiberationDay) {
                    holidays = holidays.concat(calculateLiberation(year));
                } else if (includeLiberationDayOnLustrum && ((year % 5) === 0)) {
                    holidays = holidays.concat(calculateLiberation(year));
                }
                holidays = holidays.concat(calculateKingsday(year));
            }
            holidays.sort(compare);
            return holidays;
        };

	    /**
	     * @ngdoc function
	     * @name dutchPublicHolidays.dutchPublicHolidays#isHoliday
	     * @methodOf dutchPublicHolidays.dutchPublicHolidays
	     *
	     * @description
	     * Determines if the given date is a Dutch public holiday, or not
	     * <pre>
	     * dutchPublicHolidays.isHoliday(date)
	     * </pre>
	     *
	     * @param {date} date of calculation
	     * @return {boolean} Returns true if the date is a public holiday
	     */
        this.isHoliday = function (date) {
            var year = date.getFullYear();
            var holidays = this.getHolidays(year);
            var found = false;
            angular.forEach(holidays, function (holiday) {
                if (holiday.date.getDate() === date.getDate() && holiday.date.getMonth() === date.getMonth()) {
                    found = true;
                }
            });
            return found;
        };
    }

	/**
	 * @ngdoc function
	 * @name dutchPublicHolidays.dutchPublicHolidays#includeLiberationDay
	 * @methodOf dutchPublicHolidays.dutchPublicHolidays
	 *
	 * @description
	 * Defines whether liberation day should be included in the public holidays, or not.
	 *
	 * @example
	 * <pre>
	 * angular.module('app', ['dutchPublicHolidays']);
	 *   .run(function(dutchPublicHolidays) {
       *     dutchPublicHolidays.includeLiberationDay();
       * });
	 * </pre>
	 */
    this.includeLiberationDay = function () {
        includeLiberationDay = true;
    };

	/**
	 * @ngdoc function
	 * @name dutchPublicHolidays.dutchPublicHolidays#includeLiberationDayOnLustrum
	 * @methodOf dutchPublicHolidays.dutchPublicHolidays
	 *
	 * @description
	 * Defines whether liberation day when it's a lustrum should be included in the public holidays, or not.
	 *
	 * @example
	 * <pre>
	 * angular.module('app', ['dutchPublicHolidays']);
	 *   .run(function(dutchPublicHolidays) {
       *     dutchPublicHolidays.includeLiberationDayOnLustrum();
       * });
	 * </pre>
	 */
    this.includeLiberationDayOnLustrum = function () {
        includeLiberationDayOnLustrum = true;
    };

	/**
	 * @ngdoc function
	 * @name dutchPublicHolidays.dutchPublicHolidays#includeGoodFriday
	 * @methodOf dutchPublicHolidays.dutchPublicHolidays
	 *
	 * @description
	 * Defines whether good friday should be included in the public holidays, or not.
	 *
	 * @example
	 * <pre>
	 * angular.module('app', ['dutchPublicHolidays']);
	 *   .run(function(dutchPublicHolidays) {
       *     dutchPublicHolidays.includeGoodFriday();
       * });
	 * </pre>
	 */
    this.includeGoodFriday = function () {
        includeGoodFriday = true;
    };

	/**
	 * @ngdoc object
	 * @name dutchPublicHolidays.dutchPublicHolidays
	 	 *
	 *
	 * @description
	 * `dutchPublicHolidays` service is responsible for calculating Dutch public holidays.
	 */
    this.$get = function () {
        return new DutchHolidaysService();
    };
});