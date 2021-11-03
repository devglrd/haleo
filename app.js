const data = [
    {
        "completedAt": "2021-09-14T14:00:00+00:00",
        "label": "Screener",
        "questions": [
            {"id": 1, "label": "RLS Risk"},
            {"id": 3, "label": "Caffeine"},
            {"id": 4, "label": "Alcohol"}
        ],
        "answers": [
            {"questionId": 1, "value": "highRisk"},
            {"questionId": 3, "value": "always"},
            {"questionId": 4, "value": "sometimes"}
        ]
    },
    {
        "completedAt": "2021-09-30T08:00:00+00:00",
        "label": "Therapy questionnaire",
        "questions": [
            {"id": 2, "label": "SWSD Risk"},
            {"id": 3, "label": "Caffeine"},
            {"id": 4, "label": "Alcohol"}
        ],
        "answers": [
            {"questionId": 2, "value": "lowRisk"},
            {"questionId": 3, "value": "always"},
            {"questionId": 4, "value": "never"}
        ]
    }
];

const HIGH_RISK = "highRisk";
const SOMETIMES = "sometimes";
const ALWAYS = "always";

// ARRAY IS THE ARRAY WITH DATA FORMATED
const array = []
// IDQUESTION IS A ARRAY OF IDQUESTION
const idQuestion = [];
// TAB IS TEMPORY ARRAY
const tab = [];
// UNIQUE AFTER IS THE ARRAY WHICH HAVE ONLY UNIQUE ANSWER
let uniqueAfter = [];

// MAKE UNIQUE QUESTION
const questions = data.map((item) => item.questions).flat();
const uniques = [...new Map(questions.map(question => [question['id'], question])).values()];


data.forEach((survey) => {
    // TRANSFORM DATA TO A OBJECT
    survey.answers.forEach((answer, index) => {
        array.push({
            // id: index + 1,
            value: answer.value,
            date: survey.completedAt,
            question: answer.questionId
        })

    });
})


array.map((e, index) => {
    // CHECK IF TAB TEMPORY ARRAY CONTAINS THE CONCERNE QUESTION
    if (tab.includes(e.question)) {
        // IF IS INSIDE SO WE HAVE DOUBLON QUESTION WE DETERMINED WO IS THE MORE RECENT ANSWER
        const index = tab.findIndex(item => item === e.question);
        const already = array[index];
        if (new Date(already.date) < new Date(e.date)) {
            // WE PUSH IF ANSWER IS MORE RECENT
            uniqueAfter.push(e);
        }
    }
    tab.push(e.question)

    // WE RETURN ALL FOR ADDED TO THE UNIQUE AFTER ARRAY AFTER
    return e;
}).forEach((item) => {
    const has = uniqueAfter.filter((unique) => {
        return unique.question === item.question;
    });
    // PUSH THE ENTRY OF DATA OF NOT ALREADY INSIDE THE UNIQUE AFTER ARRAY (DEPENDS BY QUESTION ID)
    if (!has.length) uniqueAfter.push(item)
});


uniqueAfter = uniqueAfter.map((item) => {
    // ADD THE LABEL QUESTION INSIDE THE UNIQUE AFTER ARRAY
    const question = questions.find(e => e.id === item.question);
    return {
        ...item,
        questionLabel: question.label
    }
})


uniques.forEach((question, index) => {
    // GET THE ANSWER BY THE QUESTION ID
    const answer = uniqueAfter.find(answer => question.id === answer.question);
    // GET THE RISK OF THE ANSWER
    const isRisk = getRisk(question, answer);
    const classStyle = 'rounded-span ' + (isRisk ? ' selected' : '');
    // SET THE HTML INTO CONTENT DIV
    document.getElementById('content').innerHTML += "<span class='" + classStyle + "'>" + question.label + "</span>";
});


function getRisk(question, answer) {
    if (answer.value === HIGH_RISK || answer.value == SOMETIMES || answer.value === ALWAYS) return true;
    return false;
}
