let questions = [];
let currentQuestionIndex = 0;
let incorrectAnswers = [];
let correctCount = 0;
let wrongCount = 0;
let isEnglish = false;

fetch("/questions")
    .then(response => response.json())
    .then(data => {
        questions = data;
        showQuestion();
    })
    .catch(error => console.error("Error fetching questions:", error));

function showQuestion() {
    if (!questions.length) {
        console.error("Questions array is empty!");
        document.getElementById("quiz-container").innerHTML = "<p>Error: No questions available.</p>";
        return;
    }

    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const q = questions[currentQuestionIndex];
    isEnglish = false; // Reset translation state
    document.getElementById("translate-btn").innerText = "Translate to English";

    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = `
        <p><strong id="question-text">${q.question_es}</strong></p>
        ${q.image ? `<img src="/static/images/${q.image}" alt="Question Image" width="50">` : ""}
        <ul id="options-list">
            ${Object.entries(q.options_es)
                .map(([key, option]) => `<li><button class="option-btn" data-key="${key}" data-answer="${q.answer}"><strong>${key}</strong>: ${option}</button></li>`)
                .join("")}
        </ul>
    `;

    attachAnswerListeners();
}

function toggleTranslation() {
    if (!questions.length) return;

    const q = questions[currentQuestionIndex];
    const questionText = document.getElementById("question-text");
    const optionsList = document.getElementById("options-list");
    const translateBtn = document.getElementById("translate-btn");

    if (isEnglish) {
        questionText.innerText = q.question_es;
        optionsList.innerHTML = Object.entries(q.options_es)
            .map(([key, option]) => `<li><button class="option-btn" data-key="${key}" data-answer="${q.answer}"><strong>${key}</strong>: ${option}</button></li>`)
            .join("");
        translateBtn.innerText = "Translate to English";
        isEnglish = false;
    } else {
        questionText.innerText = q.question_en;
        optionsList.innerHTML = Object.entries(q.options_en)
            .map(([key, option]) => `<li><button class="option-btn" data-key="${key}" data-answer="${q.answer}"><strong>${key}</strong>: ${option}</button></li>`)
            .join("");
        translateBtn.innerText = "Translate to Spanish";
        isEnglish = true;
    }

    attachAnswerListeners();
}

function attachAnswerListeners() {
    document.querySelectorAll(".option-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            submitAnswer(this.dataset.key, this.dataset.answer, this);
        });
    });
}

function submitAnswer(selected, correct, button) {
    const correctCountElement = document.getElementById("correct-count");
    const wrongCountElement = document.getElementById("wrong-count");

    if (!correctCountElement || !wrongCountElement) {
        console.error("Error: Counter elements not found in the DOM.");
        return;
    }

    if (selected === correct) {
        correctCount++;
        button.classList.add("correct-answer");
    } else {
        wrongCount++;
        incorrectAnswers.push({
            question: questions[currentQuestionIndex].question_es,
            selected: selected,
            correct: correct,
            selectedText: questions[currentQuestionIndex].options_es[selected],
            correctText: questions[currentQuestionIndex].options_es[correct]
        });
        button.classList.add("wrong-answer");
    }

    correctCountElement.textContent = correctCount;
    wrongCountElement.textContent = wrongCount;

    setTimeout(() => {
        button.classList.remove("correct-answer", "wrong-answer");
        currentQuestionIndex++;
        showQuestion();
    }, 500);
}

function showResults() {
    const quizContainer = document.getElementById("quiz-container");
    quizContainer.innerHTML = "<h2>Test Completed! / ¡Examen completado!</h2>";

    if (incorrectAnswers.length === 0) {
        quizContainer.innerHTML += "<p>Congratulations! You answered all questions correctly. / ¡Felicidades! Respondiste todas las preguntas correctamente.</p>";
    } else {
        quizContainer.innerHTML += "<p>Here are the questions you got wrong: / Aquí están las preguntas que respondiste incorrectamente:</p>";

        incorrectAnswers.forEach(q => {
            quizContainer.innerHTML += `
                <p><strong>${q.question}</strong></p>
                <p>Your answer: <span style="color:red;"><strong>${q.selected}</strong> - ${q.selectedText}</span></p>
                <p>Correct answer: <span style="color:green;"><strong>${q.correct}</strong> - ${q.correctText}</span></p>
                <hr>
            `;
        });
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const translateBtn = document.getElementById("translate-btn");
    if (translateBtn) {
        translateBtn.addEventListener("click", toggleTranslation);
    }
});
