// export const getSearchDataByQuery = (query) => {
//     // The fetch api could be replaced with axios for instance for cleaner syntax and browser support.
//     return fetch(`http://www.omdbapi.com/?apikey=787da130&s=${query}`)
//             .then((response) => !console.log('response',response) && response.json()).then((data) => data)
// };

//
export async function getSearchDataByQuery(query) {
    try{
        let response = await fetch(`http://www.omdbapi.com/?apikey=787da130&s=${query}`);
        return await response.json();
    }catch(error){
        return error;
    }
}

