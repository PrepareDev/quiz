import type { InferGetStaticPropsType, GetStaticProps } from 'next'
import { api } from "~/utils/api";


export default function Quiz() {
    const category = api.categeory.getAll.useQuery()

    return (
        <div>
            {category.data ? category.data.map(el => <div>{el.id} {el.name}</div>) : <div>error</div>}
        </div>
    )
}