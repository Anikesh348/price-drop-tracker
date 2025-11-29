import React, { useState, useEffect, useRef } from "react";
import { LeetCodeService } from "../apis/question/question";
import { useApiFetcher } from "../hooks/useApiFetcher";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Filters from "./Filters";
import { Loader } from "./Loader";

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

  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<string>("");

  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [solvedFilter, setSolvedFilter] = useState<string>("all");
  const [tagsOptions, setTagsOptions] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");

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
  const { data: updateNotesData, fetchData: updateNotesApi } = useApiFetcher();
  const {
    loading: applyingTags,
    data: applyTagsData,
    fetchData: applyTagsApi,
  } = useApiFetcher();

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
          notes: q?.notes || "",
        }));
        setQuestions(normalized);
      } else if (body.success) {
        const normalized = (body.questions || []).map((q: any) => ({
          ...q,
          questionId: q?.questionId ?? q?._id,
          status: q?.status || "unsolved",
          notes: q?.notes || "",
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

  // Notes handlers
  const handleSaveNotes = (questionId: string) => {
    const { url, options } = LeetCodeService.updateQuestionNotes(
      questionId,
      notesDraft
    );
    updateNotesApi(url, options);
  };

  useEffect(() => {
    if (updateNotesData?.status === 200) {
      fetchQuestions();
      setEditingNotesId(null);
      setNotesDraft("");
    }
  }, [updateNotesData]);

  // derive tags options from questions
  useEffect(() => {
    const tagsSet = new Set<string>();
    questions.forEach((q) => {
      (q.tags || []).forEach((t: string) => tagsSet.add(t));
    });
    setTagsOptions(Array.from(tagsSet));
  }, [questions]);

  // Track applied tags and operation for UI
  const [appliedTags, setAppliedTags] = useState<string[]>([]);
  const [appliedOperation, setAppliedOperation] = useState<
    "union" | "intersection" | null
  >(null);
  const [tagsModalKey, setTagsModalKey] = useState(0); // for forcing modal reset

  // Modified tags filter handler to update UI state
  const handleTagsFilter = (
    tags: string[],
    operation: "union" | "intersection"
  ) => {
    setAppliedTags(tags);
    setAppliedOperation(tags.length > 0 ? operation : null);
    const { url, options } = LeetCodeService.getQuestions(tags, operation);
    fetchQuestionsApi(url, options);
  };

  // Reset tags filter
  const handleResetTags = () => {
    setAppliedTags([]);
    setAppliedOperation(null);
    setTagsModalKey((k) => k + 1); // force modal to reset
    fetchQuestions();
  };

  useEffect(() => {
    if (applyTagsData?.status === 200) {
      fetchQuestions();
    }
  }, [applyTagsData]);

  // Filtered questions for display (UI-level for difficulty and solved)
  const filteredQuestions = questions.filter((q) => {
    if (difficultyFilter !== "all") {
      if (!q.difficulty) return false;
      if (q.difficulty.toLowerCase() !== difficultyFilter.toLowerCase())
        return false;
    }
    if (solvedFilter !== "all") {
      const isSolved = q.status === "solved" || q.solved === true;
      if (solvedFilter === "solved" && !isSolved) return false;
      if (solvedFilter === "unsolved" && isSolved) return false;
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const titleMatch = q.title?.toLowerCase().includes(query);
      const numberMatch = q.number?.toString().includes(query);
      if (!titleMatch && !numberMatch) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen w-full landing-bg transition-colors duration-300">
      <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 lg:px-8 pt-24">
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight drop-shadow-lg">
            LeetCode Manager - Track & Manage Your Coding Practice
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Advanced LeetCode question tracker with note-taking, tagging, and
            progress tracking. Manage your LeetCode problems efficiently and
            prepare for technical interviews with our comprehensive question
            manager.
          </p>
        </header>

        {/* Add Question Section */}
        <div className="glass-card border border-gray-200 dark:border-gray-700 rounded-2xl p-8 mb-8 bg-gradient-to-br from-slate-50/50 to-blue-50/30 dark:from-slate-900/20 dark:to-blue-900/10 backdrop-blur-md">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-lg font-bold">
                +
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Add LeetCode Questions
              </h2>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 ml-13">
              Paste LeetCode question URLs to start tracking your practice
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <textarea
                className="w-full border-2 border-gray-300 dark:border-gray-600 rounded-xl p-4 resize-none bg-white dark:bg-gray-800/50 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-mono text-sm"
                rows={4}
                placeholder="Paste LeetCode URLs (comma or newline separated)&#10;Example: https://leetcode.com/problems/two-sum/&#10;Or paste multiple URLs, one per line"
                value={urls}
                onChange={(e) => setUrls(e.target.value)}
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 dark:text-gray-500">
                {urls.split(/\n|,/).filter((u) => u.trim().length > 0).length >
                  0 && (
                  <span>
                    {
                      urls.split(/\n|,/).filter((u) => u.trim().length > 0)
                        .length
                    }{" "}
                    URL(s)
                  </span>
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between">
              <div className="text-xs text-gray-500 dark:text-gray-400">
                💡 Tip: You can paste multiple URLs separated by commas or new
                lines
              </div>
              <button
                onClick={handleSubmit}
                disabled={addingQuestions || urls.trim().length === 0}
                className="sm:ml-auto py-3 px-8 rounded-xl text-white font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none transition-all duration-200 whitespace-nowrap flex items-center justify-center gap-2"
              >
                <span>✓</span>
                {addingQuestions ? "Submitting..." : "Submit Questions"}
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Filters
            difficulty={difficultyFilter}
            solved={solvedFilter}
            tagsOptions={tagsOptions}
            questions={questions}
            onDifficultyChange={(v) => setDifficultyFilter(v)}
            onSolvedChange={(v) => setSolvedFilter(v)}
            onApplyTags={handleTagsFilter}
            onSearchChange={setSearchQuery}
            searchQuery={searchQuery}
            applying={applyingTags}
            tagsModalKey={tagsModalKey}
          />
        </div>

        {/* Applied Tags Section */}
        {appliedTags.length > 0 && (
          <div className="glass-card border border-gray-200 dark:border-gray-700 rounded-2xl p-6 mb-8">
            <h2 className="text-lg font-bold mb-4 text-gray-900 dark:text-white flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Applied Filters
            </h2>
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-semibold text-gray-700 dark:text-gray-300">
                Tags:
              </span>
              {appliedTags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 text-blue-700 dark:text-blue-300 text-sm font-medium border border-blue-200 dark:border-blue-700"
                >
                  {tag}
                </span>
              ))}
              {appliedOperation && (
                <span className="px-3 py-1.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-300 dark:border-purple-700">
                  {appliedOperation === "union" ? "Union" : "Intersection"}
                </span>
              )}
              <button
                onClick={handleResetTags}
                className="ml-auto px-4 py-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 text-sm font-semibold transition-colors duration-200 border border-red-200 dark:border-red-800"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Questions Table */}
        <div className="glass-card border border-gray-200 dark:border-gray-700 rounded-2xl p-6 sm:p-8">
          <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
            Your Questions
          </h3>

          {loadingQuestions ? (
            <div className="flex justify-center items-center py-12">
              <Loader />
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                No questions added yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQuestions.map((q, idx) => (
                <div
                  key={q.questionId}
                  className="glass-card border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    {/* Left: Number & Question */}
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                      <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm">
                        {idx + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <a
                          href={q.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-base font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors break-words"
                        >
                          {q.title !== undefined && q.title !== ""
                            ? q.title
                            : q.url}
                        </a>
                        {q.notes && editingNotesId !== q.questionId && (
                          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 italic">
                            📝 {q.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Middle: Difficulty & Status */}
                    <div className="flex items-center gap-3 md:gap-4 flex-wrap md:flex-nowrap">
                      {q.difficulty && (
                        <div>
                          <span
                            className={`px-3 py-1.5 rounded-full text-xs font-bold inline-block
                              ${
                                q.difficulty.toLowerCase() === "easy"
                                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                                  : q.difficulty.toLowerCase() === "medium"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                                  : q.difficulty.toLowerCase() === "hard"
                                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                          >
                            {q.difficulty.charAt(0).toUpperCase() +
                              q.difficulty.slice(1)}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={q.status === "solved"}
                          onChange={() => toggleSolved(q.questionId)}
                          disabled={updatingQuestionId === q.questionId}
                          className="h-5 w-5 text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 dark:focus:ring-blue-400 cursor-pointer"
                        />
                        {updatingQuestionId === q.questionId && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Updating...
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex gap-2 justify-end flex-wrap md:flex-nowrap">
                      {editingNotesId === q.questionId ? (
                        <div className="w-full md:w-auto flex flex-col gap-2">
                          <textarea
                            value={notesDraft}
                            onChange={(e) => setNotesDraft(e.target.value)}
                            rows={2}
                            className="w-full md:w-48 border border-gray-300 dark:border-gray-600 rounded-lg p-2 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          />
                          <div className="flex gap-2 justify-end">
                            <button
                              onClick={() => handleSaveNotes(q.questionId)}
                              className="px-3 py-1.5 bg-gradient-to-r from-green-600 to-teal-600 hover:shadow-md text-white text-sm font-medium rounded-lg transition-all"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => {
                                setEditingNotesId(null);
                                setNotesDraft("");
                              }}
                              className="px-3 py-1.5 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingNotesId(q.questionId);
                              setNotesDraft(q.notes || "");
                            }}
                            className="px-4 py-1.5 bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300 text-sm font-medium rounded-lg transition-all"
                          >
                            📝 Notes
                          </button>
                          <button
                            onClick={() => handleDelete(q.questionId)}
                            disabled={deletingQuestionId === q.questionId}
                            className="px-4 py-1.5 bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium rounded-lg transition-all"
                          >
                            🗑️{" "}
                            {deletingQuestionId === q.questionId
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
