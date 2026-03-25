import { useState, useEffect } from "react";
import { db, auth } from "../firebase_config"
import { collection, addDoc, getDocs } from "firebase/firestore";
import { signInAnonymously } from 'firebase/auth';


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
        key: "q4",
        text: "4. What usually determined their weekend plans during long distance?",
        options: [{ val: "a", label: "A) The weather" }, { val: "b", label: "B) Restaurant reservations" }, { val: "c", label: "C) Ambika's exam schedule" }, { val: "d", label: "D) Flight prices" }]
    },
    {
        key: "q5",
        text: '5. Who said "I love you" first?',
        options: [{ val: "a", label: "A) Ambika" }, { val: "b", label: "B) Sahil" }, { val: "c", label: "C) They said it at the same time" }, { val: "d", label: "D) They still haven't" }]
    },
    {
        key: "q6",
        text: '6. What song does Sahil famously dance to?',
        options: [{ val: "a", label: "A) Saki saki" }, { val: "b", label: "B) Headlines" }, { val: "c", label: "C) Desi Girl" }, { val: "d", label: "D) Hips Don't Lie" }]
    },
    {
        key: "q7",
        text: '7. Who is more likely to fall asleep during a movie?',
        options: [{ val: "a", label: "A) Sahil" }, { val: "b", label: "B) Ambika" }]
    },
    {
        key: "q8",
        text: '8. Where was their original wedding location supposed to be?',
        options: [{ val: "a", label: "A) Portugal" }, { val: "b", label: "B) San Diego" }, { val: "c", label: "C) Cancun" }, { val: "d", label: "D) Napa Valley" }]
    },
    {
        key: "q9",
        text: '9. Who is more likely to sleep through their alarm?',
        options: [{ val: "a", label: "A) Sahil" }, { val: "b", label: "B) Ambika" }]
    },
    {
        key: "q10",
        text: '10. What is their favorite fast food spot?',
        options: [{ val: "a", label: "A) McDonald's" }, { val: "b", label: "B) Taco Bell" }, { val: "c", label: "C) Jimmy John's" }, { val: "d", label: "D) Burger King" }]
    },
    {
        key: "q11",
        text: '11. What is their favorite cocktail bar?',
        options: [{ val: "a", label: "A) Pearl Club, Chicago" }, { val: "b", label: "B) Obvio Manhattan, NYC" }, { val: "c", label: "C) Candy Bar, Detroit MI" }, { val: "d", label: "D) The Aviary, Chicago" }]
    },
    {
        key: "q12",
        text: '12. How many dogs do they want?',
        options: [{ val: "a", label: "A) 1" }, { val: "b", label: "B) 3" }, { val: "c", label: "C) 2" }, { val: "d", label: "D) 0" }]
    }
];


