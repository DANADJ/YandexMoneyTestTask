const UrlParser = require('./dist/urlParser');

// const testUrlString = 'kbkjvkjvkjvkjkkjvhttp://www.valentingordienko.ru:3000/projects/firstProject/index.js?firstName=Valentin&secondName=Gordienko#1ponh8yvu7v6fcv766';
// const testUrlString = 'http://valentingordienko.ru/projects/firstProject/index.js?firstName=Valentin&secondName=Gordienko#1ponh8yvu7v6fcv766';
// const testUrlString = 'https://babeljs.io/learn-es2015/#20/ecmascript-2015-features-iterators-for-of';
// const testUrlString = 'http://localhost:3000/MAMP/?language=English';
const testUrlString = 'git@github.com:SOMEPEOPLE/SomeProject.git';

/**
 * Тест метода parseUrlString
 */
console.log();
console.log('Тест метода parseUrlString:\n^');

const testUrlObject = UrlParser.parseUrlString(testUrlString);

console.log(testUrlObject);

console.log('--------------------------------------------');

/**
 * Тест метода serrializeUrl
 */
console.log();
console.log('Тест метода serrializeUrl:\n^');

console.log(UrlParser.serrializeUrl(testUrlObject));

console.log('--------------------------------------------');

/**
 * Тест методов для HASH
 */
console.log();
console.log('Тест методов для HASH:\n^');

UrlParser.setHash(testUrlObject, 'megahash');
console.log(UrlParser.serrializeUrl(testUrlObject));

UrlParser.removeHash(testUrlObject);
console.log(UrlParser.serrializeUrl(testUrlObject));

UrlParser.setHash(testUrlObject, '#megahash');
console.log(UrlParser.serrializeUrl(testUrlObject));

console.log('--------------------------------------------');

/**
 * Тест методов для SEARCH
 */
console.log();
console.log('Тест методов для SEARCH:\n^');

UrlParser.setSearchParam(testUrlObject, {key: 'method', value: 'set'});
console.log(UrlParser.serrializeUrl(testUrlObject));

UrlParser.setSearchParam(testUrlObject, [
	{key: 'method', value: 'get'},
	{key: 'firstName', value: 'Andrey'},
	{key: 'secondName', value: 'Panov'},
]);
console.log(UrlParser.serrializeUrl(testUrlObject));

UrlParser.removeSearchParam(testUrlObject, 'method');
console.log(UrlParser.serrializeUrl(testUrlObject));

UrlParser.setSearchParam(testUrlObject, 'newMethod=delete');
console.log(UrlParser.serrializeUrl(testUrlObject));

UrlParser.setSearchParam(testUrlObject, '?newMethod=set');
console.log(UrlParser.serrializeUrl(testUrlObject));