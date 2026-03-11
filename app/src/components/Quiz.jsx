import { useState } from "react";



const questions = [
    {
        key: "q1",
        text: "1. What month did Ambika and Sahil officially start dating?",
        options: [{ val: "a", label: "A) May" }, { val: "b", label: "B) July" }, { val: "c", label: "C) September" }, { val: "d", label: "D) December" }]
    },
    {
        key: "q2",
        text: "2. Where did they go on their first date?",
        options: [{ val: "a", label: "A) Topgolf" }, { val: "b", label: "B) Starbucks" }, { val: "c", label: "C) Pinstripes" }, { val: "d", label: "D) A movie theater" }]
    },
    {
        key: "q3",
        text: "3. What airline does Sahil take most often to Detroit?",
        options: [{ val: "a", label: "A) Delta" }, { val: "b", label: "B) United" }, { val: "c", label: "C) American" }, { val: "d", label: "D) Spirit" }]
    },
    {
        key: "q7",
        text: "4. What usually determined their weekend plans during long distance?",
        options: [{ val: "a", label: "A) The weather" }, { val: "b", label: "B) Restaurant reservations" }, { val: "c", label: "C) Ambika's exam schedule" }, { val: "d", label: "D) Flight prices" }]
    },
    {
        key: "q11",
        text: '5. Who said "I love you" first?',
        options: [{ val: "a", label: "A) Ambika" }, { val: "b", label: "B) Sahil" }, { val: "c", label: "C) They said it at the same time" }, { val: "d", label: "D) They still haven't" }]
    },
];



const Quiz = () => {
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [qIdx, setQIdx] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (Object.keys(answers).length !== questions.length) {
            setResult({ type: "incomplete" });
            return;
        }
        let numCorrect = 0;
        if (answers?.q1 === 'b') numCorrect++;
        if (answers?.q2 === 'c') numCorrect++;
        if (answers?.q3 === 'd') numCorrect++;
        if (answers?.q7 === 'c') numCorrect++;
        if (answers?.q11 === 'b') numCorrect++;

        setResult({ type: numCorrect / 5 >= 0.5 ? "pass" : "fail", score: numCorrect });
        setAnswers({});
    };

    const onAnswerChange = (question, answer) => {
        setAnswers(prev => ({ ...prev, [question]: answer }));
    };

    return (
        <div className="min-h-full bg-[#faf0e6] py-14 px-4 overflow-x-hidden">
            <div className="text-center mb-16">
                <h1 className="font-prata text-5xl md:text-6xl text-[#4a4a4a] mb-4">How Well Do You Know Us?</h1>
                <div className="flex items-center justify-center gap-4 mb-2">
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                    <span className="text-[#991D00] text-2xl md:text-3xl">♥</span>
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                </div>
                <p className="text-[#6b5c4e] font-prata font-light tracking-wide md:text-lg">Answer the following questions to see!</p>
            </div>

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-7.5">
                <div className="bg-[#f3ede3] border border-[#d9ccc0] rounded-sm p-4 md:p-5 shadow-sm">
                    <div key={questions[qIdx].key}>
                        <p className="font-prata text-[#4a4a4a] text-lg mb-5">{questions[qIdx].text}</p>
                        <div className="space-y-3">
                            {questions[qIdx].options.map((opt) => (
                                <label
                                    key={opt.val}
                                    className={`flex items-center gap-4 px-5 py-3 cursor-pointer border transition-all duration-200 rounded-sm ${
                                        answers[questions[qIdx].key] === opt.val
                                            ? "border-[#991D00] bg-[#fff0eb] text-[#691700]"
                                            : "border-[#d9ccc0] bg-white text-[#4a4a4a] hover:border-[#991D00] hover:bg-[#fff8f5]"
                                    }`}
                                >
                                    <input
                                        type="radio"
                                        name={questions[qIdx].key}
                                        value={opt.val}
                                        checked={answers[questions[qIdx].key] === opt.val}
                                        onChange={() => onAnswerChange(questions[qIdx].key, opt.val)}
                                        className="hidden"
                                    />
                                    <span className="font-light tex-sm md:text-md font-prata tracking-wide">{opt.label}</span>
                                </label>
                            ))}
                        </div>

                        {qIdx !== questions.length - 1 && (
                            <div className="flex justify-between mt-6 px-4">
                                {qIdx !== 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => setQIdx(qIdx - 1)}
                                        className="px-6 py-2 border border-[#691700] text-[#691700] font-prata font-light tracking-widest uppercase text-sm hover:bg-[#691700] hover:text-white transition-all duration-300 rounded-md"
                                    >
                                        Back
                                    </button>
                                ) : <div />}
                                <button
                                    type="button"
                                    onClick={() => setQIdx(qIdx + 1)}
                                    className="px-6 py-2 border border-[#691700] text-[#691700] font-prata font-light tracking-widest uppercase text-sm hover:bg-[#691700] hover:text-white transition-all duration-300 rounded-md"
                                >
                                    Next
                                </button>
                            </div>
                        )}

                        {qIdx === questions.length - 1 && (
                            <div className="flex justify-between mt-6 px-4">
                                <button
                                    type="button"
                                    onClick={() => setQIdx(qIdx - 1)}
                                    className="px-6 py-2 border border-[#691700] text-[#691700] font-prata font-light tracking-widest uppercase text-sm hover:bg-[#691700] hover:text-white transition-all duration-300 rounded-md"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 border border-[#691700] text-[#691700] font-prata font-light tracking-widest uppercase text-sm hover:bg-[#691700] hover:text-white transition-all duration-300 rounded-md"
                                >
                                    Submit
                                </button>
                            </div>
                        )}

                        {result && (
                            <div className={`max-w-lg mx-auto mt-5 px-1.5 py-2 md:px-4 md:py-2 text-center border rounded-sm tracking-wide font-light font-prata text-md md:text-lg ${
                                result.type === "incomplete"
                                    ? "border-[#991D00] text-[#991D00] bg-[#fff5f0]"
                                    : result.type === "pass"
                                    ? "border-[#4a7c59] bg-[#f0f7f3]"
                                    : "border-[#991D00] bg-[#fff5f0]"
                            }`}>
                                {result.type === "incomplete" && "Please answer all questions before submitting."}
                                {result.type === "pass" && (
                                    <>
                                        CONGRATS YOU PASSED!<br />
                                        You scored a {result.score}/5<span className="text-[#991D00]">♥</span>
                                    </>
                                )}
                                {result.type === "fail" && (
                                <>
                                    You scored a {result.score}/5<br />
                                    Much for you to learn before the wedding...
                                </>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Quiz;