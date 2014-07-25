/**
 * @ngdoc overview
 * @name dutchPublicHolidays

 *
 * @description
 * # dutchPublicHolidays
 *
 * ## The main module for dutchPublicHolidays
 * There are several sub-modules included with the dutchPublicHolidays module, however only this module is needed
 * as a dependency within your angular app. The other modules are for organization purposes.
 *
 * The modules are:
 * * dutchPublicHolidays - the main "umbrella" module
 *
 * *You'll need to include **only** this module as the dependency within your angular app.*
 *
 * <pre>
 * <!doctype html>
 * <html ng-app="myApp">
 * <head>
 *   <script src="js/angular.js"></script>
 *   <!-- Include the dutch-public-holidays script -->
 *   <script src="js/dutch-public-holidays.min.js"></script>
 *   <script>
 *     // ...and add 'dutchPublicHolidays' as a dependency
 *     var myApp = angular.module('myApp', ['dutchPublicHolidays']);
 *   </script>
 * </head>
 * <body>
 * </body>
 * </html>
 * </pre>
 */
angular.module('dutchPublicHolidays', [ ]);
