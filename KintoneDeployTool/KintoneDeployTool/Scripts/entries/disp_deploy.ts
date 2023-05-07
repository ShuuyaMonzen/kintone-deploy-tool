import { spinnerUtil } from '../common/spinnerUtil';
import { common } from '../common/disp_common';
import axios from 'axios';
import Swal from 'sweetalert2';

new common();

document.addEventListener('DOMContentLoaded', () => {

    let deployBtns = document.querySelectorAll('.deploy_btn');
    deployBtns.forEach(deployBtn => {
        deployBtn.addEventListener('click', async (ev) => {
            spinnerUtil.startSpinner()
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
            spinnerUtil.stopSpinner();


            var stopProcess = false;
            if (checkResult.data.isError) {
                await Swal.fire({
                    icon: 'error',
                    title: 'エラー',
                    html: checkResult.data.message,
                    confirmButtonText: 'はい',
                }).then(function (result) {
                    console.log(result);
                    stopProcess = true;
                });
            } else if (!checkResult.data.isNoProblem) {
                await Swal.fire({
                    icon: checkResult.data.isWarn ? 'warning' : 'info',
                    title: checkResult.data.isWarn ? '警告' : '情報',
                    html: checkResult.data.message,
                    showDenyButton: checkResult.data.isWarn,
                    confirmButtonText: 'はい',
                    denyButtonText: 'やめる'
                }).then(function (result) {
                    console.log(result);
                    stopProcess = result.isDenied;
                });
            }
            if (stopProcess) {
                return;
            }


            spinnerUtil.startSpinner();
            await axios.post(targetUrl, null, {
                'headers': {
                    'Content-Type': 'application/json'
                }
            }).then((resp) => {
                spinnerUtil.stopSpinner();
                // 成功の処理
                Swal.fire({
                    icon: 'success',
                    title: '成功'
                });
            }).catch((err) => {
                // エラーの処理
                console.error(err);
                spinnerUtil.stopSpinner();

                let errorMsg = err.response.data.param[0] as String;
                var errorDetails = errorMsg.split('{"code"');
                if (errorDetails.length >= 2) {
                    Swal.fire({
                        icon: 'error',
                        title: 'エラー',
                        html: '{"code"' + errorDetails[1]
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'エラー',
                        html: errorMsg
                    });
                }
            });

        });
    })

    let restoreBtns = document.querySelectorAll('.restore_btn');
    restoreBtns.forEach(restoreBtn => {
        restoreBtn.addEventListener('click', async (ev) => {
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
            spinnerUtil.stopSpinner();


            var stopProcess = false;
            if (checkResult.data.isError) {
                await Swal.fire({
                    icon: 'error',
                    title: 'エラー',
                    html: checkResult.data.message,
                    confirmButtonText: 'はい',
                }).then(function (result) {
                    console.log(result);
                    stopProcess = true;
                });
            } else if (!checkResult.data.isNoProblem) {
                await Swal.fire({
                    icon: checkResult.data.isWarn ? 'warning' : 'info',
                    title: checkResult.data.isWarn ? '警告' : '情報',
                    html: checkResult.data.message,
                    showDenyButton: checkResult.data.isWarn,
                    confirmButtonText: 'はい',
                    denyButtonText: 'やめる'
                }).then(function (result) {
                    console.log(result);
                    stopProcess = result.isDenied;
                });
            }
            if (stopProcess) {
                return;
            }

            spinnerUtil.startSpinner();
            var params = new FormData();
            let postFile = document.getElementById('restore_backup_file') as HTMLInputElement;
            if (postFile != null && postFile.files != null && postFile.files.length > 0) {
                params.append('postedFile', postFile.files[0]);
            }

            await axios.post(targetUrl, params, {
                'headers': {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((args) => {
                spinnerUtil.stopSpinner();
                // 成功の処理
                Swal.fire({
                    icon: 'success',
                    title: '成功'
                });
            }).catch((err) => {
                // エラーの処理
                console.error(err);
                spinnerUtil.stopSpinner();

                let errorMsg = err.response.data.param[0] as String;
                var errorDetails = errorMsg.split('{"code"');
                if (errorDetails.length >= 2) {
                    Swal.fire({
                        icon: 'error',
                        title: 'エラー',
                        html: '{"code"' + errorDetails[1]
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'エラー',
                        html: errorMsg
                    });
                }
            });

        });
    });


});
