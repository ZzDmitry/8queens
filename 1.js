/**
 * Log message.
 * @param {*} [s]
 */
function log(s) {
	if (typeof WScript !== 'undefined')
		WScript.Echo('' + s);
	else if (typeof console !== 'undefined')
		console.log(s);
}

/*
log('Hello, world!');
log({a:123});
log([1,2,'aas']);
*/

/**
 * @param {Number} QUEENS
 * @return {Object}
 */
function make8queensSolution(QUEENS) {

	/**
	 * Log the queens setting.
	 * @param {Array.<Number>} queens
	 */
	function showQueens(queens) {
		var x, y;
		var s;
		var qy;
		for (y = 0; y < QUEENS; y++) {
			s = '';
			for (x = 0; x < QUEENS; x++) {
				qy = queens[x];
				if (typeof qy != 'number' || isNaN(qy))
					s += '-';
				else
					s += queens[x] == y ? '*' : '-';
				s += ' ';
			}
			log(s);
		}
	}

	/**
	 * Return the 2-dim array of hits (true - field is hit, false - not).
	 * @param {Array.<Number>} queens
	 * @param {Array.<Array.<Boolean>>} [prev_hits]
	 * @return {Array.<Array.<Boolean>>}
	 */
	function calculateHits(queens, prev_hits) {
		var y;
		var hits;
		if (prev_hits)
			hits = prev_hits;
		else {
			hits = new Array(QUEENS);
			for (y = 0; y < QUEENS; y++) {
				hits[y] = new Array(QUEENS);
			}
		}

		/**
		 * @param {Number} x
		 */
		function fillHitsVertical(x) {
			var y;
			for (y = 0; y < QUEENS; y++)
				hits[x][y] = true;
		}

		/**
		 * @param {Number} x
		 * @param {Number} y
		 */
		function fillHitsHorizontalAndDiagonals(x, y) {
			var dx;
			for (dx = -x; dx < QUEENS - x; dx++) {
				if (!dx)
					continue;
				hits[x + dx][y] = true;
				if (y + dx < QUEENS)
					hits[x + dx][y + dx] = true;
				if (y - dx >= 0)
					hits[x + dx][y - dx] = true;
			}
		}

		var x;
		if (prev_hits) {
			x = queens.length - 1;
			y = queens[x];
			if (typeof y != 'number' || isNaN(y))
				return hits;
			fillHitsVertical(x);
			fillHitsHorizontalAndDiagonals(x, y);
			return hits;
		}

		for (x = 0; x < QUEENS; x++) {
			y = queens[x];
			if (typeof y != 'number' || isNaN(y))
				continue;
			fillHitsVertical(x);
			fillHitsHorizontalAndDiagonals(x, y);
		}

		return hits;
	}

	/**
	 * @param {Array.<Array.<Boolean>>} hits
	 */
	function showHits(hits) {
		var x, y;
		var s;
		for (y = 0; y < QUEENS; y++) {
			s = '';
			for (x = 0; x < QUEENS; x++) {
				s += hits[x][y] ? '+' : '-';
				s += ' ';
			}
			log(s);
		}
	}

	/**
	 * @param {Array.<Number>} queens
	 * @param {Array.<Array<Boolean>>} [hits]
	 * @param {Number} [start_y]
	 * @return {Boolean}
	 */
	function findValidNewQueenPos(queens, hits, start_y) {
		var x = queens.length;
		var y;
		for (y = start_y || 0; y < QUEENS; y++) {
			if (hits && hits[x][y])
				continue;
			queens.push(y);
			return true;
		}
		return false;
	}

	/**
	 * @param {Array.<Number>} queens
	 * @return {?Array.<Array<Boolean>>}
	 */
	function findValidNextQueenPos(queens) {
		var last_x = queens.length - 1;
		if (last_x < 0 || last_x >= QUEENS)
			throw 'findValidNextQueenPos at wrong setting, last x = ' + last_x;
		var last_y = queens.pop();
		if (last_y + 1 >= QUEENS)
			return null;
		var hits = calculateHits(queens);
		var success = findValidNewQueenPos(queens, hits, last_y + 1);
		if (success)
			return calculateHits(queens, hits);
		else
			return null;
	}

	function solve() {
		var queens = [];
		var success;
		var hits;

		var i;
		var set_new_queen = true;
		var num = 0;
		var t0 = new Date();
		while(true) {
			if (set_new_queen) {
				success = findValidNewQueenPos(queens, hits);
				if (success) {
					if (queens.length >= QUEENS) {
						num++;
						//log('Solution found, #' + (num) + ', ' + (new Date() - t0));
						//showQueens(queens);
						set_new_queen = false;
						continue;
					}
					//log('New queen placed');
					//showQueens(queens);
					hits = calculateHits(queens);
					//log('hits:');
					//showHits(hits);
				}
				else {
					if (!queens.length)
						break;
					//log('No place for new queen');
					set_new_queen = false;
				}
			}
			else {
				hits = findValidNextQueenPos(queens);
				if (hits) {
					//log('Last queen reposed');
					//showQueens(queens);
					//log('hits:');
					//showHits(hits);
					set_new_queen = true;
				}
				else {
					if (!queens.length)
						break;
					//log('No place to repose');
					//showQueens(queens);
				}
			}
		}
		return num;
	}

	return {
		showQueens: showQueens,
		showHits: showHits,
		solve: solve
	};
}

