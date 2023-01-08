import { spinnerUtil } from '../common/spinnerUtil';
import { common } from '../common/disp_common';
import axios from 'axios';
import Swal from 'sweetalert2';

new common();

document.addEventListener('DOMContentLoaded', () => {

    let syncBtn = document.getElementById('env_sync_btn');
    syncBtn?.addEventListener('click', async (ev) => {
        spinnerUtil.startSpinner();

        let envSyncUrl = (document.querySelector('#env_sync_url') as HTMLInputElement).value;

        await axios.get(envSyncUrl, {
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