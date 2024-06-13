import { spinnerUtil } from '../common/spinnerUtil';
import { common } from '../common/disp_common';
import saveAs from "file-saver";
import axios from 'axios';
import Swal from 'sweetalert2';

new common();

document.addEventListener('DOMContentLoaded', () => {

    let deployBtns = document.querySelectorAll('.deploy_btn');
    deployBtns.forEach(deployBtn => {
        deployBtn.addEventListener('click', async (ev) => {
            try {
                spinnerUtil.startSpinner();
                let currentBtn = ev.target as HTMLInputElement;
                let currentBtnId = currentBtn.id;

                // id = 'xxx_xxx_btn' xxx_xxxの部分を取得
                let uniqueStrOfId = currentBtnId.slice(0, (currentBtnId.length - 4));
                let url = (document.querySelector('#' + uniqueStrOfId + '_url') as HTMLInputElement).value;
                let targetUrl = url + '?TrnDeployPresetId=' + (document.querySelector('#TrnDeployPresetId') as HTMLInputElement).value;

                //postする
                let getConfirmMessageUrl = (document.querySelector('#get_confirm_message_url') as HTMLInputElement).value;
                let targetUrlRequireCheck = getConfirmMessageUrl + '?TrnDeployPresetId=' + (document.querySelector('#TrnDeployPresetId') as HTMLInputElement).value + '&UrlKind=' + uniqueStrOfId;

                var checkResult = await axios.post(targetUrlRequireCheck, null, {
                    'headers': {
                        'Content-Type': 'application/json'
                    }
                });


                var stopProcess = false;
                if (checkResult.data.isError) {
                    throw {
                        response: {
                            data: checkResult.data.message
                        }
                    };
                } else if (!checkResult.data.isNoProblem) {
                    spinnerUtil.stopSpinner();
                    const result = await Swal.fire({
                        icon: checkResult.data.isWarn ? 'warning' : 'info',
                        title: checkResult.data.isWarn ? '警告' : '情報',
                        html: checkResult.data.message,
                        showDenyButton: checkResult.data.isWarn,
                        confirmButtonText: 'はい',
                        denyButtonText: 'やめる'
                    });
                    spinnerUtil.startSpinner();
                    console.log(result);
                    stopProcess = result.isDenied;
                }
                if (stopProcess) {
                    return;
                }


                let resp = await axios.post(targetUrl, null, {
                    'headers': {
                        'Content-Type': 'application/json'
                    }
                });

                spinnerUtil.stopSpinner();
                // 成功の処理
                Swal.fire({
                    icon: 'success',
                    title: '成功',
                    html: resp.data?.logMessage
                });
            } catch (err: any) {
                console.error(err);

                if (err?.response?.data && err.response.data instanceof Blob) {
                    const responseJsonString = await (err.response.data as Blob).text();
                    const responseJson = JSON.parse(responseJsonString);
                    const responseMessage = responseJson[""][0];
                    const requestUrl = responseMessage.split('RequestUri: ')[1].split("'")[1];
                    const subDomain = new URL(requestUrl).host.split(".").shift();
                    const errorReasonJson = JSON.parse('{"code":' + responseMessage.split('{"code":')[1]);
                    Swal.fire({
                        icon: 'error',
                        title: 'エラー',
                        html: "サブドメイン : " + subDomain + "<br><br>" + errorReasonJson['message']
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'エラー',
                        html: JSON.stringify(err.response.data)
                    });
                }
            } finally {
                spinnerUtil.stopSpinner();
            }

        });
    })

    let backupBtns = document.querySelectorAll('.backup_btn');
    backupBtns.forEach(backupBtn => {
        backupBtn.addEventListener('click', async (ev) => {
            try {
                spinnerUtil.startSpinner();
                let currentBtn = ev.target as HTMLInputElement;
                let currentBtnId = currentBtn.id;

                // id = 'xxx_xxx_btn' xxx_xxxの部分を取得
                let uniqueStrOfId = currentBtnId.slice(0, (currentBtnId.length - 4));
                let url = (document.querySelector('#' + uniqueStrOfId + '_url') as HTMLInputElement).value;
                let targetUrl = url + '?TrnDeployPresetId=' + (document.querySelector('#TrnDeployPresetId') as HTMLInputElement).value;

                //postする
                let getConfirmMessageUrl = (document.querySelector('#get_confirm_message_url') as HTMLInputElement).value;
                let targetUrlRequireCheck = getConfirmMessageUrl + '?TrnDeployPresetId=' + (document.querySelector('#TrnDeployPresetId') as HTMLInputElement).value + '&UrlKind=' + uniqueStrOfId;

                var checkResult = await axios.post(targetUrlRequireCheck, null, {
                    'headers': {
                        'Content-Type': 'application/json'
                    }
                });


                var stopProcess = false;
                if (checkResult.data.isError) {
                    throw {
                        response: {
                            data: checkResult.data.message
                        }
                    };
                } else if (!checkResult.data.isNoProblem) {
                    spinnerUtil.stopSpinner();
                    const result = await Swal.fire({
                        icon: checkResult.data.isWarn ? 'warning' : 'info',
                        title: checkResult.data.isWarn ? '警告' : '情報',
                        html: checkResult.data.message,
                        showDenyButton: checkResult.data.isWarn,
                        confirmButtonText: 'はい',
                        denyButtonText: 'やめる'
                    });
                    spinnerUtil.startSpinner();
                    console.log(result);
                    stopProcess = result.isDenied;
                }
                if (stopProcess) {
                    return;
                }

                var resp = await axios.post(targetUrl, null, {
                    'headers': {
                        'Content-Type': 'application/json'
                    }
                });
                // 成功の処理
                let mineType = resp.headers["content-type"];
                const disposition = resp.headers["content-disposition"];
                let fileName = "バックアップ.zip";
                if (disposition && disposition.indexOf('attachment') !== -1) {
                    // 正規表現
                    var filenameRegex = /filename[^;=\n]=((['"]).*?\2|[^;\n]*)/;
                    var matches = filenameRegex.exec(disposition);
                    if (matches != null && matches[1]) {
                        // matches[1]でとれる⇒ filename*=utf-8''201911%E3%83%87%E3%83%BC%E3%82%BF.csv;
                        // 不要文字列を消して、デコードしてサーバからのファイル名を取得
                        fileName = decodeURI(matches[1].replace(/['"]/g, '').replace('utf-8', '').replace('UTF-8', ''));
                    }
                }
                const blob = new Blob([resp.data], { type: mineType });
                saveAs(blob, fileName);
            } catch (err: any) {
                console.error(err);

                if (err?.response?.data && err.response.data instanceof Blob) {
                    const responseJsonString = await (err.response.data as Blob).text();
                    const responseJson = JSON.parse(responseJsonString);
                    const responseMessage = responseJson[""][0];
                    const requestUrl = responseMessage.split('RequestUri: ')[1].split("'")[1];
                    const subDomain = new URL(requestUrl).host.split(".").shift();
                    const errorReasonJson = JSON.parse('{"code":' + responseMessage.split('{"code":')[1]);
                    Swal.fire({
                        icon: 'error',
                        title: 'エラー',
                        html: "サブドメイン : " + subDomain + "<br><br>" + errorReasonJson['message']
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'エラー',
                        html: JSON.stringify(err.response.data)
                    });
                }
            } finally {
                spinnerUtil.stopSpinner();
            }

        });
    })

    let restoreBtns = document.querySelectorAll('.restore_btn');
    restoreBtns.forEach(restoreBtn => {
        restoreBtn.addEventListener('click', async (ev) => {
            try {
                spinnerUtil.startSpinner();
                let currentBtn = ev.target as HTMLInputElement;
                let currentBtnId = currentBtn.id;

                // id = 'xxx_xxx_btn' xxx_xxxの部分を取得
                let uniqueStrOfId = currentBtnId.slice(0, (currentBtnId.length - 4));
                let url = (document.querySelector('#' + uniqueStrOfId + '_url') as HTMLInputElement).value;
                let targetUrl = url + '?TrnDeployPresetId=' + (document.querySelector('#TrnDeployPresetId') as HTMLInputElement).value;

                //postする
                let getConfirmMessageUrl = (document.querySelector('#get_confirm_message_url') as HTMLInputElement).value;
                let targetUrlRequireCheck = getConfirmMessageUrl + '?TrnDeployPresetId=' + (document.querySelector('#TrnDeployPresetId') as HTMLInputElement).value;
                var checkResult = await axios.post(targetUrlRequireCheck, null, {
                    'headers': {
                        'Content-Type': 'application/json'
                    }
                });


                var stopProcess = false;
                if (checkResult.data.isError) {
                    throw {
                        response: {
                            data: checkResult.data.message
                        }
                    };
                } else if (!checkResult.data.isNoProblem) {
                    spinnerUtil.stopSpinner();
                    const result = await Swal.fire({
                        icon: checkResult.data.isWarn ? 'warning' : 'info',
                        title: checkResult.data.isWarn ? '警告' : '情報',
                        html: checkResult.data.message,
                        showDenyButton: checkResult.data.isWarn,
                        confirmButtonText: 'はい',
                        denyButtonText: 'やめる'
                    });
                    spinnerUtil.startSpinner();
                    console.log(result);
                    stopProcess = result.isDenied;
                }
                if (stopProcess) {
                    return;
                }

                var params = new FormData();
                let postFile = document.getElementById('restore_backup_file') as HTMLInputElement;
                if (postFile != null && postFile.files != null && postFile.files.length > 0) {
                    params.append('postedFile', postFile.files[0]);
                }

                var resp = await axios.post(targetUrl, params, {
                    'headers': {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                // 成功の処理
                Swal.fire({
                    icon: 'success',
                    title: '成功',
                    html: resp.data?.logMessage
                });
            } catch (err: any) {
                console.error(err);

                if (err?.response?.data && err.response.data instanceof Blob) {
                    const responseJsonString = await (err.response.data as Blob).text();
                    const responseJson = JSON.parse(responseJsonString);
                    const responseMessage = responseJson[""][0];
                    const requestUrl = responseMessage.split('RequestUri: ')[1].split("'")[1];
                    const subDomain = new URL(requestUrl).host.split(".").shift();
                    const errorReasonJson = JSON.parse('{"code":' + responseMessage.split('{"code":')[1]);
                    Swal.fire({
                        icon: 'error',
                        title: 'エラー',
                        html: "サブドメイン : " + subDomain + "<br><br>" + errorReasonJson['message']
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'エラー',
                        html: JSON.stringify(err.response.data)
                    });
                }
            } finally {
                spinnerUtil.stopSpinner();
            }

        });
    });
});
