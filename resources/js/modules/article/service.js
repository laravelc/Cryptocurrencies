import Http from '../../utils/Http'
import Transformer from '../../utils/Transformer'
import * as articleActions from './store/actions'
import axios from "axios";

function transformRequest(parms) {
    return Transformer.send(parms)
}

function transformResponse(params) {
    return Transformer.fetch(params)
}


export function articleAddRequest(params) {
    return dispatch => (
        new Promise((resolve, reject) => {
            const formData = new FormData();
            if (params.selectedFile != undefined) {
                formData.append('image', params.selectedFile)
            }
            formData.append('title', params.title)
            formData.append('description', params.description)
            formData.append('content', params.content)

            Http.defaults.headers.common.Accept = 'multipart/form-data';
            Http.post('/articles', formData)
                .then(res => {
                    dispatch(articleActions.add(transformResponse(res.data)))
                    return resolve()
                })
                .catch((err) => {
                    const statusCode = err.response.status;
                    const data = {
                        error: null,
                        statusCode,
                    };

                    if (statusCode === 422) {
                        const resetErrors = {
                            errors: err.response.data,
                            replace: false,
                            searchStr: '',
                            replaceStr: '',
                        };
                        data.error = Transformer.resetValidationFields(resetErrors);
                    } else if (statusCode === 401) {
                        data.error = err.response.data.message;
                    }
                    return reject(data);
                })
        })
    )
}

export function articleUpdateRequest(params) {
    return dispatch => (
        new Promise((resolve, reject) => {
            const formData = new FormData();
            if (params.selectedFile != undefined) {
                formData.append('image', params.selectedFile)
            }
            formData.append('title', params.title);
            formData.append('description', params.description);
            formData.append('content', params.content);
            formData.append('id', params.id);
            formData.append('_method', 'PATCH');

            Http.defaults.headers.common.Accept = 'multipart/form-data';
            Http.post(`/articles/${params.id}`, formData)
                //Http.patch(`articles/${params.id}`, transformRequest(params))
                .then(res => {
                    dispatch(articleActions.add(transformResponse(res.data)))
                    return resolve()
                })
                .catch((err) => {
                    const statusCode = err.response.status;
                    const data = {
                        error: null,
                        statusCode,
                    };

                    if (statusCode === 422) {
                        const resetErrors = {
                            errors: err.response.data,
                            replace: false,
                            searchStr: '',
                            replaceStr: '',
                        };
                        data.error = Transformer.resetValidationFields(resetErrors);
                    } else if (statusCode === 401) {
                        data.error = err.response.data.message;
                    }
                    return reject(data);
                })
        })
    )
}

export function articleRemoveRequest(id) {
    return dispatch => {
        Http.delete(`articles/${id}`)
            .then(() => {
                dispatch(articleActions.remove(id))
            })
            .catch((err) => {
                // TODO: handle err
                console.error(err.response)
            })
    }
}

/**
 * ???????????????? ???????????? Article
 * @param params (1-?? - ?????????? ????????????????, Url - ???????????? ??????????????????)
 * @returns {function(...[*]=)}
 */
export function articleListRequest(params) {

    let {pageNumber = 1, url = '/articles'} = params

    return dispatch => {
        if (pageNumber > 1) {
            url = url + `?page=${pageNumber}`
        }

        Http.get(url)
            .then((res) => {
                dispatch(articleActions.list(transformResponse(res.data)))
            })
            .catch((err) => {
                // TODO: handle err
                console.error(err.response)
            })
    }
}

export function articleEditRequest(id) {
    return dispatch => {
        Http.get(`articles/${id}`)
            .then((res) => {
                dispatch(articleActions.add(transformResponse(res.data)))
            })
            .catch((err) => {
                // TODO: handle err
                console.error(err.response)
            })
    }
}

export function articleFetchRequest(slug) {
    return dispatch => {
        Http.get(`articles/published/${slug}`)
            .then((res) => {
                dispatch(articleActions.add(transformResponse(res.data)))
            })
            .catch((err) => {
                // TODO: handle err
                console.error(err.response)
            })
    }
}
