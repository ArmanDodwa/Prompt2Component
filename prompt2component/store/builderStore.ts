import { create } from "zustand";
import { INITIAL_CODE } from "@/components/builder/InitialCode";
import { GeneratedComponentState } from "@/types/component.types";
import * as parser from "@babel/parser";
import traverse from "@babel/traverse";
import generate from "@babel/generator";
import * as t from "@babel/types";

export interface SelectedElementData {
  id?: string;
  tagName: string;
  className: string;
  text: string;
  rect: DOMRect;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: string;
  textColor?: string;
  marginBottom?: number;
}

interface BuilderState {
  code: string;
  draftCode: string; // Temporary code for live preview
  deviceMode: "desktop" | "tablet" | "mobile";
  viewMode: "visual" | "preview" | "code";
  isLoading: boolean;
  isSidebarOpen: boolean;
  selectedElement: SelectedElementData | null;
  componentMeta: Partial<GeneratedComponentState>;

  // Actions
  setCode: (code: string) => void;
  setDraftCode: (code: string) => void;
  commitDraftCode: () => void;
  setDeviceMode: (mode: "desktop" | "tablet" | "mobile") => void;
  setViewMode: (mode: "visual" | "preview" | "code") => void;
  setIsLoading: (loading: boolean) => void;
  setIsSidebarOpen: (open: boolean | ((prev: boolean) => boolean)) => void;
  setSelectedElement: (element: SelectedElementData | null) => void;
  setComponentMeta: (meta: Partial<GeneratedComponentState>) => void;
  updateElementProperties: (properties: Partial<SelectedElementData>) => void;
}

// Helper function to update Tailwind classes inside the JSX AST
// Helper function to update JSX text content inside the AST
function updateASTText(codeString: string, tagName: string, newText: string) {
  try {
    const ast = parser.parse(codeString, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });

    traverse(ast, {
      JSXElement(path) {
        if (
          path.node.openingElement.name.type === "JSXIdentifier" &&
          path.node.openingElement.name.name.toLowerCase() === tagName.toLowerCase()
        ) {
          // Replace children with a new JSXText node
          path.node.children = [t.jsxText(newText)];
          path.stop(); // Stop after finding the first matching element
        }
      },
    });

    const output = generate(ast, {}, codeString);
    return output.code;
  } catch (e) {
    console.error("AST text modification failed:", e);
    return codeString;
  }
}

export const useBuilderStore = create<BuilderState>((set, get) => ({
  code: INITIAL_CODE,
  draftCode: INITIAL_CODE, // Initialized as mirror of main code
  deviceMode: "desktop",
  viewMode: "visual",
  isLoading: false,
  isSidebarOpen: false,
  selectedElement: null,
  componentMeta: {
    fileName: "WelcomeCard.jsx",
    isValid: true,
    iterationCount: 0,
    explanation: "",
  },

  setCode: (code) => set({ code, draftCode: code }),
  setDraftCode: (draftCode) => set({ draftCode }),
  commitDraftCode: () => set((state) => ({ code: state.draftCode })),
  
  setDeviceMode: (deviceMode) => set({ deviceMode }),
  setViewMode: (viewMode) => set({ viewMode }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsSidebarOpen: (updater) =>
    set((state) => ({
      isSidebarOpen: typeof updater === "function" ? updater(state.isSidebarOpen) : updater,
    })),
  setSelectedElement: (selectedElement) => set({ selectedElement }),
  setComponentMeta: (meta) =>
    set((state) => ({
      componentMeta: { ...state.componentMeta, ...meta },
    })),
    
 updateElementProperties: (properties) =>
    set((state) => {
      if (!state.selectedElement) return state;

      const updatedElement = { ...state.selectedElement, ...properties };
      let newDraftCode = state.draftCode;

      // 1. Handle Text Content Update
      if (properties.text !== undefined) {
        console.log("Updating text content in AST to:", properties.text);
        newDraftCode = updateASTText(newDraftCode, updatedElement.tagName, properties.text);
      }

      // 2. Handle Tailwind Class/Style Properties
      const activeClasses = {
        fontSize: properties.fontSize !== undefined ? properties.fontSize : updatedElement.fontSize,
        fontWeight: properties.fontWeight !== undefined ? properties.fontWeight : updatedElement.fontWeight,
        textAlign: properties.textAlign !== undefined ? properties.textAlign : updatedElement.textAlign,
        textColor: properties.textColor !== undefined ? properties.textColor : updatedElement.textColor,
        marginBottom: properties.marginBottom !== undefined ? properties.marginBottom : updatedElement.marginBottom,
      };

      const hasStyleChanges = Object.values(activeClasses).some((val) => val !== undefined);

      if (hasStyleChanges) {
        newDraftCode = updateASTClasses(
          newDraftCode, 
          updatedElement.tagName, 
          activeClasses
        );
      }

      return {
        selectedElement: updatedElement,
        draftCode: newDraftCode,
      };
    }),
}));