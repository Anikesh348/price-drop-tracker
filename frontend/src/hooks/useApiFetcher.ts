import { useEffect, useCallback, useState } from "react";

interface ApiFetcherState {
  loading: boolean;
  data: any;
  error: string | null;
}

export const useApiFetcher = () => {
  const [state, setState] = useState(<ApiFetcherState>{
    loading: false,
    data: null,
    error: null,
  });

  const fetchData = useCallback(async (url: string, options?: RequestInit) => {
    setState((prev) => {
      return {
        ...prev,
        loading: true,
      };
    });
    try {
      console.log("calling url: ", url);
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorText = response.statusText;
        setState({
          loading: false,
          data: {
            body: null,
            status: response.status,
          },
          error: errorText,
        });
      } else {
        const data = await response.json();
        setState({
          loading: false,
          data: {
            body: data,
            status: response.status,
          },
          error: null,
        });
      }
    } catch (err: any) {
      setState({
        loading: false,
        data: {
          body: null,
          status: 500,
        },
        error: err.message || "error",
      });
    }
  }, []);

  return {
    ...state,
    fetchData,
  };
};