const Toast = ({ result, onClose }) => {
    useEffect(() => {
        if (!result) return;
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [result, onClose]);

    if (!result) {
        return null;
    }
    const isIncomplete = result.type === "incomplete";
    const isPass = result.type === "pass";

    return (
        <div className="fixed inset-x-0 top-24 flex justify-center z-50 pointer-events-none">
            <div
                className={`pointer-events-auto mx-4 max-w-sm w-full px-6 py-5 rounded-md shadow-xl border text-center
                    animate-[fadeSlideIn_0.3s_ease_forwards]
                    ${isIncomplete
                        ? "bg-white border-[#991D00] text-[#991D00]"
                        : isPass
                        ? "bg-white border-[#4a7c59] text-[#4a7c59]"
                        : "bg-white border-[#991D00] text-[#4a4a4a]"
                    }`}
                style={{ animation: "fadeSlideIn 0.3s ease forwards" }}
            >
                {isIncomplete && (
                    <p className="font-prata text-base tracking-wide">
                        Please answer all questions before submitting.
                    </p>
                )}
                {isPass && (
                    <>
                        <p className="font-prata text-xl tracking-wide mb-1">CONGRATS YOU PASSED!</p>
                        <p className="font-prata text-base tracking-wide">
                            You scored a {result.score}/{questions.length} <span className="text-[#991D00]">♥</span>
                        </p>
                    </>
                )}
                {result.type === "fail" && (
                    <>
                        <p className="font-prata text-xl tracking-wide mb-1">
                            You scored a {result.score}/{questions.length}
                        </p>
                        <p className="font-prata text-sm tracking-wide text-[#6b5c4e]">
                            Much for you to learn before the wedding...
                        </p>
                    </>
                )}

                <button
                    onClick={onClose}
                    className="mt-4 text-xs font-prata tracking-widest uppercase text-[#b0a090] hover:text-[#691700] transition-colors duration-200 cursor-pointer"
                >
                    Dismiss
                </button>
            </div>

            <style>{`
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateY(-12px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0)   scale(1);    }
                }
            `}</style>
        </div>
    );
};


const Quiz = () => {
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [qIdx, setQIdx] = useState(0);
    const [showQuiz, setShowQuiz] = useState(false);
    const [name, setName] = useState('');
    const [docs, setDocs] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (Object.keys(answers).length !== questions.length) {
            setResult({ type: "incomplete" });
            return;
        }
        let numCorrect = 0;
        if (answers?.q1 === 'b') numCorrect++;
        if (answers?.q2 === 'c') numCorrect++;
        if (answers?.q3 === 'd') numCorrect++;
        if (answers?.q4 === 'c') numCorrect++;
        if (answers?.q5 === 'b') numCorrect++;
        if (answers?.q6 === 'a') numCorrect++;
        if (answers?.q7 === 'b') numCorrect++;
        if (answers?.q8 === 'd') numCorrect++;
        if (answers?.q9 === 'a') numCorrect++;
        if (answers?.q10 === 'b') numCorrect++;
        if (answers?.q11 === 'c') numCorrect++;
        if (answers?.q12 === 'c') numCorrect++;

        setResult({ type: numCorrect / questions.length >= 0.5 ? "pass" : "fail", score: numCorrect });
        await addDoc(collection(db, 'quizleaderboard'), {
            name: name,
            numCorrect: numCorrect
        });
        const querySnapshot = await getDocs(collection(db, "quizleaderboard"));
        setDocs(querySnapshot.docs);
        setShowQuiz(false)
        setName('')
        setAnswers({});
    };

    useEffect(() => {
        signInAnonymously(auth)
            .catch(err => console.error('Auth error:', err))
            .finally();
        const fetchDocs = async () => {
            const querySnapshot = await getDocs(collection(db, "quizleaderboard"));
            setDocs(querySnapshot.docs)
        };
        fetchDocs();
    }, []);

    const onAnswerChange = (question, answer) => {
        setAnswers(prev => ({ ...prev, [question]: answer }));
    };

    const onNameChange = (e) => {
        setName(e.target.value);
    };

    const rankedDocs = [...docs]
        .sort((a, b) => b.data().numCorrect - a.data().numCorrect)
        .map((doc, idx, arr) => {
            const rank = idx === 0 ? 1 :
                arr[idx - 1].data().numCorrect === doc.data().numCorrect
                    ? null
                    : idx + 1;
            return { doc, rank };
        });

    let lastRank = 1;
    rankedDocs.forEach((entry, idx) => {
        if (idx === 0) { entry.rank = 1; return; }
        if (entry.doc.data().numCorrect === rankedDocs[idx - 1].doc.data().numCorrect) {
            entry.rank = lastRank;
        } else {
            entry.rank = idx + 1;
            lastRank = idx + 1;
        }
    });

    return (
        <div className="min-h-full bg-[#faf0e6] py-14 px-4 overflow-x-hidden">
            <Toast result={result} onClose={() => setResult(null)} />

            <div className="text-center mb-16">
                <h1 className="font-prata text-5xl md:text-6xl text-[#4a4a4a] mb-4">How Well Do You Know Us?</h1>
                <div className="flex items-center justify-center gap-4 mb-2">
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                    <span className="text-[#991D00] text-2xl md:text-3xl">♥</span>
                    <span className="h-px w-12 md:w-16 bg-[#691700]"></span>
                </div>
                <p className="text-[#6b5c4e] font-prata font-light tracking-wide md:text-lg">Answer the following questions to see!</p>
            </div>

            {(
                <div className="max-w-2xl mx-auto mb-18">
                    <div className="text-center mb-3">
                        <h2 className="font-prata text-3xl md:text-4xl text-[#4a4a4a] mb-3">Leaderboard</h2>
                    </div>
                    <div className="bg-[#f3ede3] border border-[#d9ccc0] rounded-sm shadow-sm overflow-hidden">
                        {rankedDocs.map(({ doc, rank }, idx) => (
                            <div
                                key={doc.id}
                                className={`flex items-center gap-4 px-5 py-4 border-b border-[#d9ccc0] last:border-b-0 ${
                                    idx % 2 === 0 ? "bg-[#f3ede3]" : "bg-[#ede7db]"
                                }`}
                            >
                                <span className={`font-prata text-lg w-8 text-center ${
                                    rank === 1 ? "text-[#b8860b]" : "text-[#6b5c4e]"
                                }`}>
                                    {rank === 1 ? "♛" : `#${rank}`}
                                </span>
                                <span className="font-prata text-[#4a4a4a] flex-1">{doc.data().name}</span>
                                <span className="font-prata text-[#991D00] text-sm md:text-md">
                                    {doc.data().numCorrect}/{questions.length}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-7.5">
                <div className="text-center mb-3">
                    <h2 className="font-prata text-3xl md:text-4xl text-[#4a4a4a] mb-3">Questions</h2>
                </div>
                <div className="bg-[#f3ede3] border border-[#d9ccc0] rounded-sm p-4 md:p-5 shadow-sm">
                    {!showQuiz &&
                    <div className="flex flex-col items-center gap-6">
                        <div className="flex flex-col gap-2 w-full max-w-sm ,t">
                            <label className="font-prata text-[#4a4a4a] text-lg tracking-wide">Enter Your Name</label>
                            <input
                                type="text"
                                onChange={onNameChange}
                                placeholder="Enter Your Name..."
                                value={name}
                                className="w-full px-4 py-3 border border-[#d9ccc0] bg-white rounded-sm font-prata text-[#4a4a4a] placeholder-[#b0a090] focus:outline-none focus:border-[#991D00] transition-colors duration-200"
                            />
                        </div>
                        <button
                            type="button"
                            onClick={() => setShowQuiz(true)}
                            className="px-6 py-2 border border-[#691700] text-[#691700] font-prata font-light tracking-widest uppercase text-sm hover:bg-[#691700] hover:text-white transition-all duration-300 rounded-md cursor-pointer"
                        >
                            Next
                        </button>
                    </div>}
                    {showQuiz &&
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
                                    <span className="font-light text-sm md:text-md font-prata tracking-wide">{opt.label}</span>
                                </label>
                            ))}
                        </div>

                        {qIdx !== questions.length - 1 && (
                            <div className="flex justify-between mt-6 px-4">
                                {qIdx !== 0 ? (
                                    <button
                                        type="button"
                                        onClick={() => setQIdx(qIdx - 1)}
                                        className="px-6 py-2 border border-[#691700] text-[#691700] font-prata font-light tracking-widest uppercase text-sm hover:bg-[#691700] hover:text-white transition-all duration-300 rounded-md cursor-pointer"
                                    >
                                        Back
                                    </button>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setShowQuiz(false)}
                                        className="px-6 py-2 border border-[#691700] text-[#691700] font-prata font-light tracking-widest uppercase text-sm hover:bg-[#691700] hover:text-white transition-all duration-300 rounded-md cursor-pointer"
                                    >
                                        Back
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => setQIdx(qIdx + 1)}
                                    className="px-6 py-2 border border-[#691700] text-[#691700] font-prata font-light tracking-widest uppercase text-sm hover:bg-[#691700] hover:text-white transition-all duration-300 rounded-md cursor-pointer"
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
                                    className="px-6 py-2 border border-[#691700] text-[#691700] font-prata font-light tracking-widest uppercase text-sm hover:bg-[#691700] hover:text-white transition-all duration-300 rounded-md cursor-pointer"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 border border-[#691700] text-[#691700] font-prata font-light tracking-widest uppercase text-sm hover:bg-[#691700] hover:text-white transition-all duration-300 rounded-md cursor-pointer"
                                >
                                    Submit
                                </button>
                            </div>
                        )}
                    </div>}
                </div>
            </form>
        </div>
    );
};

export default Quiz;