import React, { createContext, useContext, useReducer, ReactNode } from "react";
import { EditorJSData } from "@/services/form";

interface FormState {
  editorData: EditorJSData;
}

type FormAction = {
  type: "SET_FORM_DATA";
  payload: EditorJSData;
};

const FormContext = createContext<
  { state: FormState; dispatch: React.Dispatch<FormAction> } | undefined
>(undefined);

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FORM_DATA":
      return { ...state, editorData: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, {
    editorData: { title: "", blocks: [], workspaceId: "" },
  });

  return <FormContext.Provider value={{ state, dispatch }}>{children}</FormContext.Provider>;
}

export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
