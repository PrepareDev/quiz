import { api } from "~/utils/api";


export default function Quiz() {
    const category = api.categeory.getAll.useQuery()
    
    return (
        <div>
            {category.data ? category.data.map(el => <div key={el.id}>{el.id} {el.name}</div>) : <div>error</div>}
        </div>
    )
}