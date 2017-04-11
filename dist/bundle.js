/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Matcha = function (_React$Component) {
	_inherits(Matcha, _React$Component);

	function Matcha() {
		_classCallCheck(this, Matcha);

		return _possibleConstructorReturn(this, (Matcha.__proto__ || Object.getPrototypeOf(Matcha)).apply(this, arguments));
	}

	_createClass(Matcha, [{
		key: "render",
		value: function render() {
			return React.createElement("div", null);
		}
	}]);

	return Matcha;
}(React.Component);

ReactDOM.render(React.createElement(Matcha, null), document.getElementById('react-matcha'));

function Square(props) {
	return React.createElement(
		"button",
		{ className: "square", onClick: function onClick() {
				return props.onClick();
			} },
		props.value
	);
}

var Board = function (_React$Component2) {
	_inherits(Board, _React$Component2);

	function Board() {
		_classCallCheck(this, Board);

		return _possibleConstructorReturn(this, (Board.__proto__ || Object.getPrototypeOf(Board)).apply(this, arguments));
	}

	_createClass(Board, [{
		key: "renderSquare",
		value: function renderSquare(i) {
			var _this3 = this;

			return React.createElement(Square, { value: this.props.squares[i], onClick: function onClick() {
					return _this3.props.onClick(i);
				} });
		}
	}, {
		key: "render",
		value: function render() {
			return React.createElement(
				"div",
				null,
				React.createElement(
					"div",
					{ className: "board-row" },
					this.renderSquare(0),
					this.renderSquare(1),
					this.renderSquare(2)
				),
				React.createElement(
					"div",
					{ className: "board-row" },
					this.renderSquare(3),
					this.renderSquare(4),
					this.renderSquare(5)
				),
				React.createElement(
					"div",
					{ className: "board-row" },
					this.renderSquare(6),
					this.renderSquare(7),
					this.renderSquare(8)
				)
			);
		}
	}]);

	return Board;
}(React.Component);

var Game = function (_React$Component3) {
	_inherits(Game, _React$Component3);

	function Game() {
		_classCallCheck(this, Game);

		var _this4 = _possibleConstructorReturn(this, (Game.__proto__ || Object.getPrototypeOf(Game)).call(this));

		_this4.state = {
			history: [{
				squares: Array(9).fill(null)
			}],
			xIsNext: true,
			stepNumber: 0
		};
		return _this4;
	}

	_createClass(Game, [{
		key: "handleClick",
		value: function handleClick(i) {
			var history = this.state.history;
			var current = history[history.length - 1];
			var squares = current.squares.slice();

			if (calculateWinner(squares) || squares[i] || this.state.stepNumber != history.length - 1) return;

			squares[i] = this.state.xIsNext ? 'X' : 'O';
			this.setState({
				history: [].concat(_toConsumableArray(history), [{ squares: squares }]),
				xIsNext: !this.state.xIsNext,
				stepNumber: history.length
			});
		}
	}, {
		key: "jumpTo",
		value: function jumpTo(step) {
			this.setState({
				xIsNext: step % 2 ? false : true,
				stepNumber: step
			});
		}
	}, {
		key: "render",
		value: function render() {
			var _this5 = this;

			var history = this.state.history;
			var current = history[this.state.stepNumber];
			var winner = calculateWinner(current.squares);

			var status = void 0;
			if (winner) status = 'Winner is ' + winner;else status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
			var moves = history.map(function (step, move) {
				var desc = move ? 'Move #' + move : 'Game start';
				return React.createElement(
					"li",
					{ key: move },
					React.createElement(
						"a",
						{ href: "#", onClick: function onClick() {
								return _this5.jumpTo(move);
							} },
						desc
					)
				);
			});
			return React.createElement(
				"div",
				{ className: "game" },
				React.createElement(
					"div",
					{ className: "game-board" },
					React.createElement(Board, {
						squares: current.squares,
						onClick: function onClick(i) {
							return _this5.handleClick(i);
						}
					})
				),
				React.createElement(
					"div",
					{ className: "game-info" },
					React.createElement(
						"div",
						null,
						status
					),
					React.createElement(
						"ol",
						null,
						moves
					)
				)
			);
		}
	}]);

	return Game;
}(React.Component);

// ========================================

ReactDOM.render(React.createElement(Game, null), document.getElementById('react-root'));

function calculateWinner(squares) {
	var lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
	for (var i = 0; i < lines.length; i++) {
		var _lines$i = _slicedToArray(lines[i], 3),
		    a = _lines$i[0],
		    b = _lines$i[1],
		    c = _lines$i[2];

		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return squares[a];
		}
	}
	return null;
}

/***/ })
/******/ ]);