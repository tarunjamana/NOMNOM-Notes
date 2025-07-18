# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ["./tsconfig.node.json", "./tsconfig.app.json"],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from "eslint-plugin-react";

export default tseslint.config({
  // Set the react version
  settings: { react: { version: "18.3" } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs["jsx-runtime"].rules,
  },
});
```

## TypeScript content

## Types in typescript

-- let name: string; - string
-- let age: number; - number
-- let isPresent: boolean; - boolean
-- let hobbies: string[]; , numbers[] - arrays
-- let role:[number,string] - tuple

-- role = [5,'sdsdk']

let person: Object; - one way of object declaration but not standard way

type Person = {
name: string,
age?: number
}

adding question mark can make the property optional

let person: Person = {
name:'Dimple',
age: '50'
}

lets say we need to have a varaible which needs to contain array of person object

let lotsofPeople: Person[]

lets say we want a varaible to be both number and a string we use union |

- let age: number | string

function printName(name : string) {
console.log(name)
}

- Function Type

  - let printName: Function;

  - a better way to do it is
    let printName: (name:string) => void

- Any Value

  let name: any

  a better type than any is unknown

  let personName : unknown

- if we dont know if a function returns anyting or not we can use never
- difference between void and never void returns undefined and never doesnt return anything
  let printName: (name:string) => never

## Aliases (Type and Interface)

let person: Person = {
name:'Dimple',
age: '50'
}

interface Person = {
name:'Dimple',
age: '50'
}

## React functional components

const App : React.FC = () => {
return <div> Hello World </div>
}

export default App

## useState in TS

const [todo,setTodo] = useState<string | number>("")
const [todo,setTodo] = useState<string[]>("")

# PropTypes - passing Props to component

interface Props {
todo: string,

}

const InputField = ({todo,setTodo}) => {
return (

    <!-- Form JSX is returned here -->

)
}

## Reusable Interface

export interface Todo {
id:number;
todo: string;
isDone: boolean;  
}

import { Todo } from './model'

const [todos,setTodos] = useState<Todo[]>([])

- For event the type in TS in react context is React.FormEvent

  const handleAdd = (e: React.formEvent) => {
  e.preventDefault();
  }

- useRef in TS
  const inputRef = useRef<HTMLInputElement>(null);

  <input ref={inputRef} />

## Bugs Faced and Learnings

- for the multi step signup form which we are creating , we faced two issues

1. ❗ Errors show before touching fields
   Even without focusing or interacting with a field, an error appears below it — this is not ideal UX.

2. ❗ Errors from a different step show on unrelated steps
   For example, you're on Step 2, and suddenly a password error (from Step 5) is visible. This confuses users.

- Why this happens

  - Formik tracks all field errors in one place, across the entire form (errors) — same with touched.
  - So unless you explicitly control:
  - when to show those errors
  - and only for fields belonging to the current step
  - Formik will happily render errors for all fields.

- The Fix
