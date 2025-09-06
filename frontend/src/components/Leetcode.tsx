import React, { useState, useEffect, useRef } from "react";
import { LeetCodeService } from "../apis/question/question";
import { useApiFetcher } from "../hooks/useApiFetcher";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Leetcode = () => {
  const { authToken, isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [urls, setUrls] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [updatingQuestionId, setUpdatingQuestionId] = useState<string | null>(
    null
  );
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(
    null
  );

  const fetchedRef = useRef(false);

  // Hooks for fetching, adding, updating, deleting questions
  const {
    loading: loadingQuestions,
    data: questionsData,
    error: fetchError,
    fetchData: fetchQuestionsApi,
  } = useApiFetcher();

  const {
    loading: addingQuestions,
    data: addData,
    fetchData: addQuestionsApi,
  } = useApiFetcher();

  const { data: updateData, fetchData: updateQuestionApi } = useApiFetcher();
  const { data: deleteData, fetchData: deleteQuestionApi } = useApiFetcher();

  // Fetch questions
  const fetchQuestions = () => {
    const { url, options } = LeetCodeService.getQuestions();
    fetchQuestionsApi(url, options);
  };

  useEffect(() => {
    if (isAuthLoading) return;

    if (!authToken) {
      navigate("/login");
      return;
    }

    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchQuestions();
  }, [authToken, isAuthLoading, navigate]);

  // Handle fetch results
  useEffect(() => {
    if (questionsData?.body) {
      const body = questionsData.body;
      if (Array.isArray(body)) {
        const normalized = body.map((q: any) => ({
          ...q,
          questionId: q?.questionId ?? q?._id,
          status: q?.status || "unsolved",
        }));
        setQuestions(normalized);
      } else if (body.success) {
        const normalized = (body.questions || []).map((q: any) => ({
          ...q,
          questionId: q?.questionId ?? q?._id,
          status: q?.status || "unsolved",
        }));
        setQuestions(normalized);
      }
    }
  }, [questionsData, fetchError]);

  // Handle adding questions
  const handleSubmit = () => {
    const urlList = urls
      .split(/\n|,/)
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    if (urlList.length === 0) return;

    const { url, options } = LeetCodeService.addQuestions(urlList);
    addQuestionsApi(url, options);
  };

  useEffect(() => {
    if (addData?.status === 200) {
      fetchQuestions(); // refetch updated list
      setUrls("");
    }
  }, [addData]);

  // Toggle solved/unsolved
  const toggleSolved = (questionId: string) => {
    setUpdatingQuestionId(questionId);

    const question = questions.find((q) => q.questionId === questionId);
    if (!question) return;

    const currentStatus = question.status || "unsolved";
    const newStatus = currentStatus === "solved" ? "unsolved" : "solved";

    const { url, options } = LeetCodeService.updateQuestionStatus(
      questionId,
      newStatus
    );
    updateQuestionApi(url, options);
  };

  useEffect(() => {
    if (updateData?.status === 200) {
      fetchQuestions();
      setUpdatingQuestionId(null);
    }
  }, [updateData]);

  // Delete question
  const handleDelete = (questionId: string) => {
    setDeletingQuestionId(questionId);
    const { url, options } = LeetCodeService.deleteQuestion(questionId);
    deleteQuestionApi(url, options);
  };

  useEffect(() => {
    if (deleteData?.status === 200) {
      fetchQuestions();
      setDeletingQuestionId(null);
    }
  }, [deleteData]);

  return (
    <div className="max-w-full sm:w-[90%] md:w-[70%] mx-auto space-y-6 min-h-screen p-4">
      {/* Add Question Section */}
      <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 space-y-4">
        <h2 className="text-lg sm:text-xl font-bold mb-2">
          Add LeetCode Questions
        </h2>
        <textarea
          className="w-full border rounded-lg p-2 resize-none"
          rows={3}
          placeholder="Paste LeetCode URLs (comma or newline separated)"
          value={urls}
          onChange={(e) => setUrls(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={addingQuestions}
          className="w-full py-2 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400"
        >
          {addingQuestions ? "Submitting..." : "Submit Questions"}
        </button>
      </div>

      {/* Questions Table */}
      <div className="bg-white shadow-md rounded-xl p-4 sm:p-6 overflow-x-auto">
        <h3 className="text-lg sm:text-xl font-semibold mb-3">
          Your Questions
        </h3>

        {loadingQuestions ? (
          <p className="text-gray-500 animate-pulse">Loading questions...</p>
        ) : questions.length === 0 ? (
          <p className="text-gray-500">No questions added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px] border-collapse border border-gray-300 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border p-2 text-left">Question</th>
                  <th className="border p-2 text-center">Solved</th>
                  <th className="border p-2 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {questions.map((q) => (
                  <tr key={q.questionId}>
                    <td className="border p-2 break-all">
                      <a
                        href={q.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {q.url}
                      </a>
                    </td>
                    <td className="border p-2 text-center">
                      <input
                        type="checkbox"
                        checked={q.status === "solved"}
                        onChange={() => toggleSolved(q.questionId)}
                        disabled={updatingQuestionId === q.questionId}
                        className="h-4 w-4"
                      />
                      {updatingQuestionId === q.questionId && (
                        <span className="ml-2 text-gray-500 text-xs">
                          Updating...
                        </span>
                      )}
                    </td>
                    <td className="border p-2 text-center">
                      <button
                        onClick={() => handleDelete(q.questionId)}
                        disabled={deletingQuestionId === q.questionId}
                        className="px-3 py-1 text-white bg-red-600 hover:bg-red-700 rounded-lg disabled:bg-gray-400"
                      >
                        {deletingQuestionId === q.questionId
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
