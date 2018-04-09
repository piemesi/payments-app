const url = 'http://localhost:3006';


export const getHashOffersRoute = () => `${url}/offers/`

export const getAuthorDetailsRoute = (authorId) => {
	return `${url}/author-details/${authorId}`
}
