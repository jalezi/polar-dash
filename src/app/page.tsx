import { Question } from "@/types/question.types";

const DB_URL = process.env.DB_URL;

const getQuestions = async () => {
  let result: Question[] | null= null;
  let error = null;

  const response = await fetch(DB_URL + '/questions');
  if (!response.ok) {
    error = response.statusText;
    return { result, error }
  }

  result = await response.json() as Question[];
  return { result, error}

}

export default async function Home() {

  const {result : questions, error} = await getQuestions()

  const randomQuestion = questions?.[ Math.floor(Math.random() * questions.length) ]

  const options = randomQuestion?.correct_answer
    ? [ ...randomQuestion?.incorrect_answers || [] ].concat(randomQuestion?.correct_answer).sort(() => Math.random() - 0.5)
    : undefined



  return (
    <main className="background--secondary min-h-screen flex flex-col justify-center items-center gap-2">
      <div className="background--tertiary max-w-lg p-16">
        <h1 className="color--on-tertiary">PolarDash</h1>
        <div>
          {randomQuestion ? <p className="color--on-tertiary">{randomQuestion.question}</p> : undefined}

          {options ?
              <ol className="bg-slate-100 list-decimal  pl-6 pr-2 py-1 flex flex-col gap-2">
                {options.map(option => <li>{option}</li>)}
              </ol>
            : undefined}

          {error ? <p className="color--on-tertiary">{error}</p> : undefined}
        </div>
      </div>
    </main>
  );
}
