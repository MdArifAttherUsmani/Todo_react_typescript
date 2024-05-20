import {ReactNode, createContext, useState, useContext } from "react";

export type TodosProvidertype = {
    children : ReactNode
}

export type MyTodo ={
    id:string
    task:string
    completed:boolean
    createdAt: Date
}

export type TodosContext = {
    todos : MyTodo[]
    handleAddTodo:(task:string) =>void
    toggleTodoCompleted:(id:string)=>void
    handleDeleteTodo:(id:string)=>void
}

export const todosContext = createContext<TodosContext | null>(null)

export const TodosProvider = ({children}:TodosProvidertype)=>{
    
    const [todos, setTodo] = useState<MyTodo[]>(()=>{
        try {
            const newTodos = localStorage.getItem("todos") || "[]";
            return JSON.parse(newTodos) as MyTodo[]
        } catch (error) {
            return []
        }
    })
    const handleAddTodo = (task:string)=>{
        setTodo((prev)=>{
            const newTodos:MyTodo[]=[
                {
                    id:Math.random().toString(),
                    task:task,
                    completed:false,
                    createdAt:new Date()
                },
                ...prev
            ]
            // console.log(prev);
            // console.log(newTodos);
            localStorage.setItem("todos",JSON.stringify(newTodos))
            
            
            return newTodos

        })

    }

    const toggleTodoCompleted=(id:string)=>{
        setTodo((prev):MyTodo[]=>{
            let newTodos = prev.map((todo)=>{
                if(todo.id === id){
                    return {...todo,completed:!todo.completed}
                }
                return todo
            })
             localStorage.setItem("todos",JSON.stringify(newTodos))
            return newTodos
        })
    }

    const handleDeleteTodo =(id:string)=>{
        setTodo((prev)=>{
            let newTodos=prev.filter((filterTodo)=>filterTodo.id!==id)
            localStorage.setItem("todos",JSON.stringify(newTodos))
            return newTodos
        })

    }

    return  <todosContext.Provider value={{todos, handleAddTodo, toggleTodoCompleted, handleDeleteTodo}}> {children} </todosContext.Provider>
} 


export const useTodos =()=>{
    const todosConsumer = useContext(todosContext)
    if(!todosConsumer){
        throw new Error("useTodos used outside of Provider")
    }
    return  todosConsumer
}