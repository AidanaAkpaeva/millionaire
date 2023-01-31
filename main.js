console.log('Game: "Who Wants to Be a Millionaire?"');
console.log('');

// Ссылка для скачивания вопросв
// https://pastebin.com/QRGzxxEy
const FS = require('fs');
const URL = './questions.json';
const PROMPT = require('prompt-sync')();

FS.readFile(URL, function (err, data) {
	if (err) {
		return console.error(err);
	}
	let dataJSON = JSON.parse(data);

	let userName;
	let questionNumber = 0;
	let bank = 0;
	let count = 0;
	let userAnswer;

	// 50/50
	let hintFiftyFifty = (element) => {
		console.log('');
		console.log('You used the "50/50" hint. Choose an answer option:');
		switch (element.answer) {
			case 'A':
				console.log(element.answer + '. ' + element.A);
				console.log('C. ' + element.C);
				break;
			case 'B':
				console.log('A. ' + element.A);
				console.log(element.answer + '. ' + element.B);
				break;
			case 'C':
				console.log(element.answer + '. ' + element.C);
				console.log('D. ' + element.D);
				break;
			case 'D':
				console.log('B. ' + element.B);
				console.log(element.answer + '. ' + element.D);
				break;
			default:
				console.log('error')
				break;
		}
		userAnswer = PROMPT('Enter your answer: ').toUpperCase();
		correctAnswer(userAnswer, element);
	}

	// Пропустить вопрос
	let hintSkipTheQuestion = () => {
		console.log('');
		console.log('You used the "Skip question" hint. Next question.');
		console.log('');
		bank = bank + 1000;
		outputRandomQuestions();
	}

	// Генерирует случайный вопрос
	let randomQuestions = (element) => {
		console.log(++questionNumber + '.' + element.question);
		console.log('A.' + element.A);
		console.log('B.' + element.B);
		console.log('C.' + element.C);
		console.log('D.' + element.D);
		console.log('');
		console.log('Correct answer: ' + element.answer);
	}

	let correctAnswer = (userAnswer, element) => {
		// Проверка ответа на правильность
		if (userAnswer === element.answer) {
			console.log('Correct!');
			console.log('');
			bank = bank + 1000;
			outputRandomQuestions();
		}
		else {
			console.log(`${userName}, you've lost! You have earned: ${bank}$`);
		}
	}

	// Вывод рандомных вопросов
	let outputRandomQuestions = () => {
		let random = Math.floor(Math.random() * 547); // всего 547 вопросов

		// Вывод не больше 5 вопросов
		if (count < 5) {
			count++;

			dataJSON.slice(random - 1, random).forEach(function (element) {
				// Можно ли проверить что выводится в консоль?
				console.log('Hints:')
				console.log('1.Hint "50/50"');
				console.log('2.Hint "Skip the question"');
				console.log('');

				console.log('Question:');
				randomQuestions(element);

				// Ввод ответа и делаем буквы заглавными
				console.log('');
				userAnswer = PROMPT('Enter your answer: ').toUpperCase();
				switch (userAnswer) {
					case '1':
						hintFiftyFifty(element);
						break;
					case '2':
						hintSkipTheQuestion();
					default:
						correctAnswer(userAnswer, element);
						break;
				}
			})
		} else {
			console.log(`${userName}, you've win! You have earned: ${bank}$`);
		}
	}

	// Основная функция
	let game = () => {
		userName = PROMPT("What is your name? ");
		console.log('');

		outputRandomQuestions();
	}

	game();
});
