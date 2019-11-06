export async function getSearchDataByQuery(query) {
    try{
        const response = await fetch(`http://www.omdbapi.com/?apikey=787da130&s=${query}`);
        const data = await response.json();
        return { ...data, status: response.status };
    }catch(error){
        return {error, status: 404}
    }
}