/**
 * @param {Number} QUEENS
 * @return {Object}
 */
function make8queensSolution_v2(QUEENS) {
	var s_v1 = make8queensSolution(QUEENS);

	/**
	 * @param {Array.<Number>} queens
	 */
	function showQueens(queens) {
		s_v1.showQueens(queens);
	}

	/**
	 * @param {{y: Object, x: Array.<Number>}} hits
	 */
	function showHits(hits) {
		var y;
		var s = '';
		for (y = 0; y < QUEENS; y++)
			s += (hits.y[y] ? '+' : '-') + ' ';
		log('H: ' + s);
		log('V: ' + hits.x.join(' '));
	}

	/**
	 * Find position start with y_min, for the queen with given x
	 * Return <0 if fail.
	 * @param {Number} x
	 * @param {Number} y_min
	 * @param {{y: Object, x: Array.<Number>}} hits
	 * @return {Number}
	 */
	function findQueenPlace(x, y_min, hits) {
		/**
		 * Return true if queen can be at (x, y)
		 * @param {Number} y
		 * @return {Boolean}
		 */
		function checkY(y) {
			if (hits.y[y])
				return false;
			var hit_x;
			for (hit_x = 0; hit_x < x; hit_x++) {
				var dx = x - hit_x;
				var dy = Math.abs(y - hits.x[hit_x]);
				if (dx == dy)
					return false;
			}
			return true;
		}

		var y;
		for (y = y_min; y < QUEENS; y++) {
			if (checkY(y))
				return y;
		}
		return -1;
	}

	/**
	 * Add new queen to the queens array.
	 * Return true if success,
	 * return false if fail, in that case queens array will be not changed.
	 * @param {Array.<Number>} queens
	 * @param {{y: Object, x: Array.<Number>}} hits
	 * @return {Boolean}
	 */
	function addQueen(queens, hits) {
		var x = queens.length;
		var y = findQueenPlace(x, 0, hits);
		if (y < 0)
			return false;
		queens.push(y);
		return true;
	}

	/**
	 * Add hits for last queen in the queens array.
	 * @param {Array.<Number>} queens
	 * @param {{y: Object, x: Array.<Number>}} hits
	 */
	function addLastQueenHits(queens, hits) {
		var x = queens.length - 1;
		var y = queens[x];
		hits.y[y] = true;
		hits.x[x] = y;
	}

	/**
	 * Remove last queen's hits.
	 * @param queens
	 * @param hits
	 */
	function removeLastQueenHits(queens, hits) {
		var x = queens.length - 1;
		var y = queens[x];
		delete hits.y[y];
		hits.x.pop();
	}

	/**
	 * Move last queen to the new place, all previous queens hits as in 'hits' parameter.
	 * Return true if success,
	 * return false if fails, then remove last queen.
	 * @param queens
	 * @param hits
	 * @return {Boolean}
	 */
	function moveLastQueen(queens, hits) {
		var x = queens.length - 1;
		var y = queens.pop() + 1;
		if (y >= QUEENS)
			return false;
		var new_y = findQueenPlace(x, y, hits);
		if (new_y < 0)
			return false;
		queens.push(new_y);
		return true;
	}

	function solve() {
		var solutions_count = 0;
		var queens = [];
		var hits = {y: {}, x: []};
		var add_queen = true;
		var success;
		while (true) {
			if (add_queen) {
//				log('Add queen');
				success = addQueen(queens, hits);
				if (success) {
					addLastQueenHits(queens, hits);
//					log('success:');
//					showQueens(queens);
//					showHits(hits);
					if (queens.length >= QUEENS) {
						solutions_count++;
//						log('Solution #' + solutions_count);
//						showQueens(queens);
						add_queen = false;
					}
				}
				else {
					add_queen = false;
//					log('fail:');
//					showQueens(queens);
//					showHits(hits);
				}
			}
			else {
//				log('Move queen');
				if (!queens.length) {
//					log('Move no queens - break.');
					break;
				}
				removeLastQueenHits(queens, hits);
//				log('Remove last queen hits');
//				showHits(hits);
				success = moveLastQueen(queens, hits);
				if (success) {
					addLastQueenHits(queens, hits);
//					log('success:');
//					showQueens(queens);
//					showHits(hits);
					add_queen = true;
				}
				else {
//					log('fail:');
//					showQueens(queens);
//					showHits(hits);
				}
			}
		}
		return solutions_count;
	}


	return {
		showQueens: showQueens,
		showHits: showHits,
		solve: solve
	};
}

