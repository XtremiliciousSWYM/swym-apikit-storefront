import axios from 'axios'
import qs from "qs"

const apikey =
    "5h3hT7hMOLwMan8ktVubhMNmMmaeLSUXNiiksMiYttekLaJ6k1GjJMcntqh4G1OpYTUlBmW58r82duwQJF-P1w";
const pid = "+pxGce9PbGdFuQYBCViiiol74a7VEIWjEi1rmNHmdAQ=";
const endpoint = "https://swymstore-v3dev-01-01.swymrelay.com";

const config = {
    storefrontAccessToken: 'd5ce1088134f96f92c84dd3a35162375', //Get from Shopify Develop app
    storefrontGraphqlEndpoint:
        'https://exploration-dev.myshopify.com/api/2021-07/graphql.json', //Shopiy Store url with graphql endpoint
    swymPid: '+pxGce9PbGdFuQYBCViiiol74a7VEIWjEi1rmNHmdAQ=', //Unique provider id from Swym Dashboard
    swymHost: 'https://swymstore-v3dev-01-01.swymrelay.com', //Get from Swym Dashboard
    swymLname: 'My Wishlist',
}

let hdls_ls_name = 'hdls_ls' // Local Storage Key storing config and list objects



export const swymPostData = async (url = "", data = {}, successCallback, failureCallback) => {

    var data = qs.stringify(data);


    console.log(url, data)

    // Default options are marked with *
    return await axios({
        method: "POST",
        url: url,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data: data,
    }).then(function (response) {
        //console.log(response.data);
        if (successCallback) {
            successCallback(response.data)
        }
        return response.data;

    }).catch(function (error) {
        console.log(error);
        if (failureCallback) {
            failureCallback(error);
        }

        return error;
    });
}

function createSwymSession(len) {
    // Len is length usually 64
    var outStr = '',
        newStr
    while (outStr.length < len) {
        newStr = Math.random().toString(36 /*radix*/).slice(2 /* drop decimal*/)
        outStr += newStr.slice(0, Math.min(newStr.length, len - outStr.length))
    }

    var timestamp = Date.now()

    var swymSession = {
        sessionid: outStr.toLowerCase(),
        timestamp: timestamp,
    }

    return swymSession
}

function compareTimestamp(endDate, startDate) {
    var diff = endDate - startDate
    return diff / 60000
}

async function hdls_SetLocalStorage(swymData) {
    var hdls_ls = JSON.parse(localStorage.getItem(hdls_ls_name))

    var addData = {
        // ...hdls_ls,
        ...swymData,
    }

    localStorage.setItem(hdls_ls_name, JSON.stringify(addData))

    console.log(swymData)

    return addData
}

export async function initDefaultWishlist(swymConfig) {
    console.log('Hdls - Fetching or Creating List for Current Regid')

    return fetch(
        `${config.swymHost
        }/api/v3/lists/fetch-lists?pid=${encodeURIComponent(
            config.swymPid
        )}`,
        {
            body: `regid=${swymConfig.regid}&sessionid=${swymConfig.sessionid}`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            method: 'POST',
        }
    )
        .then((response) => response.json())
        .then((data) => {
            if (data.length) {
                console.log('Hdls - List Fetched for User')

                return data[0]
            } else {
                return fetch(
                    `${config.swymHost
                    }/api/v3/lists/create?pid=${encodeURIComponent(
                        config.swymPid
                    )}`,
                    {
                        body: `lname=${config.swymLname}&sessionid=${swymConfig.sessionid}&regid=${swymConfig.regid}`,
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        method: 'POST',
                    }
                )
                    .then((response) => response.json())
                    .then((data) => {
                        console.log('Hdls - List Created for User')

                        return data
                    })
            }
        })
}

export async function refreshSwymConfig(swymConfig, skipCheck = false) {


    if (window._isSwymLoading && !skipCheck) {
        return;
    }

    var hdls_ls = JSON.parse(localStorage.getItem(hdls_ls_name))

    window._isSwymLoading = true;
    var swymConfigData = { ...hdls_ls, ...swymConfig }

    //console.log(swymConfigData)

    if (swymConfigData == null || Object.keys(swymConfigData).length === 0) {
        console.log('Regid not found on refresh', swymConfig)

        var swymRegid = await generateSwymConfig(null)
        swymConfigData = { ...swymConfigData, ...swymRegid }
        return refreshSwymConfig(swymConfigData, true)
    } else if (
        swymConfigData.swymSession != null &&
        compareTimestamp(Date.now(), swymConfigData.swymSession.timestamp) >= 30
    ) {
        var swymSession = { swymSession: createSwymSession(24) }
        swymConfigData = { ...swymConfigData, ...swymSession }

        console.log('SwymSession not found on refresh', swymSession, swymConfigData)

        return refreshSwymConfig(swymConfigData, true)
    } else if (typeof swymConfigData.lid == 'undefined') {
        console.log('List not found on refresh', swymConfigData)

        var list = await initDefaultWishlist(swymConfigData)
        swymConfigData = { ...swymConfigData, ...list }
        localStorage.setItem(hdls_ls_name, JSON.stringify(swymConfigData))

        window._isSwymLoading = false;
        return swymConfigData
    } else {
        localStorage.setItem(hdls_ls_name, JSON.stringify(swymConfigData))

        window._isSwymLoading = false;
        return swymConfigData
    }
}

export async function generateSwymConfig(customerToken) {
    if (customerToken != null) {
        var data = await hdls_GetCustomerEmail(customerToken)

        console.log(data.data.customer)
        var hdls_ls = JSON.parse(localStorage.getItem(hdls_ls_name))

        var extuid = "TODO"

        var myHeaders = new Headers()
        myHeaders.append('Content-Type', 'application/x-www-form-urlencoded')

        var urlencoded = new URLSearchParams()
        urlencoded.append('regid', hdls_ls.regid)
        urlencoded.append('sessionid', hdls_ls.swymSession.sessionid)
        urlencoded.append('platform', 'shopify')
        urlencoded.append('extuid', parseInt(extuid))

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow',
        }

        return fetch(
            `https://swymstore-v3dev-01-01.swymrelay.com/api/v3/lists/user-validate-sync?pid=${encodeURIComponent(
                config.swymPid
            )}`,
            requestOptions
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Hdls - User Login Detected and RegID generated', result)

                const swymConfig = {
                    regid: result.regid,
                    swymSession: {
                        sessionid: hdls_CreateSessionid(32),
                        timestamp: Date.now(),
                    },
                }

                return swymConfig
            })
            .catch((error) => {
                console.log('error', error)

                return error
            })
    } else {
        return fetch(
            `${config.swymHost
            }/api/v3/provider/register?pid=${encodeURIComponent(
                config.swymPid
            )}`,
            {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                method: 'POST',
            }
        )
            .then((response) => response.json())
            .then((result) => {
                console.log('Hdls - User Logout Detected and RegID generated')

                const swymConfig = {
                    regid: result.regid,
                    swymSession: createSwymSession(24),
                }

                return swymConfig
            })
            .catch((error) => {
                console.log('error', error)

                return error
            })
    }
}

export const utils = {
    swymPostData,
    refreshSwymConfig
}


export default utils
