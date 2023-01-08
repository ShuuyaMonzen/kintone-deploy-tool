var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { spinnerUtil } from '../common/spinnerUtil';
import { common } from '../common/disp_common';
import axios from 'axios';
import Swal from 'sweetalert2';
new common();
document.addEventListener('DOMContentLoaded', function () {
    var deployBtns = document.querySelectorAll('.deploy_btn');
    deployBtns.forEach(function (deployBtn) {
        deployBtn.addEventListener('click', function (ev) { return __awaiter(void 0, void 0, void 0, function () {
            var currentBtn, currentBtnId, uniqueStrOfId, url, targetUrl, getConfirmMessageUrl, targetUrlRequireCheck, checkResult, stopProcess;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spinnerUtil.startSpinner();
                        currentBtn = ev.target;
                        currentBtnId = currentBtn.id;
                        uniqueStrOfId = currentBtnId.slice(0, (currentBtnId.length - 4));
                        url = document.querySelector('#' + uniqueStrOfId + '_url').value;
                        targetUrl = url + '?TrnDeployPresetId=' + document.querySelector('#TrnDeployPresetId').value;
                        getConfirmMessageUrl = document.querySelector('#get_confirm_message_url').value;
                        targetUrlRequireCheck = getConfirmMessageUrl + '?TrnDeployPresetId=' + document.querySelector('#TrnDeployPresetId').value;
                        return [4 /*yield*/, axios.post(targetUrlRequireCheck, null, {
                                'headers': {
                                    'Content-Type': 'application/json'
                                }
                            })];
                    case 1:
                        checkResult = _a.sent();
                        spinnerUtil.stopSpinner();
                        stopProcess = false;
                        if (!checkResult.data.isError) return [3 /*break*/, 3];
                        return [4 /*yield*/, Swal.fire({
                                icon: 'error',
                                title: 'エラー',
                                html: checkResult.data.message,
                                confirmButtonText: 'はい',
                            }).then(function (result) {
                                console.log(result);
                                stopProcess = true;
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (!!checkResult.data.isNoProblem) return [3 /*break*/, 5];
                        return [4 /*yield*/, Swal.fire({
                                icon: checkResult.data.isWarn ? 'warning' : 'info',
                                title: checkResult.data.isWarn ? '警告' : '情報',
                                html: checkResult.data.message,
                                showDenyButton: checkResult.data.isWarn,
                                confirmButtonText: 'はい',
                                denyButtonText: 'やめる'
                            }).then(function (result) {
                                console.log(result);
                                stopProcess = result.isDenied;
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (stopProcess) {
                            return [2 /*return*/];
                        }
                        spinnerUtil.startSpinner();
                        return [4 /*yield*/, axios.post(targetUrl, null, {
                                'headers': {
                                    'Content-Type': 'application/json'
                                }
                            }).then(function (resp) {
                                spinnerUtil.stopSpinner();
                                // 成功の処理
                                Swal.fire({
                                    icon: 'success',
                                    title: '成功'
                                });
                            }).catch(function (err) {
                                // エラーの処理
                                console.error(err);
                                spinnerUtil.stopSpinner();
                                var errorMsg = err.response.data.param[0];
                                var errorDetails = errorMsg.split('{"code"');
                                if (errorDetails.length >= 2) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'エラー',
                                        html: '{"code"' + errorDetails[1]
                                    });
                                }
                                else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'エラー',
                                        html: errorMsg
                                    });
                                }
                            })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    var restoreBtns = document.querySelectorAll('.restore_btn');
    restoreBtns.forEach(function (restoreBtn) {
        restoreBtn.addEventListener('click', function (ev) { return __awaiter(void 0, void 0, void 0, function () {
            var currentBtn, currentBtnId, uniqueStrOfId, url, targetUrl, getConfirmMessageUrl, targetUrlRequireCheck, checkResult, stopProcess, params, postFile;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        spinnerUtil.startSpinner();
                        currentBtn = ev.target;
                        currentBtnId = currentBtn.id;
                        uniqueStrOfId = currentBtnId.slice(0, (currentBtnId.length - 4));
                        url = document.querySelector('#' + uniqueStrOfId + '_url').value;
                        targetUrl = url + '?TrnDeployPresetId=' + document.querySelector('#TrnDeployPresetId').value;
                        getConfirmMessageUrl = document.querySelector('#get_confirm_message_url').value;
                        targetUrlRequireCheck = getConfirmMessageUrl + '?TrnDeployPresetId=' + document.querySelector('#TrnDeployPresetId').value;
                        return [4 /*yield*/, axios.post(targetUrlRequireCheck, null, {
                                'headers': {
                                    'Content-Type': 'application/json'
                                }
                            })];
                    case 1:
                        checkResult = _a.sent();
                        spinnerUtil.stopSpinner();
                        stopProcess = false;
                        if (!checkResult.data.isError) return [3 /*break*/, 3];
                        return [4 /*yield*/, Swal.fire({
                                icon: 'error',
                                title: 'エラー',
                                html: checkResult.data.message,
                                confirmButtonText: 'はい',
                            }).then(function (result) {
                                console.log(result);
                                stopProcess = true;
                            })];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 5];
                    case 3:
                        if (!!checkResult.data.isNoProblem) return [3 /*break*/, 5];
                        return [4 /*yield*/, Swal.fire({
                                icon: checkResult.data.isWarn ? 'warning' : 'info',
                                title: checkResult.data.isWarn ? '警告' : '情報',
                                html: checkResult.data.message,
                                showDenyButton: checkResult.data.isWarn,
                                confirmButtonText: 'はい',
                                denyButtonText: 'やめる'
                            }).then(function (result) {
                                console.log(result);
                                stopProcess = result.isDenied;
                            })];
                    case 4:
                        _a.sent();
                        _a.label = 5;
                    case 5:
                        if (stopProcess) {
                            return [2 /*return*/];
                        }
                        spinnerUtil.startSpinner();
                        params = new FormData();
                        postFile = document.getElementById('restore_backup_file');
                        if (postFile != null && postFile.files != null && postFile.files.length > 0) {
                            params.append('postedFile', postFile.files[0]);
                        }
                        return [4 /*yield*/, axios.post(targetUrl, params, {
                                'headers': {
                                    'Content-Type': 'multipart/form-data'
                                }
                            }).then(function (args) {
                                spinnerUtil.stopSpinner();
                                // 成功の処理
                                Swal.fire({
                                    icon: 'success',
                                    title: '成功'
                                });
                            }).catch(function (err) {
                                // エラーの処理
                                console.error(err);
                                spinnerUtil.stopSpinner();
                                var errorMsg = err.response.data.param[0];
                                var errorDetails = errorMsg.split('{"code"');
                                if (errorDetails.length >= 2) {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'エラー',
                                        html: '{"code"' + errorDetails[1]
                                    });
                                }
                                else {
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'エラー',
                                        html: errorMsg
                                    });
                                }
                            })];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
//# sourceMappingURL=disp_deploy.js.map