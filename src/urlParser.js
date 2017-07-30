/**
 * @module urlParser
 * @author Valentin Gordienko <valentingordienkospb@gmail.com>
 */

"use strict";

/**
 * Регулярный выражения для поиска сопоставлений в URL строке
 */
const
	ValidedUrlRegExp = /\(?(?:(http|https|ftp):\/\/)?(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})(?::(\d*))?([\/]?[^\s\?]*[\/]{1})*(?:\/?([^\s\n\?\[\]\{\}\#]*(?:(?=\.)){1}|[^\s\n\?\[\]\{\}\.\#]*)?([\.]{1}[^\s\?\#]*)?)?(?:\?{1}([^\s\n\#\[\]]*))?([\#][^\s\n]*)?\)?/gi,
	protocolRegExp = /(?:http|https|ftp):{1}|(?:((?:[^\W\s]|\.|-|[:]{1})+)@{1})?/i,
	hostRegExp = /((?:www.)?(?:[^\W\s]|\.|-)+[\.][^\W\s]{2,4}|localhost|\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/i,
	portRegExp = /:\d{1,4}|:[^\d\/\s]+/i,
	pathnameRegExp = /\/(?!\/)[^\s\?\#]*|:(?!\d|\/)[^\s\?\#]*/i,
	queriesRegExp = /\?{1}[^\s\n\#\[\]]*/i,
	hashRegExp = /\#[^\s]*/i;


/**
 * Вспомогательные функции-утилиты
 */
const Utilities = {

	/**
	 * @description - Метод проверяет аргумент на соответствие типу "undefined"
	 *
	 * @method isUndefined
	 *
	 * @throws {error} - Выбрасывает исключение если тип проверяемого аргумент "undefined"
	 */
	isUndefined(checkedArgument){
		if (typeof checkedArgument === 'undefined') {
			throw new Error('Не передан аргумент или его значение не опредлено. Операция отменена.');
		}
	},


	/**
	 * @description - Метод проверяет аргумент на НЕ соответствие типу "string"
	 *
	 * @method isString
	 *
	 * @throws {error} - Выбрасывает исключение если тип проверяемого аргумента "string"
	 */
	isString(checkedArgument){
		if (typeof checkedArgument !== 'string') {
			throw new Error('Передаваемый аргумент не строка. Операция отменена.');
		}
	},


	/**
	 * @description - Метод проверяет аргумент на НЕ соответствие экземпляру "object"
	 *
	 * @method isObject
	 *
	 * @throws {error} - Выбрасывает исключение если проверяемый аргумент не экземпляр "object"
	 */
	isObject(checkedArgument){
		if (checkedArgument === null || Array.isArray(checkedArgument) || typeof checkedArgument !== 'object') {
			throw new Error('Передаваемый аргумент не объект. Операция отменена.');
		}
	},


	/**
	 * @description - Метод проверяет аргумент на НЕ соответствие экземпляру "array"
	 *
	 * @method isString
	 *
	 * @throws {error} - Выбрасывает исключение если проверяемый аргумент не экземпляр "array"
	 */
	isArray(checkedArgument){
		if (!Array.isArray(checkedArgument)) {
			throw new Error('Передаваемый аргумент не массив. Операция отменена.');
		}
	},


	/**
	 * @description - Метод проверяет аргумент(строку) соответствет ли он целиком или его часть валидному синтаксису URL строки
	 *
	 * @method isUrlString
	 *
	 * @throws {error} - Выбрасывает исключение если проверяемый аргумент не является или не содержит валидную URL строку
	 */
	isUrlString(checkedArgument){
		if (!checkedArgument.match(ValidedUrlRegExp)) {
			throw new Error('Передаваемая строка не является валидной URL строкой. Операция отменена.');
		}
	},


	/**
	 * @description - Метод проверяет аргумент на НЕ соответствие хотя-бы одному типу данных из трёх ожидаемых (string|object|array)
	 *
	 * @method isMultipleTypeSearchArgument
	 *
	 * @throws {error} - Выбрасывает исключение если проверяемый аргумент не соответствует ни одному ожидаемому типу данных
	 */
	isMultipleTypeSearchArgument(checkedArgument){
		if (typeof checkedArgument !== 'string' && !Array.isArray(checkedArgument) && !checkedArgument instanceof Object) {
			throw new Error('Принимаемый аргумент не соответствет ни одному ожидаемому типу (string|array|object)');
		}
	},


	/**
	 * @description - Метод проверяет, содержится ли в проверяемом аргументе (объекте) свойство "search"
	 *
	 * @method hasObjectSearchProperty
	 *
	 * @throws {error} - Выбрасывает исключение если в проверяемом аргументе (объекте) отсутствует свойство "search"
	 */
	hasObjectSearchProperty(checkedArgument){
		if (!checkedArgument.hasOwnProperty('search')) {
			throw new Error('В переданом объекте нет свойства "search". Возможно в функцию передан не объект URL. Операция отменена.');
		}
	},


	/**
	 * @description - Метод проверяет, содержится ли в проверяемом аргументе (объекте) свойство "hash"
	 *
	 * @method hasObjectHashProperty
	 *
	 * @throws {error} - Выбрасывает исключение если в проверяемом аргументе (объекте) отсутствует свойство "hash"
	 */
	hasObjectHashProperty(checkedArgument){
		if (!checkedArgument.hasOwnProperty('hash')) {
			throw new Error('В переданом объекте нет свойства "hash". Возможно в функцию передан не объект URL. Операция отменена.');
		}
	},


	/**
	 * @description - Метод проверяет, содержится ли в проверяемом аргументе (объекте) оба свойства "key" и "value"
	 *
	 * @method isSearchCoupleObject
	 *
	 * @throws {error} - Выбрасывает исключение если в проверяемом аргументе (объекте) отсутствуют свойства "key" и "value", или какое-то одно
	 */
	isSearchCoupleObject(checkedArgument){
		if (!checkedArgument.hasOwnProperty('key') || !checkedArgument.hasOwnProperty('value')) {
			throw new Error('В переданом объекте нет свойств "key, value" или одного из них. Возможно в функцию передан не валидный объект SearchCouple. Операция отменена.');
		}
	},


	/**
	 * @description - Метод проверяет есть ли в проверяемом аргументе (строке) более чем один знак "?"
	 *
	 * @method isValidedSearchString
	 *
	 * @throws {error} - Выбрасывает исключение если в проверяемом аргументе (строке) более чем один знак "?"
	 */
	isValidedSearchString(checkedArgument){
		let questionMarksArray = checkedArgument.match(/\?/g);

		if (questionMarksArray && questionMarksArray.length > 1) {
			throw new Error('Не валидная строка запросов. Проверьте строку на соответствие стандарту. Операция отменена.');
		}
	},

};


/**
 * @description - Функция принимает строку URL в качестве аргумента и создаёт на её основе URL объект c различными параметрами этого URL.
 *
 * @function parseUrlString
 *
 * @param {string} urlString - Строка URL принимаемая для парсинга.
 *
 * @return {object|boolean} - Объект с параметрами созданными на основе переданнной в функцию строки.
 */
export function parseUrlString(urlString) {

	try {

		Utilities.isUndefined(urlString);
		Utilities.isString(urlString);
		Utilities.isUrlString(urlString);


		let
			href = urlString.match(ValidedUrlRegExp)[0],
			protocol = href.match(protocolRegExp),
			host = href.match(hostRegExp),
			port = href.match(portRegExp),
			pathname = href.match(pathnameRegExp) && href.match(pathnameRegExp)[0].substr(1).match(pathnameRegExp),
			search = href.match(queriesRegExp),
			hash = href.match(hashRegExp);


		return {
			protocol: protocol ? protocol[0] : '',
			host: host ? host[0] : '',
			port: port ? port[0] : '',
			pathname: pathname ? pathname[0] : '',
			search: search ? parseSearchStringToObject(search[0]) : {},
			hash: hash ? hash[0] : '',
		};

	} catch (e) {
		console.error(e);

		return false;
	}
}


/**
 * @description - Функция парсит строку параметров URL в объект.
 *
 * @function parseSearchStringToObject
 *
 * @param {string} searchString - Строка параметров URL.
 *
 * @return {object} searchCouplesObject - Объект cо свойствами представляющими параметры URL строки.
 */
function parseSearchStringToObject(searchString) {

	let searchCouplesStringsArray = searchString.replace('?', '').split('&'),
		searchCouplesObject = {};

	searchCouplesStringsArray.forEach(item => {

		let [key, value] = item.split('=');

		searchCouplesObject[key] = value;

	});

	return searchCouplesObject;
}


/**
 * @description - Функция собирает новую строку параметров из объекта cо свойствами представляющими параметры URL строки.
 *
 * @function buildNewSearchString
 *
 * @param {object} searchCouplesObjectsObject - Объект cо свойствами представляющими параметры URL строки.
 *
 * @return {string} newSearchString - Cтрока параметров URL.
 */
function buildNewSearchString(searchCouplesObjectsObject) {

	let newSearchString = '';

	if (Object.keys(searchCouplesObjectsObject).length) {

		let searchCouplesStringsArray = [];

		for (let searchCoupleName in searchCouplesObjectsObject){

			if(searchCouplesObjectsObject.hasOwnProperty(searchCoupleName)){

				searchCouplesStringsArray.push(`${searchCoupleName}=${searchCouplesObjectsObject[searchCoupleName]}`);

			}
		}

		newSearchString = '?' + searchCouplesStringsArray.join('&');

	}

	return newSearchString;
}


/**
 * @description - Функция изменяет имеющийся или добавляет новый элемент в строке параметров URL
 *
 * @function setCurrentSearchParam
 *
 * @param {object} searchCouplesObject - Объект cо свойствами представляющими параметры URL строки.
 * @param {object} currentSearchCoupleObject - Объект представляющий параметр URL строки cо свойствами "key" и "value".
 *
 * @return {boolean}
 */
function setCurrentSearchParam(searchCouplesObject, currentSearchCoupleObject) {

	try {

		/**
		 * Проверка принимаемых аргументов на undefined и соответствие нужному типу;
		 */
		Utilities.isUndefined(currentSearchCoupleObject);
		Utilities.isObject(currentSearchCoupleObject);
		Utilities.isSearchCoupleObject(currentSearchCoupleObject);


		let {key: searchCoupleKey, value: searchCoupleValue} = currentSearchCoupleObject;

		searchCouplesObject[searchCoupleKey] = searchCoupleValue;

		return true;

	} catch (e) {
		console.error(e);

		return false;
	}

}


/**
 * @description - Функция добавляет новый или изменяет имеющийся параметр запроса в объекте urlObject.
 *
 * @function setCurrentSearchParam
 *
 * @param {object} urlObject - Модернизируемый urlObject
 * @param {string|object|object[]} search - Новые или модернизиркемые параметры запросов. Если переданы в качестве строки функция создаст новый объект поверх старого
 * @param {string} search.key - Ключ параметра запроса
 * @param {string} search.value - Значение параметра запроса
 *
 * @return {boolean}
 */
export function setSearchParam(urlObject, search) {

	try {

		/**
		 * Проверка принимаемых аргументов на undefined и соответствие нужному типу;
		 */
		Utilities.isUndefined(urlObject);
		Utilities.isObject(urlObject);
		Utilities.hasObjectSearchProperty(urlObject);

		Utilities.isUndefined(search);
		Utilities.isMultipleTypeSearchArgument(search);


		if (typeof search === 'string') {

			Utilities.isValidedSearchString(search);

			urlObject.search = parseSearchStringToObject(search);

		} else if (search instanceof Object) {

			if (Array.isArray(search)) {

				search.forEach(searchCoupleObject => setCurrentSearchParam(urlObject.search, searchCoupleObject));

			} else {

				setCurrentSearchParam(urlObject.search , search);

			}

		}

		return true;


	} catch (e) {
		console.error(e);

		return false;
	}
}


/**
 * @description - Функция удаляет параметр запроса в объекте urlObject
 *
 * @function removeSearchParam
 *
 * @param {object} urlObject - Модернизируемый urlObject
 * @param {string} removedSearchName - Имя удаляемого параметра запроса
 *
 * @return {boolean}
 */
export function removeSearchParam(urlObject, removedSearchName) {

	try {

		/**
		 * Проверка принимаемых аргументов на undefined и соответствие нужному типу;
		 */
		Utilities.isUndefined(urlObject);
		Utilities.isObject(urlObject);
		Utilities.hasObjectSearchProperty(urlObject);

		Utilities.isUndefined(removedSearchName);
		Utilities.isString(removedSearchName);

		delete urlObject[removedSearchName];

		return true;

	} catch (e) {
		console.error(e);

		return false;
	}

}


/**
 * @description - Функция добавляет новый или изменяет имеющийся параметр hash в объекте urlObject
 *
 * @function setHash
 *
 * @param {object} urlObject - Модернизируемый urlObject
 * @param {string} newHash - Новое значение hash
 *
 * @return {boolean}
 */
export function setHash(urlObject, newHash) {

	try {

		/**
		 * Проверка принимаемых аргументов на undefined и соответствие нужному типу;
		 */
		Utilities.isUndefined(urlObject);
		Utilities.isObject(urlObject);
		Utilities.hasObjectHashProperty(urlObject);

		Utilities.isUndefined(newHash);
		Utilities.isString(newHash);


		if (!newHash.startsWith('#')) {
			newHash = `#${newHash}`;
		}

		urlObject.hash = newHash;

		return true;

	} catch (e) {
		console.error(e);

		return false;
	}
}


/**
 * @description - Функция удаляет имеющийся параметр hash в объекте urlObject
 *
 * @function removeHash
 *
 * @param {object} urlObject - Модернизируемый urlObject
 *
 * @return {boolean}
 */
export function removeHash(urlObject) {

	try {

		/**
		 * Проверка принимаемых аргументов на undefined и соответствие нужному типу;
		 */
		Utilities.isUndefined(urlObject);
		Utilities.isObject(urlObject);
		Utilities.hasObjectHashProperty(urlObject);


		urlObject.hash = '';

		return true;

	} catch (e) {
		console.error(e);

		return false;
	}
}


/**
 * @description - Функция серриализует новую строку запроса из объекта urlObject
 *
 * @function serrializeUrl
 *
 * @param {object} urlObject - Модернизируемый urlObject
 *
 * @return {string} - Строка URL собранная по данным urlObject
 */
export function serrializeUrl(urlObject) {

	try {

		/**
		 * Проверка принимаемых аргументов на undefined и соответствие нужному типу;
		 */
		Utilities.isUndefined(urlObject);
		Utilities.isObject(urlObject);


		return urlObject.protocol + '//' + urlObject.host + urlObject.port + urlObject.pathname + buildNewSearchString(urlObject.search) + urlObject.hash;

	} catch (e) {
		console.error(e);

		return '';
	}
}