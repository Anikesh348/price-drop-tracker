const BASE_URL = import.meta.env.VITE_BASE_BACKEND_URL;

export const LeetCodeService = {
  addQuestions: (questionUrls: string[]) => {
    return {
      url: `${BASE_URL}/api/protected/leetcode/add`,
      options: {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ questionUrls }),
      },
    };
  },

  getQuestions: () => {
    return {
      url: `${BASE_URL}/api/protected/leetcode/questions`,
      options: {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      },
    };
  },

  deleteQuestion: (questionId: string) => {
    return {
      url: `${BASE_URL}/api/protected/leetcode/delete`,
      options: {
        method: "POST", // use DELETE if backend supports
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ questionId }),
      },
    };
  },

  updateQuestionStatus: (questionId: string, status: string) => {
    return {
      url: `${BASE_URL}/api/protected/leetcode/update-status`,
      options: {
        method: "POST", // or PATCH if backend supports
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          questionId,
          status,
        }),
      },
    };
  },
  updateQuestionNotes: (questionId: string, notes: string) => {
    return {
      url: `${BASE_URL}/api/protected/leetcode/update-notes`,
      options: {
        method: "POST", // or PATCH if backend supports
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({
          questionId,
          notes,
        }),
      },
    };
  },
};