//var s1 = make8queensSolution(10);
//log(solve(s1));

function showSolutions1(make_s, max_queens) {
	var b = makeBenchmark();
	var i;
	for (i = 1; i <= max_queens; i++) {
		var s = make_s(i);
		var res = b(
			function(){
				return s.solve();
			}
		);
		log([i, res.result, res.time].join('; '));
	}
}

//showSolutions1(make8queensSolution, 8);
//showSolutions1(make8queensSolution_v2, 8);

/*
cscript
 1; 1; 0.007079706349024567
 2; 0; 0.04165670067701101
 3; 0; 0.139383030389094
 4; 2; 0.6866460948335675
 5; 10; 4.153816666666667
 6; 4; 11.987454878048781
 7; 40; 58.94083007847855
 8; 92; 390.999656700677
 9; 352; 1379.9996381439568
 10; 724; 7020.99965
 11; 2680; 39527.999656700675

node
 1; 1; 0.00031546135132807097
 2; 0; 0.0013046337008296254
 3; 0; 0.00701109500738087
 4; 2; 0.037490109890001205
 5; 10; 0.19138014120260194
 6; 4; 0.8728122996515679
 7; 40; 3.7199899120878013
 8; 92; 19.333323344322235
 9; 352; 109.55554556654447
 10; 724; 504.9999898131867
 11; 2680; 2914.9999899120876
 */

/*
 cscript /nologo 1.js
 1; 1; 0.021276550235478805
 2; 0; 0.041118055555555553
 3; 0; 0.09351666666666666
 4; 2; 0.2890257571708534
 5; 10; 1.0577673266010152
 6; 4; 3.429607216089914
 7; 40; 13.311083743169398
 8; 92; 56.57855458451097
 9; 352; 325.33295833333335
 10; 724; 1139.999625
 11; 2680; 5924.999633333333

node
 1; 1; 0.0007339393016410832
 2; 0; 0.0013983544431831264
 3; 0; 0.0030395353252566566
 4; 2; 0.009901003581263485
 5; 10; 0.04495128906261768
 6; 4; 0.10649244691083005
 7; 40; 0.443254559061196
 8; 92; 2.215718172243353
 9; 352; 7.819988629213356
 10; 724; 40.94735719883041
 11; 2680; 243.74998702247177
 */


