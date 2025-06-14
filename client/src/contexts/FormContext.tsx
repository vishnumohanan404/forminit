import React, { createContext, useContext, useReducer, ReactNode } from "react";

// Define the form data structure
interface FormState {
  editorData: any; // The editor data to store
}

// Define action types
type FormAction = {
  type: "SET_FORM_DATA";
  payload: any;
};

// Create the context
const FormContext = createContext<{ state: FormState; dispatch: React.Dispatch<FormAction> } | undefined>(undefined);

// Form reducer to manage the state
function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case "SET_FORM_DATA":
      return { ...state, editorData: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
}

// Provider component
export function FormProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(formReducer, { editorData: null });

  return (
    <FormContext.Provider value={{ state, dispatch }}>
      {children}
    </FormContext.Provider>
  );
}

// Custom hook to use the form context
export function useFormContext() {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
}