/**
 * @param {String} name
 * @param {{result: *, time: Number, rounds: Number, test_time: Number}} b
 */
function logBenchmark(name, b) {
	log('\nName: ' + name);
	if (!b) {
		log('No result');
		return;
	}
	log('Result: ' + b.result);
	log('Time: ' + +b.time.toPrecision(2));
	log('Rounds: ' + b.rounds);
	log('Test time: ' + +b.test_time.toPrecision(2));
}

function logBenchmark1(name, b) {
	log(b ? (b.time + '').replace(/\./g, ',') : -1);
}

/**
 * @param {Number} [MAX_TEST_TIME]
 * @return {function(function(): *): ?{result: *, time: Number, rounds: Number, test_time: Number}}
 */
function makeBenchmark(MAX_TEST_TIME) {

	/**
	 * @param {Number} rounds
	 * @param {*} result0
	 * @param {Date} t0
	 * @param {function(): *} f
	 * @return {?Number}
	 */
	function benchmark_test(rounds, result0, t0, f) {
		var result;
		while (rounds-- > 0) {
			result = f();
			if (result != result0)
				return null;
		}
		return new Date() - t0;
	}

	function benchmark_empty() {
	}

	/**
	 * @param {function(): *} f
	 * @param {Number} [max_time]
	 * @return {?{result: *, time: Number, rounds: Number, test_time: Number}}
	 */
	function benchmark(f, max_time) {
		max_time = max_time || 1000;

		f = f || benchmark_empty;

		var t0 = new Date();
		var result0 = f();
		var test_time = new Date() - t0;
		var rounds = 1;
		var overall_test_time = test_time;

		while (true) {
			var can_repeat_last_times = (max_time - overall_test_time) / test_time;
			if (can_repeat_last_times < 2) {
				return {
					result: result0,
					time: test_time / rounds,
					rounds: rounds,
					test_time: overall_test_time
				};
			}

			var repeat_times = Math.min(can_repeat_last_times, 100);
			rounds = Math.floor(rounds * repeat_times);
			test_time = benchmark_test(rounds, result0, new Date(), f);
			if (test_time === null)
				return null;
			//log([rounds, test_time, +(test_time / rounds).toPrecision(2)]);
			var cur_time = new Date();

			overall_test_time = cur_time - t0;
		}
	}

	MAX_TEST_TIME = MAX_TEST_TIME || 1000;
	return function(f){
		var result = benchmark(f, MAX_TEST_TIME * 0.9);
		if (!result)
			return result;
		var emptyResult = benchmark(function(){}, MAX_TEST_TIME * 0.1);
		result.time -= emptyResult.time;
		if (result.time < 0)
			result.time = 0;
		result.test_time += emptyResult.time;
		return result;
	};
}


var benchmark = makeBenchmark();

logBenchmark('t', benchmark());

logBenchmark('t0', benchmark(function(){
}));

logBenchmark('t1', benchmark(function(){
	return 123;
}));

logBenchmark('t2', benchmark(function(){
	return 123 * Math.random();
}));

logBenchmark('t-1', benchmark(function(){
	var i;
	var sum = 0;
	for (i = 0; i < 10; i++)
		sum += i;
	return sum;
}));

logBenchmark('t-3', benchmark(function(){
	var i;
	var sum = 0;
	for (i = 0; i < 1000; i++)
		sum += i;
	return sum;
}));

logBenchmark('t-6', benchmark(function(){
	var i;
	var sum = 0;
	for (i = 0; i < 1000000; i++)
		sum += i;
	return sum;
}));

logBenchmark('t-7', benchmark(function(){
	var i;
	var sum = 0;
	for (i = 0; i < 10000000; i++)
		sum += i;
	return sum;
}));
